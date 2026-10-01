import { describe, expect, it } from "vitest";
import data from "../data/shipment.json";
import { calcLandedCost, categoryBreakdown } from "./calc.js";
import { auditBills, dutyChecked } from "./audit.js";

const { shipment, quote, bills, lateBill } = data;

const run = (billSet, statuses = {}) => {
  const flags = auditBills(shipment, quote, billSet).map((f) => ({
    ...f,
    status: statuses[f.id] ?? "open",
  }));
  return { flags, cost: calcLandedCost(shipment, quote, billSet, flags) };
};

describe("initial state", () => {
  const { flags, cost } = run(bills);

  it("matches the expected totals", () => {
    expect(cost.actualTotal).toBe(14200);
    expect(cost.expectedTotal).toBe(13560);
    expect(cost.actualPerUnit).toBeCloseTo(14.2, 10);
    expect(cost.expectedPerUnit).toBeCloseTo(13.56, 10);
    expect(cost.moneyAtRisk).toBe(640);
  });

  it("raises two flags, high severity first", () => {
    expect(flags.map((f) => [f.id, f.severity, f.amountAtRisk])).toEqual([
      ["FLAG-INV-2231-L3", "high", 420],
      ["FLAG-HT-8812-L1", "review", 220],
    ]);
  });

  it("flags only the second fuel surcharge line as a duplicate", () => {
    const dupes = flags.filter((f) => f.rule === "duplicate");
    expect(dupes).toHaveLength(1);
    expect(dupes[0].lineId).toBe("INV-2231-L3");
    expect(dupes[0].reason).toBe(
      "Fuel surcharge (BAF) appears twice on BlueWave Logistics invoice INV-2231. The quote includes it once."
    );
  });

  it("flags demurrage as not in quote", () => {
    const f = flags.find((x) => x.lineId === "HT-8812-L1");
    expect(f.rule).toBe("not_in_quote");
    expect(f.reason).toMatch(/^Demurrage wasn't in the quote/);
  });

  it("passes the duty check", () => {
    expect(dutyChecked(shipment, bills)).toBe(true);
    expect(flags.some((f) => f.rule === "duty_mismatch")).toBe(false);
  });

  it("breaks cost down by category", () => {
    const rows = categoryBreakdown(bills).map((r) => [r.label, r.amount, r.percent.toFixed(1)]);
    expect(rows).toEqual([
      ["Product", 11000, "77.5"],
      ["Freight", 2190, "15.4"],
      ["Customs", 790, "5.6"],
      ["Extra charges", 220, "1.5"],
    ]);
  });
});

describe("after the late bill", () => {
  const { flags, cost } = run([...bills, lateBill]);

  it("matches the expected totals", () => {
    expect(cost.actualTotal).toBe(14380);
    expect(cost.expectedTotal).toBe(13560);
    expect(cost.actualPerUnit).toBeCloseTo(14.38, 10);
    expect(cost.moneyAtRisk).toBe(820);
  });

  it("adds a storage flag", () => {
    expect(flags).toHaveLength(3);
    const f = flags.find((x) => x.id === "FLAG-HT-8840-L1");
    expect(f.amountAtRisk).toBe(180);
    expect(f.reason).toMatch(/^Storage fee wasn't in the quote/);
  });
});

describe("flag status", () => {
  it("approving removes the amount from money at risk", () => {
    const { cost } = run(bills, { "FLAG-HT-8812-L1": "approved" });
    expect(cost.moneyAtRisk).toBe(420);
  });

  it("disputing keeps money at risk and lowers the cost if disputes win", () => {
    const { cost } = run(bills, { "FLAG-INV-2231-L3": "disputed" });
    expect(cost.moneyAtRisk).toBe(640);
    expect(cost.costIfDisputesWin).toBe(13780);
    expect(cost.perUnitIfDisputesWin).toBeCloseTo(13.78, 10);
  });
});

describe("other audit rules", () => {
  const synthetic = (lines) => [
    { id: "X-1", vendor: "BlueWave Logistics", lines: lines.map((l, i) => ({ id: `X-1-L${i + 1}`, ...l })) },
  ];

  it("flags a charge billed above the quote for the difference", () => {
    const flags = auditBills(shipment, quote,
      synthetic([{ chargeType: "ocean_freight", description: "Ocean freight", amount: 1350 }]));
    expect(flags).toHaveLength(1);
    expect(flags[0]).toMatchObject({ rule: "above_quote", severity: "review", amountAtRisk: 150 });
    expect(flags[0].reason).toBe("Ocean freight billed at $1,350, quoted at $1,200. $150 over.");
  });

  it("flags duty that does not match the declared rate", () => {
    const flags = auditBills(shipment, quote,
      synthetic([{ chargeType: "duty", description: "Import duty", amount: 610 }]));
    expect(flags[0].rule).toBe("duty_mismatch");
    expect(flags[0].reason).toBe("Duty billed at $610, expected $550 (5% of $11,000).");
  });

  it("uses the generic reason for an unknown unquoted charge", () => {
    const flags = auditBills(shipment, quote,
      synthetic([{ chargeType: "chassis_fee", description: "Chassis fee", amount: 90 }]));
    expect(flags[0].reason).toBe("Chassis fee wasn't in the quote. Ask BlueWave Logistics what it covers.");
  });
});

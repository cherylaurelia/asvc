import { money } from "./format.js";

const SEVERITY_RANK = { high: 0, review: 1 };
const DUTY_TOLERANCE = 1;

export const expectedDuty = (shipment) => shipment.declaredValue * shipment.dutyRate;

export function makeFlag(bill, line, rule, severity, amountAtRisk, reason) {
  return {
    id: `FLAG-${line.id}`,
    lineId: line.id,
    billId: bill.id,
    vendor: bill.vendor,
    description: line.description,
    rule,
    severity,
    amountAtRisk,
    reason,
  };
}

const notInQuoteReason = (bill, line) => {
  if (line.chargeType === "demurrage")
    return "Demurrage wasn't in the quote. Check whether the delay was caused by your side or the carrier's.";
  if (line.chargeType === "storage")
    return "Storage fee wasn't in the quote. Check how long the goods sat at the terminal and why.";
  return `${line.description} wasn't in the quote. Ask ${bill.vendor} what it covers.`;
};

// First matching rule wins, so a line gets at most one flag.
function auditLine(shipment, quote, bill, line, index) {
  if (line.chargeType === "product") return null;

  const isDuplicate = bill.lines
    .slice(0, index)
    .some((prev) => prev.chargeType === line.chargeType && prev.amount === line.amount);
  if (isDuplicate) {
    return makeFlag(bill, line, "duplicate", "high", line.amount,
      `${line.description} appears twice on ${bill.vendor} invoice ${bill.id}. The quote includes it once.`);
  }

  if (line.chargeType === "duty") {
    const expected = expectedDuty(shipment);
    const diff = Math.abs(line.amount - expected);
    if (diff <= DUTY_TOLERANCE) return null;
    return makeFlag(bill, line, "duty_mismatch", "review", diff,
      `Duty billed at ${money(line.amount)}, expected ${money(expected)} (${shipment.dutyRate * 100}% of ${money(shipment.declaredValue)}).`);
  }

  const quoted = quote.lines.find((q) => q.chargeType === line.chargeType);
  if (!quoted) {
    return makeFlag(bill, line, "not_in_quote", "review", line.amount, notInQuoteReason(bill, line));
  }

  if (line.amount > quoted.amount) {
    const over = line.amount - quoted.amount;
    return makeFlag(bill, line, "above_quote", "review", over,
      `${line.description} billed at ${money(line.amount)}, quoted at ${money(quoted.amount)}. ${money(over)} over.`);
  }

  return null;
}

export function auditBills(shipment, quote, bills) {
  return bills
    .flatMap((bill) => bill.lines.map((line, i) => auditLine(shipment, quote, bill, line, i)))
    .filter(Boolean)
    .sort(
      (a, b) =>
        SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.amountAtRisk - a.amountAtRisk
    );
}

// True when duty was billed and every duty line matches the declared rate.
export function dutyChecked(shipment, bills) {
  const dutyLines = bills.flatMap((b) => b.lines).filter((l) => l.chargeType === "duty");
  return (
    dutyLines.length > 0 &&
    dutyLines.every((l) => Math.abs(l.amount - expectedDuty(shipment)) <= DUTY_TOLERANCE)
  );
}

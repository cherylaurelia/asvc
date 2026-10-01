const sum = (nums) => nums.reduce((a, b) => a + b, 0);

export const billTotal = (bill) => sum(bill.lines.map((l) => l.amount));

export function calcLandedCost(shipment, quote, bills, flags = []) {
  const actualTotal = sum(bills.map(billTotal));
  const expectedTotal =
    shipment.units * shipment.supplierUnitPrice +
    sum(quote.lines.map((l) => l.amount)) +
    shipment.declaredValue * shipment.dutyRate;

  const unresolved = flags.filter((f) => f.status === "open" || f.status === "disputed");
  const disputed = flags.filter((f) => f.status === "disputed");
  const costIfDisputesWin = actualTotal - sum(disputed.map((f) => f.amountAtRisk));

  return {
    actualTotal,
    expectedTotal,
    actualPerUnit: actualTotal / shipment.units,
    expectedPerUnit: expectedTotal / shipment.units,
    moneyAtRisk: sum(unresolved.map((f) => f.amountAtRisk)),
    unresolvedCount: unresolved.length,
    disputedCount: disputed.length,
    costIfDisputesWin,
    perUnitIfDisputesWin: costIfDisputesWin / shipment.units,
  };
}

const CATEGORIES = [
  { key: "product", label: "Product", types: ["product"] },
  { key: "freight", label: "Freight", types: ["ocean_freight", "fuel_surcharge", "destination_handling"] },
  { key: "customs", label: "Customs", types: ["brokerage", "entry_filing", "duty"] },
  { key: "extra", label: "Extra charges", types: ["demurrage", "storage"] },
];

export function categoryBreakdown(bills) {
  const lines = bills.flatMap((b) => b.lines);
  const total = sum(lines.map((l) => l.amount));
  return CATEGORIES.map(({ key, label, types }) => {
    const amount = sum(lines.filter((l) => types.includes(l.chargeType)).map((l) => l.amount));
    return { key, label, amount, percent: total ? (amount / total) * 100 : 0 };
  });
}

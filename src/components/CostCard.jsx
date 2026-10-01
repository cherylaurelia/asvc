import { money, perUnit } from "../lib/format.js";

const Label = ({ children }) => (
  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{children}</div>
);

export default function CostCard({ shipment, cost, flash }) {
  const gap = cost.actualPerUnit - cost.expectedPerUnit;
  const over = gap > 0.004;

  return (
    <section>
      <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <Label>Supplier price</Label>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-slate-700">
            {perUnit(shipment.supplierUnitPrice)}
          </div>
          <div className="mt-1 text-sm text-slate-500">per unit, {shipment.units.toLocaleString()} units</div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <Label>Expected landed cost</Label>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-slate-700">
            {perUnit(cost.expectedPerUnit)}
          </div>
          <div className="mt-1 text-sm text-slate-500">per unit, from quote</div>
        </div>

        <div className="rounded-lg border border-slate-300 bg-white p-5">
          <Label>Actual landed cost</Label>
          <div className="mt-1 flex items-baseline gap-4">
            <span
              key={cost.actualTotal}
              className={`rounded-md text-6xl font-semibold tabular-nums text-slate-900 ${flash ? "flash" : ""}`}
            >
              {perUnit(cost.actualPerUnit)}
            </span>
            <span className={`text-base font-medium tabular-nums ${over ? "text-red-600" : "text-emerald-700"}`}>
              {over ? "+" : ""}
              {perUnit(gap).replace("$-", "-$")} vs expected
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-500">per unit, {money(cost.actualTotal)} billed so far</div>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-6 text-sm">
        {cost.unresolvedCount > 0 ? (
          <span className="font-medium text-slate-900">
            <span className="tabular-nums text-red-600">{money(cost.moneyAtRisk)}</span> at risk across{" "}
            {cost.unresolvedCount} {cost.unresolvedCount === 1 ? "charge" : "charges"}
          </span>
        ) : (
          <span className="font-medium text-slate-900">$0 at risk. All flagged charges reviewed.</span>
        )}
        {cost.disputedCount > 0 && (
          <span className="text-slate-600">
            If disputes succeed:{" "}
            <span className="font-medium tabular-nums text-slate-900">{perUnit(cost.perUnitIfDisputesWin)}/unit</span>
          </span>
        )}
      </div>
    </section>
  );
}

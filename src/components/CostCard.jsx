import { money, perUnit } from "../lib/format.js";

const Label = ({ children, dark }) => (
  <div className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-stone-400" : "text-stone-500"}`}>
    {children}
  </div>
);

export default function CostCard({ shipment, cost, flash }) {
  const gap = cost.actualPerUnit - cost.expectedPerUnit;
  const over = gap > 0.004;
  const expectedShare = Math.min(100, (cost.expectedTotal / cost.actualTotal) * 100);

  return (
    <section>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.7fr]">
        <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-5">
          <Label>Supplier price</Label>
          <div>
            <div className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
              {perUnit(shipment.supplierUnitPrice)}
            </div>
            <div className="mt-1 text-sm text-stone-500">per unit, {shipment.units.toLocaleString()} units</div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-5">
          <Label>Expected landed cost</Label>
          <div>
            <div className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
              {perUnit(cost.expectedPerUnit)}
            </div>
            <div className="mt-1 text-sm text-stone-500">per unit, from quote</div>
          </div>
        </div>

        <div className="rounded-xl bg-ink p-5 text-white">
          <Label dark>Actual landed cost</Label>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-4">
            <span
              key={cost.actualTotal}
              className={`text-7xl font-semibold tracking-tighter tabular-nums ${flash ? "flash-num" : ""}`}
            >
              {perUnit(cost.actualPerUnit)}
            </span>
            <span className={`text-base font-semibold tabular-nums ${over ? "text-over" : "text-lime"}`}>
              {over ? "+" : ""}
              {perUnit(gap).replace("$-", "-$")} vs expected
            </span>
          </div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <span
              className="bg-lime transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${expectedShare}%` }}
            />
            <span className="flex-1 bg-over" />
          </div>
          <div className="mt-2 text-sm text-stone-400">per unit, {money(cost.actualTotal)} billed so far</div>
        </div>
      </div>

      <div
        className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 px-1 text-[15px]"
        aria-live="polite"
      >
        {cost.unresolvedCount > 0 ? (
          <span className="font-semibold text-ink">
            <span className="tabular-nums text-red-600">{money(cost.moneyAtRisk)}</span> at risk across{" "}
            {cost.unresolvedCount} {cost.unresolvedCount === 1 ? "charge" : "charges"}
          </span>
        ) : (
          <span className="font-semibold text-ink">$0 at risk. All flagged charges reviewed.</span>
        )}
        {cost.disputedCount > 0 && (
          <span className="text-stone-600">
            If disputes succeed:{" "}
            <span className="font-semibold tabular-nums text-ink">{perUnit(cost.perUnitIfDisputesWin)}/unit</span>
          </span>
        )}
      </div>
    </section>
  );
}

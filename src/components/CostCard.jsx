import { useEffect, useRef, useState } from "react";
import { money, perUnit } from "../lib/format.js";

// Rolls the displayed number from its previous value to the new one.
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(from + (target - from) * (1 - Math.pow(1 - progress, 4)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

const Label = ({ children }) => <div className="text-[13px] font-semibold text-muted">{children}</div>;

export default function CostCard({ shipment, cost, flash }) {
  const shownActual = useCountUp(cost.actualPerUnit);
  const gap = cost.actualPerUnit - cost.expectedPerUnit;
  const over = gap > 0.004;
  const expectedShare = Math.min(100, (cost.expectedTotal / cost.actualTotal) * 100);

  return (
    <section className="glass overflow-hidden rounded-3xl">
      <div className="grid grid-cols-1 divide-y divide-hairline md:grid-cols-[1fr_1fr_2fr] md:divide-x md:divide-y-0">
        <div className="flex flex-col justify-end gap-1 px-5 py-4 md:px-6">
          <Label>Supplier price</Label>
          <div className="text-4xl font-semibold tracking-tight tabular-nums">
            {perUnit(shipment.supplierUnitPrice)}
          </div>
          <div className="text-sm text-muted">per unit, {shipment.units.toLocaleString()} units</div>
        </div>

        <div className="flex flex-col justify-end gap-1 px-5 py-4 md:px-6">
          <Label>Expected landed cost</Label>
          <div className="text-4xl font-semibold tracking-tight tabular-nums">{perUnit(cost.expectedPerUnit)}</div>
          <div className="text-sm text-muted">per unit, from quote</div>
        </div>

        <div className="px-5 py-4 md:px-6">
          <Label>Actual landed cost</Label>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <span
              key={cost.actualTotal}
              className={`text-7xl font-bold leading-none tracking-tighter tabular-nums sm:text-8xl ${
                flash ? "flash-num" : ""
              }`}
            >
              {perUnit(shownActual)}
            </span>
            <span className={`text-lg font-semibold tabular-nums ${over ? "text-danger" : "text-success"}`}>
              {over ? "+" : ""}
              {perUnit(gap).replace("$-", "-$")} vs expected
            </span>
          </div>
          <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            <span
              className="rounded-full bg-accent transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${expectedShare}%` }}
            />
            <span className="flex-1 rounded-full bg-red" />
          </div>
          <div className="mt-2 text-sm text-muted">per unit, {money(cost.actualTotal)} billed so far</div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-hairline bg-white/40 px-5 py-2.5 text-[15px] md:px-6"
        aria-live="polite"
      >
        {cost.unresolvedCount > 0 ? (
          <span className="font-semibold">
            <span className="tabular-nums text-danger">{money(cost.moneyAtRisk)}</span> at risk across{" "}
            {cost.unresolvedCount} {cost.unresolvedCount === 1 ? "charge" : "charges"}
          </span>
        ) : (
          <span className="font-semibold">$0 at risk. All flagged charges reviewed.</span>
        )}
        {cost.disputedCount > 0 && (
          <span className="text-muted">
            If disputes succeed:{" "}
            <span className="font-semibold tabular-nums text-ink">{perUnit(cost.perUnitIfDisputesWin)}/unit</span>
          </span>
        )}
      </div>
    </section>
  );
}

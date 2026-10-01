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

const Label = ({ children }) => <div className="text-xs font-semibold text-ink/70">{children}</div>;

export default function CostCard({ shipment, cost, flash, actions }) {
  const shownActual = useCountUp(cost.actualPerUnit);
  const gap = cost.actualPerUnit - cost.expectedPerUnit;
  const over = gap > 0.004;
  const expectedShare = Math.min(100, (cost.expectedTotal / cost.actualTotal) * 100);

  return (
    <>
      <section className="hero grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-[1fr_minmax(0,30rem)]">
        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs text-ink/70">Shipment {shipment.id}</p>
            <h1 className="mt-1 max-w-md text-balance text-3xl leading-[1.1] tracking-tight uppercase">
              {shipment.name}
            </h1>
          </div>
          <div className="grid max-w-md grid-cols-2 gap-3">
            <div className="glass rounded-2xl px-4 py-3">
              <Label>Supplier price</Label>
              <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {perUnit(shipment.supplierUnitPrice)}
              </div>
              <div className="text-xs text-ink/70">per unit, {shipment.units.toLocaleString()} units</div>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <Label>Expected landed cost</Label>
              <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {perUnit(cost.expectedPerUnit)}
              </div>
              <div className="text-xs text-ink/70">per unit, from quote</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-end gap-3">{actions}</div>
          <div className="rounded-2xl bg-ink px-5 py-4 text-white">
            <div className="text-xs font-semibold text-white/70">Actual landed cost</div>
            <div className="flex flex-wrap items-baseline gap-x-4">
              <span
                key={cost.actualTotal}
                className={`text-7xl font-semibold leading-none tracking-tighter tabular-nums ${
                  flash ? "flash-num" : ""
                }`}
              >
                {perUnit(shownActual)}
              </span>
              <span className={`text-base font-semibold tabular-nums ${over ? "text-over" : "text-lime"}`}>
                {over ? "+" : ""}
                {perUnit(gap).replace("$-", "-$")} vs expected
              </span>
            </div>
            <div className="mt-3 flex h-1.5 gap-0.5" aria-hidden="true">
              <span
                className="rounded-full bg-lime transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${expectedShare}%` }}
              />
              <span className="flex-1 rounded-full bg-over" />
            </div>
            <div className="mt-2 text-xs text-white/70">per unit, {money(cost.actualTotal)} billed so far</div>
          </div>
        </div>
      </section>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-2xl bg-white px-5 py-2.5 text-[15px]"
        aria-live="polite"
      >
        <span className="size-2 rounded-full bg-red" aria-hidden="true" />
        {cost.unresolvedCount > 0 ? (
          <span className="-ml-3 font-semibold">
            <span className="tabular-nums text-danger">{money(cost.moneyAtRisk)}</span> at risk across{" "}
            {cost.unresolvedCount} {cost.unresolvedCount === 1 ? "charge" : "charges"}
          </span>
        ) : (
          <span className="-ml-3 font-semibold">$0 at risk. All flagged charges reviewed.</span>
        )}
        {cost.disputedCount > 0 && (
          <span className="text-muted">
            If disputes succeed:{" "}
            <span className="font-semibold tabular-nums text-ink">{perUnit(cost.perUnitIfDisputesWin)}/unit</span>
          </span>
        )}
      </div>
    </>
  );
}

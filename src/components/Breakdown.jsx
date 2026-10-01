import { money } from "../lib/format.js";

export default function Breakdown({ rows }) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <section className="rounded-2xl bg-white px-5 py-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold">Where the money went</h2>
        <span className="text-xs tabular-nums text-muted">{money(total)} billed</span>
      </div>
      <div className="mt-2 grid grid-cols-[6.5rem_1fr_4.5rem_3rem] items-center gap-x-2 gap-y-1.5 text-sm sm:grid-cols-[7rem_1fr_5rem_3.5rem] sm:gap-x-4">
        {rows.map((row) => (
          <div key={row.key} className="contents">
            <span className="text-ink/80">{row.label}</span>
            <span className="h-2.5 rounded-full bg-frame" aria-hidden="true">
              <span
                className={`grow block h-2.5 rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${
                  row.key === "extra" ? "bg-orange" : "bg-lime"
                }`}
                style={{ width: `${row.percent}%` }}
              />
            </span>
            <span className="text-right font-semibold tabular-nums">{money(row.amount)}</span>
            <span className="text-right tabular-nums text-muted">{row.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

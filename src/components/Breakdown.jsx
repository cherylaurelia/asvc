import { money } from "../lib/format.js";

export default function Breakdown({ rows }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <h2 className="text-sm font-semibold text-slate-900">Where the money went</h2>
      <div className="mt-2 grid grid-cols-[7rem_1fr_5rem_3.5rem] items-center gap-x-4 gap-y-1.5 text-sm">
        {rows.map((row) => (
          <div key={row.key} className="contents">
            <span className="text-slate-700">{row.label}</span>
            <span className="h-2.5 rounded bg-slate-100">
              <span
                className={`block h-2.5 rounded transition-all duration-500 ${
                  row.key === "extra" ? "bg-amber-500" : "bg-indigo-600"
                }`}
                style={{ width: `${row.percent}%` }}
              />
            </span>
            <span className="text-right font-medium tabular-nums text-slate-900">{money(row.amount)}</span>
            <span className="text-right tabular-nums text-slate-500">{row.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

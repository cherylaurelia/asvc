import { billTotal } from "../lib/calc.js";
import { money, shortDate } from "../lib/format.js";

export default function BillTimeline({ bills, flags, selectedBillId, onSelect }) {
  const sorted = [...bills].sort((a, b) => a.date.localeCompare(b.date));
  const needsReview = (bill) =>
    flags.some((f) => f.billId === bill.id && (f.status === "open" || f.status === "disputed"));

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <h2 className="border-b border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900">
        Bills <span className="font-normal text-slate-500">({bills.length})</span>
      </h2>
      <ul>
        {sorted.map((bill) => {
          const selected = bill.id === selectedBillId;
          return (
            <li key={bill.id} className="border-b border-slate-100 last:border-b-0">
              <button
                type="button"
                onClick={() => onSelect(selected ? null : bill.id)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                  selected ? "bg-indigo-50 hover:bg-indigo-50" : ""
                } ${bill.isLate ? "flash" : ""}`}
              >
                <span className="w-14 shrink-0 tabular-nums text-slate-500">{shortDate(bill.date)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-900">{bill.vendor}</span>
                  <span className="block text-xs text-slate-500">{bill.id}</span>
                </span>
                {needsReview(bill) && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                    FLAGGED
                  </span>
                )}
                <span className="w-20 shrink-0 text-right font-medium tabular-nums text-slate-900">
                  {money(billTotal(bill))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

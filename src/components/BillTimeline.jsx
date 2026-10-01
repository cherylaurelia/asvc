import { billTotal } from "../lib/calc.js";
import { money, shortDate } from "../lib/format.js";
import Badge from "./Badge.jsx";

export default function BillTimeline({ bills, flags, selectedBillId, onSelect }) {
  const sorted = [...bills].sort((a, b) => a.date.localeCompare(b.date));
  const needsReview = (bill) =>
    flags.some((f) => f.billId === bill.id && (f.status === "open" || f.status === "disputed"));

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <h2 className="border-b border-line px-4 py-2.5 text-sm font-semibold text-ink">
        Bills <span className="font-normal text-stone-500">({bills.length})</span>
      </h2>
      <ul>
        {sorted.map((bill, i) => {
          const selected = bill.id === selectedBillId;
          const flagged = needsReview(bill);
          return (
            <li key={bill.id}>
              <button
                type="button"
                onClick={() => onSelect(selected ? null : bill.id)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 px-4 text-left text-sm -outline-offset-2 ${
                  selected ? "bg-lime/25" : "hover:bg-stone-50"
                } ${bill.isLate ? "flash" : ""}`}
              >
                <span className="relative flex w-2.5 shrink-0 justify-center self-stretch" aria-hidden="true">
                  <span
                    className={`absolute w-px bg-line ${i === 0 ? "top-1/2" : "top-0"} ${
                      i === sorted.length - 1 ? "bottom-1/2" : "bottom-0"
                    }`}
                  />
                  <span
                    className={`relative my-auto size-2.5 rounded-full ring-2 ring-white ${
                      flagged ? "bg-amber-500" : "bg-ink"
                    }`}
                  />
                </span>
                <span className="w-14 shrink-0 whitespace-nowrap py-2 tabular-nums text-stone-500">{shortDate(bill.date)}</span>
                <span className="min-w-0 flex-1 py-2">
                  <span className="block truncate font-medium text-ink">{bill.vendor}</span>
                  <span className="block text-xs text-stone-500">{bill.id}</span>
                </span>
                {flagged && <Badge tone="review">FLAGGED</Badge>}
                <span className="w-20 shrink-0 text-right font-semibold tabular-nums text-ink">
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

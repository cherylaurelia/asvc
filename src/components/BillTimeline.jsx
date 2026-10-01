import { billTotal } from "../lib/calc.js";
import { money, shortDate } from "../lib/format.js";
import Badge from "./Badge.jsx";

export default function BillTimeline({ bills, flags, selectedBillId, onSelect }) {
  const sorted = [...bills].sort((a, b) => a.date.localeCompare(b.date));
  const needsReview = (bill) =>
    flags.some((f) => f.billId === bill.id && (f.status === "open" || f.status === "disputed"));

  return (
    <section className="glass overflow-hidden rounded-3xl">
      <h2 className="border-b border-hairline px-5 py-2.5 text-[15px] font-semibold">
        Bills <span className="font-normal text-muted">({bills.length})</span>
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
                className={`flex w-full items-center gap-3 px-5 text-left text-sm -outline-offset-2 ${
                  selected ? "bg-accent/10" : "hover:bg-black/3"
                } ${bill.isLate ? "flash" : ""}`}
              >
                <span className="relative flex w-2.5 shrink-0 justify-center self-stretch" aria-hidden="true">
                  <span
                    className={`absolute w-px bg-black/12 ${i === 0 ? "top-1/2" : "top-0"} ${
                      i === sorted.length - 1 ? "bottom-1/2" : "bottom-0"
                    }`}
                  />
                  <span className={`relative my-auto size-2.5 rounded-full ${flagged ? "bg-orange" : "bg-ink"}`} />
                </span>
                <span className="w-14 shrink-0 whitespace-nowrap py-2 tabular-nums text-muted">
                  {shortDate(bill.date)}
                </span>
                <span className="min-w-0 flex-1 py-2">
                  <span className="block truncate font-semibold">{bill.vendor}</span>
                  <span className="block text-xs text-muted">{bill.id}</span>
                </span>
                {flagged && <Badge tone="review">FLAGGED</Badge>}
                <span className="w-20 shrink-0 text-right font-semibold tabular-nums">{money(billTotal(bill))}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import FlagItem from "./FlagItem.jsx";
import Badge from "./Badge.jsx";

export default function FlagList({ flags, shipment, selectedBillId, lateBillId, dutyOk, onSetStatus }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <h2 className="border-b border-line px-4 py-2.5 text-sm font-semibold text-ink">
        Flagged for review <span className="font-normal text-stone-500">({flags.length})</span>
      </h2>
      {flags.length === 0 && <p className="px-4 py-3 text-sm text-stone-500">No charges flagged on these bills.</p>}
      <ul>
        {flags.map((flag) => (
          <FlagItem
            key={flag.id}
            flag={flag}
            shipment={shipment}
            highlighted={flag.billId === selectedBillId}
            flash={flag.billId === lateBillId}
            onDispute={() => onSetStatus(flag.id, "disputed")}
            onApprove={() => onSetStatus(flag.id, "approved")}
          />
        ))}
      </ul>
      {dutyOk && (
        <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-sm text-emerald-800">
          <Badge tone="checked">CHECKED</Badge>
          Duty checked: matches {shipment.dutyRate * 100}% rate
        </div>
      )}
    </section>
  );
}

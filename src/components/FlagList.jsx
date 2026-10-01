import FlagItem from "./FlagItem.jsx";
import Badge from "./Badge.jsx";

export default function FlagList({ flags, shipment, selectedBillId, lateBillId, dutyOk, onSetStatus }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <h2 className="border-b border-hairline px-5 py-2.5 text-base font-semibold">
        Flagged for review <span className="font-normal text-muted">({flags.length})</span>
      </h2>
      {flags.length === 0 && <p className="px-5 py-3 text-[15px] text-muted">No charges flagged on these bills.</p>}
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
        <div className="flex items-center gap-2 border-t border-hairline px-5 py-2.5 text-[15px] font-semibold text-success">
          <Badge tone="checked">CHECKED</Badge>
          Duty checked: matches {shipment.dutyRate * 100}% rate
        </div>
      )}
    </section>
  );
}

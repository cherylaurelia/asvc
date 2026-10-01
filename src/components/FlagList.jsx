import FlagItem from "./FlagItem.jsx";

export default function FlagList({ flags, shipment, selectedBillId, lateBillId, dutyOk, onSetStatus }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <h2 className="border-b border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900">
        Flagged for review <span className="font-normal text-slate-500">({flags.length})</span>
      </h2>
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
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5 text-sm text-emerald-800">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold">CHECKED</span>
          Duty checked: matches {shipment.dutyRate * 100}% rate
        </div>
      )}
    </section>
  );
}

import { useState } from "react";
import { money } from "../lib/format.js";
import { draftDisputeEmail } from "../lib/email.js";

const SEVERITY = {
  high: { label: "HIGH", className: "bg-red-100 text-red-700" },
  review: { label: "REVIEW", className: "bg-amber-100 text-amber-800" },
};

const STATUS = {
  disputed: { label: "Disputed", className: "bg-slate-200 text-slate-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-800" },
};

export default function FlagItem({ flag, shipment, highlighted, flash, onDispute, onApprove }) {
  const [showDraft, setShowDraft] = useState(false);
  const severity = SEVERITY[flag.severity];
  const status = STATUS[flag.status];

  return (
    <li
      className={`border-b border-slate-100 px-4 py-2.5 last:border-b-0 ${
        highlighted ? "bg-indigo-50" : ""
      } ${flash ? "flash" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${severity.className}`}>
          {severity.label}
        </span>
        <span className="text-base font-semibold tabular-nums text-slate-900">{money(flag.amountAtRisk)}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
          {flag.vendor} · {flag.billId}
        </span>
        {status ? (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
        ) : (
          <span className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onDispute}
              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Dispute
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Approve
            </button>
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-700">
        {flag.reason}{" "}
        <button
          type="button"
          onClick={() => setShowDraft(true)}
          className="whitespace-nowrap text-xs text-indigo-600 underline hover:text-indigo-800"
        >
          Draft dispute email
        </button>
      </p>
      {showDraft && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-6"
          onClick={() => setShowDraft(false)}
        >
          <div
            role="dialog"
            aria-label="Draft dispute email"
            className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Draft dispute email</h3>
              <span className="text-xs text-slate-500">Draft only. Nothing is sent.</span>
            </div>
            <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-sans text-sm text-slate-800">
              {draftDisputeEmail(flag, shipment)}
            </pre>
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => setShowDraft(false)}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

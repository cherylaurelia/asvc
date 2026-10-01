import { useEffect, useRef, useState } from "react";
import { money } from "../lib/format.js";
import { draftDisputeEmail } from "../lib/email.js";
import Badge from "./Badge.jsx";

const SEVERITY_LABEL = { high: "HIGH", review: "REVIEW" };

const STATUS = {
  disputed: { label: "Disputed", tone: "neutral" },
  approved: { label: "Approved", tone: "checked" },
};

const secondaryButton =
  "rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100";

function EmailDraft({ flag, shipment, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Draft dispute email"
        className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-semibold text-slate-900">Draft dispute email</h3>
          <span className="text-xs text-slate-500">Draft only. Nothing is sent.</span>
        </div>
        <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-sans text-sm leading-relaxed text-slate-800">
          {draftDisputeEmail(flag, shipment)}
        </pre>
        <div className="mt-3 text-right">
          <button type="button" autoFocus onClick={onClose} className={secondaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlagItem({ flag, shipment, highlighted, flash, onDispute, onApprove }) {
  const [showDraft, setShowDraft] = useState(false);
  const draftButton = useRef(null);
  const status = STATUS[flag.status];

  const closeDraft = () => {
    setShowDraft(false);
    draftButton.current?.focus();
  };

  return (
    <li
      className={`border-b border-slate-100 px-4 py-2.5 last:border-b-0 ${
        highlighted ? "bg-indigo-50" : ""
      } ${flash ? "flash" : ""}`}
    >
      <div className="flex min-h-7 items-center gap-3">
        <Badge tone={flag.severity}>{SEVERITY_LABEL[flag.severity]}</Badge>
        <span className="text-base font-semibold tabular-nums text-slate-900">{money(flag.amountAtRisk)}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
          {flag.vendor} · {flag.billId}
        </span>
        {status ? (
          <Badge tone={status.tone}>{status.label}</Badge>
        ) : (
          <span className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onDispute}
              className="rounded-md border border-indigo-600 bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:border-indigo-700 hover:bg-indigo-700 active:bg-indigo-800"
            >
              Dispute
            </button>
            <button type="button" onClick={onApprove} className={secondaryButton}>
              Approve
            </button>
          </span>
        )}
      </div>
      <p className="mt-1 text-pretty text-sm text-slate-700">
        {flag.reason}{" "}
        <button
          ref={draftButton}
          type="button"
          onClick={() => setShowDraft(true)}
          className="whitespace-nowrap rounded-sm text-xs font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
        >
          Draft dispute email
        </button>
      </p>
      {showDraft && <EmailDraft flag={flag} shipment={shipment} onClose={closeDraft} />}
    </li>
  );
}

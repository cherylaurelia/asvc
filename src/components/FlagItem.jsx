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
  "rounded-full border border-stone-300 bg-white px-3.5 py-1 text-xs font-semibold text-ink hover:bg-stone-50 active:bg-stone-100";

function EmailDraft({ flag, shipment, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/50 p-4 sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Draft dispute email"
        className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-semibold text-ink">Draft dispute email</h3>
          <span className="text-xs text-stone-500">Draft only. Nothing is sent.</span>
        </div>
        <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg bg-canvas p-3 font-sans text-sm leading-relaxed text-ink">
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
      data-highlighted={highlighted || undefined}
      className={`border-b border-line px-4 py-2.5 last:border-b-0 ${highlighted ? "bg-lime/25" : ""} ${
        flash ? "flash" : ""
      }`}
    >
      <div className="flex min-h-7 items-center gap-3">
        <Badge tone={flag.severity}>{SEVERITY_LABEL[flag.severity]}</Badge>
        <span className="text-base font-semibold tabular-nums text-ink">{money(flag.amountAtRisk)}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-stone-500">
          {flag.vendor} · {flag.billId}
        </span>
        {status ? (
          <Badge tone={status.tone}>{status.label}</Badge>
        ) : (
          <span className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onDispute}
              className="rounded-full border border-ink bg-ink px-3.5 py-1 text-xs font-semibold text-white hover:bg-stone-700 active:bg-stone-600"
            >
              Dispute
            </button>
            <button type="button" onClick={onApprove} className={secondaryButton}>
              Approve
            </button>
          </span>
        )}
      </div>
      <p className="mt-1 text-pretty text-sm text-stone-700">
        {flag.reason}{" "}
        <button
          ref={draftButton}
          type="button"
          onClick={() => setShowDraft(true)}
          className="whitespace-nowrap rounded-sm text-xs font-medium text-ink underline decoration-stone-400 underline-offset-2 hover:decoration-ink"
        >
          Draft dispute email
        </button>
      </p>
      {showDraft && <EmailDraft flag={flag} shipment={shipment} onClose={closeDraft} />}
    </li>
  );
}

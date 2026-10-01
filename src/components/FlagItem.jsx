import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { money } from "../lib/format.js";
import { draftDisputeEmail } from "../lib/email.js";
import Badge from "./Badge.jsx";

const SEVERITY_LABEL = { high: "HIGH", review: "REVIEW" };

const STATUS = {
  disputed: { label: "Disputed", tone: "neutral" },
  approved: { label: "Approved", tone: "checked" },
};

const primaryButton =
  "rounded-full border border-accent bg-accent px-3.5 py-1 text-[13px] font-semibold text-white hover:bg-accent-focus active:opacity-80";
const outlineButton =
  "rounded-full border border-ink/25 bg-white px-3.5 py-1 text-[13px] font-semibold text-ink hover:bg-frame active:opacity-80";

// Rendered on the body: a glass ancestor would otherwise trap a fixed overlay.
function EmailDraft({ flag, shipment, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Draft dispute email"
        className="glass-sheet w-full max-w-xl rounded-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold">Draft dispute email</h3>
          <span className="text-sm text-muted">Draft only. Nothing is sent.</span>
        </div>
        <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-2xl bg-frame p-4 font-sans text-[15px] leading-relaxed">
          {draftDisputeEmail(flag, shipment)}
        </pre>
        <div className="mt-3 text-right">
          <button type="button" autoFocus onClick={onClose} className={primaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
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
      className={`border-b border-hairline px-5 py-2 last:border-b-0 ${highlighted ? "bg-lime/30" : ""} ${
        flash ? "flash" : ""
      }`}
    >
      <div className="flex min-h-7 items-center gap-3">
        <Badge tone={flag.severity}>{SEVERITY_LABEL[flag.severity]}</Badge>
        <span className="text-base font-semibold tabular-nums">{money(flag.amountAtRisk)}</span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-muted">
          {flag.vendor} · {flag.billId}
        </span>
        {status ? (
          <Badge tone={status.tone}>{status.label}</Badge>
        ) : (
          <span className="flex shrink-0 gap-2">
            <button type="button" onClick={onDispute} className={primaryButton}>
              Dispute
            </button>
            <button type="button" onClick={onApprove} className={outlineButton}>
              Approve
            </button>
          </span>
        )}
      </div>
      <p className="mt-1 text-pretty text-[15px] text-ink">
        {flag.reason}{" "}
        <button
          ref={draftButton}
          type="button"
          onClick={() => setShowDraft(true)}
          className="whitespace-nowrap rounded-sm text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
        >
          Draft dispute email
        </button>
      </p>
      {showDraft && <EmailDraft flag={flag} shipment={shipment} onClose={closeDraft} />}
    </li>
  );
}

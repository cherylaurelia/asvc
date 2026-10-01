import { useState } from "react";
import data from "./data/shipment.json";
import { calcLandedCost, categoryBreakdown } from "./lib/calc.js";
import { auditBills, dutyChecked } from "./lib/audit.js";
import CostCard from "./components/CostCard.jsx";
import BillTimeline from "./components/BillTimeline.jsx";
import FlagList from "./components/FlagList.jsx";
import Breakdown from "./components/Breakdown.jsx";

export default function App() {
  const [bills, setBills] = useState(data.bills);
  const [flagStatus, setFlagStatus] = useState({});
  const [selectedBillId, setSelectedBillId] = useState(null);

  const flags = auditBills(data.shipment, data.quote, bills).map((f) => ({
    ...f,
    status: flagStatus[f.id] ?? "open",
  }));
  const cost = calcLandedCost(data.shipment, data.quote, bills, flags);
  const lateBillAdded = bills.some((b) => b.id === data.lateBill.id);

  const simulateLateBill = () =>
    setBills((b) => (b.some((x) => x.id === data.lateBill.id) ? b : [...b, data.lateBill]));

  const resetDemo = () => {
    setBills(data.bills);
    setFlagStatus({});
    setSelectedBillId(null);
  };

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto flex max-w-[84rem] gap-3">
        <aside className="hidden w-14 shrink-0 flex-col items-center gap-3 rounded-2xl bg-ink py-3 md:flex">
          <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-ink" title="Landed">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 10.2V14M12 2v3" />
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
              <path d="M19.4 20A11.6 11.6 0 0 0 21 14l-8.2-3.6a2 2 0 0 0-1.6 0L3 14a11.6 11.6 0 0 0 2.8 7.8" />
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </span>
          <span className="mt-2 flex size-9 items-center justify-center rounded-xl bg-white/15 text-white" title="Shipment">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span className="mt-auto text-[10px] font-semibold tracking-widest text-white/70 [writing-mode:vertical-rl]">
            LANDED
          </span>
        </aside>

        <main className="min-w-0 flex-1 space-y-3">
          <CostCard
            shipment={data.shipment}
            cost={cost}
            flash={lateBillAdded}
            actions={
              <>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white active:opacity-80"
                >
                  Reset demo
                </button>
                <button
                  type="button"
                  onClick={simulateLateBill}
                  disabled={lateBillAdded}
                  className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-focus active:opacity-80 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/60"
                >
                  Simulate new bill
                </button>
              </>
            }
          />
          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[2fr_3fr]">
            <BillTimeline bills={bills} flags={flags} selectedBillId={selectedBillId} onSelect={setSelectedBillId} />
            <FlagList
              flags={flags}
              shipment={data.shipment}
              selectedBillId={selectedBillId}
              lateBillId={data.lateBill.id}
              dutyOk={dutyChecked(data.shipment, bills)}
              onSetStatus={(id, status) => setFlagStatus((s) => ({ ...s, [id]: status }))}
            />
          </div>
          <Breakdown rows={categoryBreakdown(bills)} />
        </main>
      </div>
    </div>
  );
}

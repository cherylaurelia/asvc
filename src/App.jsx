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
    <div className="min-h-screen bg-canvas text-ink">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="size-3.5 rounded-[3px] bg-lime" aria-hidden="true" />
            Landed
          </h1>
          <span className="text-sm text-stone-400">
            {data.shipment.id} · {data.shipment.name}
          </span>
          <span className="ml-auto flex items-center gap-4">
            <button type="button" onClick={resetDemo} className="rounded-sm text-sm text-stone-300 underline decoration-stone-500 underline-offset-2 hover:text-white focus-visible:outline-lime">
              Reset demo
            </button>
            <button
              type="button"
              onClick={simulateLateBill}
              disabled={lateBillAdded}
              className="rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-ink hover:brightness-95 active:brightness-90 focus-visible:outline-lime disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-stone-400"
            >
              Simulate new bill
            </button>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6">
        <CostCard shipment={data.shipment} cost={cost} flash={lateBillAdded} />
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[2fr_3fr]">
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
        <footer className="px-1 text-xs text-stone-600">
          Prototype running on hardcoded sample data. Charges are flagged for review, not proven wrong.
        </footer>
      </main>
    </div>
  );
}

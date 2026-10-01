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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <span className="text-lg font-semibold tracking-tight">Landed</span>
          <span className="text-sm text-slate-500">
            {data.shipment.id} · {data.shipment.name}
          </span>
          <span className="ml-auto flex items-center gap-4">
            <button type="button" onClick={resetDemo} className="text-sm text-slate-500 underline hover:text-slate-900">
              Reset demo
            </button>
            <button
              type="button"
              onClick={simulateLateBill}
              disabled={lateBillAdded}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              Simulate new bill
            </button>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-6 py-5">
        <CostCard shipment={data.shipment} cost={cost} flash={lateBillAdded} />
        <div className="grid grid-cols-[2fr_3fr] items-start gap-4">
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
        <footer className="text-xs text-slate-500">
          Prototype running on hardcoded sample data. Charges are flagged for review, not proven wrong.
        </footer>
      </main>
    </div>
  );
}

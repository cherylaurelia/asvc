import data from "./data/shipment.json";

export default function App() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold">{data.shipment.name}</h1>
      <p className="text-slate-500">{data.bills.length} bills</p>
    </main>
  );
}

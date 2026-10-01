const TONES = {
  high: "bg-red-100 text-red-700",
  review: "bg-amber-100 text-amber-800",
  checked: "bg-emerald-100 text-emerald-800",
  neutral: "bg-slate-200 text-slate-700",
};

export default function Badge({ tone, children }) {
  return (
    <span className={`inline-block shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

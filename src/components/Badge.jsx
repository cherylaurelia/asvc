const TONES = {
  high: "bg-red-100 text-red-700",
  review: "bg-amber-100 text-amber-800",
  checked: "bg-emerald-100 text-emerald-800",
  neutral: "bg-stone-200 text-stone-700",
};

export default function Badge({ tone, children }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

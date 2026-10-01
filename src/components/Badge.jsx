const TONES = {
  high: "bg-red/12 text-danger",
  review: "bg-orange/15 text-warning",
  checked: "bg-green/15 text-success",
  neutral: "bg-black/6 text-muted",
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

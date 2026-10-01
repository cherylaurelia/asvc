// $1,200 for whole dollars, $14.20 when cents matter
export const money = (n) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const perUnit = (n) => "$" + n.toFixed(2);

export const shortDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

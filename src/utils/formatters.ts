export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits }).format(value);
}

export function formatPercentPoints(value: number) {
  return `${formatNumber(value, 2)}%`;
}

export function formatByType(value: number, type?: "number" | "percent" | "score", scoreAsPoints = false) {
  if (type === "score") {
    return scoreAsPoints ? formatNumber(value) : formatPercentPoints(value);
  }

  if (type === "percent") return formatPercentPoints(value);
  return formatNumber(value, Number.isInteger(value) ? 0 : 1);
}

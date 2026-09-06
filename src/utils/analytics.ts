import type { Aggregation, NumericField, ReportRow } from "../types";

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function aggregateRows(rows: ReportRow[], field: NumericField, aggregation: Aggregation) {
  if (aggregation === "count") return rows.length;

  const values = rows.map((row) => Number(row[field])).filter((value) => Number.isFinite(value));
  if (values.length === 0) return 0;

  if (aggregation === "min") return Math.min(...values);
  if (aggregation === "median") return median(values);

  const sum = values.reduce((total, value) => total + value, 0);
  if (aggregation === "avg") return sum / values.length;

  return sum;
}

export function countUnique(rows: ReportRow[], field: keyof ReportRow) {
  return new Set(rows.map((row) => row[field])).size;
}

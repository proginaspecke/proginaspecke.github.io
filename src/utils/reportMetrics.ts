import type { DashboardMetric, ReportRow } from "../types";

export interface RecruitmentSummary {
  rekrutacja: string;
  averageThreshold: number;
  medianQualifiedScore: number;
  totalPlaces: number;
}

function finiteValues(values: number[]) {
  return values.filter((value) => Number.isFinite(value));
}

export function median(values: number[]) {
  const sorted = finiteValues(values).sort((a, b) => a - b);
  if (sorted.length === 0) return Number.NaN;

  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export function average(values: number[]) {
  const filtered = finiteValues(values);
  if (filtered.length === 0) return Number.NaN;

  return filtered.reduce((total, value) => total + value, 0) / filtered.length;
}

export function summarizeRecruitment(rows: ReportRow[], rekrutacja: string): RecruitmentSummary {
  const recruitmentRows = rows.filter((row) => row.rekrutacja === rekrutacja);
  const regionKeys = [...new Set(recruitmentRows.map((row) => row.wojewodztwo))];
  const thresholdsByRegion = regionKeys.map((region) => {
    const regionRows = recruitmentRows.filter((row) => row.wojewodztwo === region);
    return Math.min(...regionRows.map((row) => row.wynik_proc_lub_punkty));
  });
  const placesByRegion = regionKeys.map((region) => {
    const regionRows = recruitmentRows.filter((row) => row.wojewodztwo === region);
    return median(regionRows.map((row) => row.ilosc_zakwalifikowanych_w_trybie));
  });

  return {
    rekrutacja,
    averageThreshold: average(thresholdsByRegion),
    medianQualifiedScore: average(recruitmentRows.map((row) => row.wynik_proc_lub_punkty)),
    totalPlaces:
      regionKeys.length === 0 ? Number.NaN : finiteValues(placesByRegion).reduce((total, value) => total + value, 0),
  };
}

export function summarizeRecruitments(rows: ReportRow[], rekrutacje: string[]) {
  return rekrutacje.map((rekrutacja) => summarizeRecruitment(rows, rekrutacja));
}

export function summarizeActiveFilters(rows: ReportRow[]): Pick<RecruitmentSummary, DashboardMetric> {
  const regionKeys = [...new Set(rows.map((row) => `${row.rekrutacja}::${row.wojewodztwo}`))];
  const thresholdsByRegion = regionKeys.map((key) => {
    const [rekrutacja, wojewodztwo] = key.split("::");
    const regionRows = rows.filter((row) => row.rekrutacja === rekrutacja && row.wojewodztwo === wojewodztwo);
    return Math.min(...regionRows.map((row) => row.wynik_proc_lub_punkty));
  });
  const placesByRegion = regionKeys.map((key) => {
    const [rekrutacja, wojewodztwo] = key.split("::");
    const regionRows = rows.filter((row) => row.rekrutacja === rekrutacja && row.wojewodztwo === wojewodztwo);
    return median(regionRows.map((row) => row.ilosc_zakwalifikowanych_w_trybie));
  });

  return {
    averageThreshold: average(thresholdsByRegion),
    medianQualifiedScore: average(rows.map((row) => row.wynik_proc_lub_punkty)),
    totalPlaces:
      regionKeys.length === 0 ? Number.NaN : finiteValues(placesByRegion).reduce((total, value) => total + value, 0),
  };
}

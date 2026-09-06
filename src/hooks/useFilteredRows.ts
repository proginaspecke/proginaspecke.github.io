import { useMemo } from "react";
import { applyReportFilters } from "../data/reportData";
import { useFilterStore } from "../state/filterStore";

export function useFilteredRows() {
  const filters = useFilterStore((state) => state.filters);
  const activeData = useFilterStore((state) => state.activeData);

  return useMemo(() => applyReportFilters(activeData, filters), [filters, activeData]);
}

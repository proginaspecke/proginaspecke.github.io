import { useMemo } from "react";
import type { DashboardMetric } from "../types";
import { formatByType, formatNumber } from "../utils/formatters";
import { summarizeActiveFilters } from "../utils/reportMetrics";
import { useFilteredRows } from "../hooks/useFilteredRows";
import { useFilterStore } from "../state/filterStore";
import { InfoTooltip } from "./FilterControls";

interface CardProps {
  label: string;
  metric: DashboardMetric;
  tooltip?: string;
}

export function Card({ label, metric, tooltip }: CardProps) {
  const rows = useFilteredRows();
  const przedstawWynikJako = useFilterStore((state) => state.filters.przedstawWynikJako);
  const dziedzinaMedycyny = useFilterStore((state) => state.filters.dziedzinaMedycyny);
  const trybSzkolenia = useFilterStore((state) => state.filters.trybSzkolenia);
  const scoreAsPoints = przedstawWynikJako === "surowa ilość punktów rekrutacyjnych (poglądowo)";
  const latestRows = useMemo(() => {
    if (rows.length === 0) return [];
    let maxKolejnosc = -1;
    for (const row of rows) {
      if (row.kolejnosc_plikow > maxKolejnosc) {
        maxKolejnosc = row.kolejnosc_plikow;
      }
    }
    return rows.filter((row) => row.kolejnosc_plikow === maxKolejnosc);
  }, [rows]);

  const value = useMemo(() => {
    if (latestRows.length === 0) return "-";
    const summary = summarizeActiveFilters(latestRows);

    if (metric === "totalPlaces") return Number.isFinite(summary.totalPlaces) ? formatNumber(summary.totalPlaces) : "-";
    return Number.isFinite(summary[metric]) ? formatByType(summary[metric], "score", scoreAsPoints) : "-";
  }, [metric, latestRows, scoreAsPoints]);

  const trybFormated = trybSzkolenia === "Rezydencki" ? "rezydenckim" : "pozarezydenckim";
  const rekrutacjaName = latestRows[0]?.rekrutacja ?? "-";

  return (
    <section className="kpi-card" aria-label={label}>
      <div className="kpi-label">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-context">
        {dziedzinaMedycyny} w trybie {trybFormated} w rekrutacji {rekrutacjaName}
      </div>
    </section>
  );
}

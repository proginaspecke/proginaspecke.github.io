import { useMemo } from "react";
import { getReportOptions } from "../data/reportData";
import type { CategoryField, PivotConfig, ReportRow } from "../types";
import { aggregateRows } from "../utils/analytics";
import { interpolateColor } from "../utils/colors";
import { formatByType } from "../utils/formatters";
import { useFilteredRows } from "../hooks/useFilteredRows";
import { useFilterStore } from "../state/filterStore";

interface PivotTableProps {
  config: PivotConfig;
  title?: string;
}

interface PivotCell {
  rowKey: string;
  columnKey: string;
  valueLabel: string;
  value: number;
  format?: "number" | "percent" | "score";
}

function categoryKey(row: ReportRow, fields: CategoryField[]) {
  if (fields.length === 0) return "Total";
  return fields.map((field) => row[field]).join(" / ");
}

function uniqueKeys(rows: ReportRow[], fields: CategoryField[]) {
  if (fields.length === 1 && fields[0] === "rekrutacja") {
    return getReportOptions().rekrutacje;
  }

  const keys = rows.map((row) => categoryKey(row, fields));
  const unique = [...new Set(keys)];

  return unique.sort((a, b) => a.localeCompare(b, "pl"));
}

function displayFieldLabel(fields: CategoryField[]) {
  const labels: Record<CategoryField, string> = {
    wojewodztwo: "Województwo",
    rekrutacja: "Rekrutacja",
    dziedzina_medycyny: "Dziedzina medycyny",
    tryb_szkolenia: "Tryb szkolenia",
  };

  return fields.map((field) => labels[field]).join(" / ");
}

function backgroundForCell(cell: PivotCell, cells: PivotCell[], config: PivotConfig) {
  const rule = config.conditionalFormats?.find((format) => format.valueLabel === cell.valueLabel);
  if (!rule || !Number.isFinite(cell.value)) return undefined;

  const values = cells
    .filter((item) => item.valueLabel === cell.valueLabel)
    .map((item) => item.value)
    .filter((value) => Number.isFinite(value));
  if (values.length === 0) return undefined;

  let ratio: number;
  if (cell.valueLabel === "Min wynik") {
    const sorted = [...values].sort((a, b) => a - b);
    if (sorted[0] === sorted[sorted.length - 1]) {
      ratio = 0.5;
    } else {
      let lessCount = 0;
      let equalCount = 0;
      for (const v of sorted) {
        if (v < cell.value) lessCount++;
        else if (v === cell.value) equalCount++;
      }
      const rank = lessCount + (equalCount - 1) / 2;
      ratio = rank / (sorted.length - 1);
    }
  } else {
    const min = Math.min(...values);
    const max = Math.max(...values);
    ratio = max === min ? 0.5 : (cell.value - min) / (max - min);
  }

  return interpolateColor(rule.from, rule.to, ratio);
}

export function PivotTable({ config, title }: PivotTableProps) {
  const rows = useFilteredRows();
  const przedstawWynikJako = useFilterStore((state) => state.filters.przedstawWynikJako);
  const scoreAsPoints = przedstawWynikJako === "surowa ilość punktów rekrutacyjnych (poglądowo)";
  const model = useMemo(() => {
    const rowKeys = uniqueKeys(rows, config.rows);
    const columnKeys = uniqueKeys(rows, config.columns);
    const cells: PivotCell[] = [];

    rowKeys.forEach((rowKey) => {
      columnKeys.forEach((columnKey) => {
        const matchingRows = rows.filter(
          (row) => categoryKey(row, config.rows) === rowKey && categoryKey(row, config.columns) === columnKey,
        );

        config.values.forEach((valueConfig) => {
          cells.push({
            rowKey,
            columnKey,
          valueLabel: valueConfig.label,
            value:
              matchingRows.length === 0
                ? Number.NaN
                : aggregateRows(matchingRows, valueConfig.field, valueConfig.aggregation),
            format: valueConfig.format,
          });
        });
      });
    });

    return { rowKeys, columnKeys, cells };
  }, [config, rows]);

  return (
    <section className="pivot-visual">
      {title ? <div className="visual-title">{title}</div> : null}
      <div className="pivot-scroll">
        <table className="pivot-table">
          <thead>
            <tr>
              <th className="row-heading" rowSpan={2}>
                {displayFieldLabel(config.rows)}
              </th>
              {model.columnKeys.map((columnKey, columnIndex) => (
                <th
                  key={columnKey}
                  className={`recruitment-heading pair-${columnIndex % 2 === 0 ? "even" : "odd"}`}
                  colSpan={config.values.length}
                >
                  {columnKey}
                </th>
              ))}
            </tr>
            <tr>
              {model.columnKeys.map((columnKey, columnIndex) =>
                config.values.map((valueConfig, valueIndex) => (
                  <th
                    key={`${columnKey}-${valueConfig.label}`}
                    className={`measure-heading pair-${columnIndex % 2 === 0 ? "even" : "odd"}${valueIndex === config.values.length - 1 ? " group-end" : ""}`}
                  >
                    {valueConfig.label}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {model.rowKeys.map((rowKey) => (
              <tr key={rowKey}>
                <th scope="row">{rowKey}</th>
                {model.columnKeys.map((columnKey, columnIndex) =>
                  config.values.map((valueConfig, valueIndex) => {
                    const cell = model.cells.find(
                      (item) =>
                        item.rowKey === rowKey &&
                        item.columnKey === columnKey &&
                        item.valueLabel === valueConfig.label,
                    );
                    const background = cell ? backgroundForCell(cell, model.cells, config) : undefined;

                    return (
                      <td
                        key={`${rowKey}-${columnKey}-${valueConfig.label}`}
                        className={`pair-${columnIndex % 2 === 0 ? "even" : "odd"}${valueIndex === config.values.length - 1 ? " group-end" : ""}`}
                        style={{ backgroundColor: background }}
                      >
                        {cell && Number.isFinite(cell.value)
                          ? formatByType(cell.value, cell.format, scoreAsPoints)
                          : "-"}
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

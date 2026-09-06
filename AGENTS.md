# Agent Guide

This repo is a client-only React + TypeScript dashboard for Polish medical residency recruitment data. It is intentionally small and config-driven so future agents can change visuals, filters, layout, and source-data parsing without broad rewrites.

## Quick Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

The dev server defaults to `http://127.0.0.1:5173/`.

## Project Map

- `src/App.tsx` renders the configured dashboard visuals into the CSS grid.
- `src/config/dashboardLayout.ts` is the first place to change page arrangement, visual selection, KPI definitions, and pivot config.
- `source_data/` contains parsed CSV files for recruitment rounds such as `w-2026` and `j-2025`.
- `src/data/sourceCsv.ts` imports the source CSV files as raw text.
- `src/data/reportData.ts` parses CSV rows, normalizes Polish headers, exposes report options, and applies filters. Keep components importing through this layer rather than importing raw CSV directly.
- `src/state/filterStore.ts` owns global report filters in Zustand.
- `src/hooks/useFilteredRows.ts` applies the global filters and is the common subscription path for visuals.
- `src/components/` contains reusable report visuals and filter controls.
- `src/styles/theme.ts` owns shared text variants and color tokens.
- `src/styles/global.css` owns page, grid, control, KPI, and pivot visual styling.
- `src/types.ts` owns shared domain, filter, visual, and pivot types.

## Architecture Rules

- Keep the app backend-free. Use local CSV data and browser memory only unless the user explicitly asks for an integration.
- Preserve the `getReportData()` abstraction so the source can change later without changing component code.
- Add new filters to `ReportFilters`, `filterStore.ts`, `applyReportFilters()`, and the filter UI together.
- When adding new CSV files, import them in `src/data/sourceCsv.ts`.
- Add new visual types by extending `DashboardVisual` in `dashboardLayout.ts`, then update `renderVisual()` in `App.tsx`.
- Keep layout changes in `dashboardLayout.ts`; avoid hard-coding positions inside components.
- Keep TextBox style variants in `theme.ts` so typography stays consistent.
- Use shared formatters in `src/utils/formatters.ts` for displayed numbers, currency, and percentages.

## Verification Checklist

Before handing off changes:

```bash
npm run typecheck
npm run build
```

For UI changes, also run `npm run dev` and verify:

- KPI values render.
- Filters change KPI and pivot values.
- The pivot table scrolls without header/body overlap.
- The layout remains usable below `980px` width.

## Notes For Future Agents

- Do not edit generated files in `dist/` or `node_modules/`.
- There are currently no automated unit tests. Use `typecheck` and `build` as the minimum validation.
- The current pivot is `wojewodztwo` by `rekrutacja`, with minimum `punktacja_proc` and median `ilosc_zakwalifikowanych_w_trybie`.
- The visual design is intentionally dashboard-like: dense, calm, and operational rather than a marketing landing page.

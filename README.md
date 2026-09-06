# Progi Rekrutacji Rezydenckiej

Client-only React + TypeScript dashboard for comparing Polish medical residency recruitment results across recruitment rounds.

## Run Locally

Instrukcja podmiany istniejącej strony i lista kontroli SEO: [DEPLOYMENT.md](DEPLOYMENT.md).

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

Useful validation commands:

```bash
npm run typecheck
npm run build
```

Future coding agents should start with `AGENTS.md`; it contains the project map, architecture rules, and handoff checklist.

## Source Data

CSV files live in `source_data/`. Each file has the same structure and represents one recruitment round, for example:

- `w-2026_parsed.csv`: spring 2026
- `j-2025_parsed.csv`: autumn 2025

The app imports every CSV as raw text in `src/data/sourceCsv.ts`, parses it in `src/data/reportData.ts`, and exposes rows through `getReportData()`. Components should keep using this data access layer rather than importing CSV files directly.

Important columns:

- `rekrutacja`
- `wojewodztwo`
- `dziedzina_medycyny`
- `tryb_szkolenia`
- `punktacja_proc`
- `ilość_zakwalifikowanych_w_trybie`

Polish CSV headers with diacritics are normalized to TypeScript-friendly field names inside `reportData.ts`.

## Current Report

The pivot table is configured as:

- Rows: `wojewodztwo`
- Columns: `rekrutacja`
- Values: minimum `punktacja_proc` and median `ilość_zakwalifikowanych_w_trybie`

Controls:

- `tryb_szkolenia`: single-select button group
- `dziedzina_medycyny`: searchable, scrollable single-select slicer

## Layout Config

The report layout is defined in `src/config/dashboardLayout.ts`. Each visual declares:

- `type`: `text`, `card`, `pivot`, or `filters`
- `grid`: column, row, column span, and row span
- `props`: visual-specific settings

To rearrange the page, edit the grid coordinates in that config file without changing component implementation.

## Limited search
The specialities available to search have been truncated to a short list, you can undo it:

Jak cofnąć
W pliku `src/config/specialtySearchFilter.ts` ustaw:

```
export const LIMIT_SPECIALTY_SEARCH = false;
```
Albo usuń plik i cofnij zmianę w reportData.ts.

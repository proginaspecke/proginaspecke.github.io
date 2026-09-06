import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../source_data");
const OUTPUT_DIR = path.join(__dirname, "../public/data");
const METADATA_FILE = path.join(__dirname, "../src/data/reportMetadata.ts");

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Columns configuration
const columnMap = {
  rekrutacja: "rekrutacja",
  "kolejność_plików": "kolejnosc_plikow",
  kolejnosc_plikow: "kolejnosc_plikow",
  publication_date: "publication_date",
  print_datetime: "print_datetime",
  page: "page",
  page_total: "page_total",
  wojewodztwo: "wojewodztwo",
  lp: "lp",
  dziedzina_medycyny: "dziedzina_medycyny",
  numer_wniosku: "numer_wniosku",
  tryb_szkolenia: "tryb_szkolenia",
  punktacja_proc: "punktacja_proc",
  srednia_arytmetyczna: "srednia_arytmetyczna",
  data_zlozenia_wniosku: "data_zlozenia_wniosku",
  "ilość_zakwalifikowanych_w_trybie": "ilosc_zakwalifikowanych_w_trybie",
  ilosc_zakwalifikowanych_w_trybie: "ilosc_zakwalifikowanych_w_trybie",
  czy_miejsca_doktoranckie: "czy_miejsca_doktoranckie",
  doktoranckie_podmiot: "doktoranckie_podmiot",
  doktoranckie_jednostka: "doktoranckie_jednostka",
};

const numericColumns = new Set([
  "kolejnosc_plikow",
  "lp",
  "punktacja_proc",
  "srednia_arytmetyczna",
  "ilosc_zakwalifikowanych_w_trybie",
]);

const columnsToKeep = [
  "rekrutacja",
  "kolejnosc_plikow",
  "wojewodztwo",
  "lp",
  "dziedzina_medycyny",
  "numer_wniosku",
  "tryb_szkolenia",
  "punktacja_proc",
  "srednia_arytmetyczna",
  "data_zlozenia_wniosku",
  "ilosc_zakwalifikowanych_w_trybie",
  "czy_miejsca_doktoranckie",
  "doktoranckie_podmiot",
  "doktoranckie_jednostka",
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map((h) => columnMap[h] ?? h);

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      if (columnsToKeep.includes(header)) {
        const val = values[index] ?? "";
        row[header] = numericColumns.has(header) ? Number(val) : val;
      }
    });
    rows.push(row);
  }
  return rows;
}

function slugify(text) {
  const polishChars = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n', 'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };
  return text
    .split('')
    .map(c => polishChars[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

console.log("Rozpoczynanie przetwarzania plików CSV...");

// Read all CSV files
const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".csv"));
let allRows = [];
const recruitmentOrder = {};

for (const file of files) {
  const filePath = path.join(SOURCE_DIR, file);
  console.log(`Czytanie pliku: ${file}`);
  const csvText = fs.readFileSync(filePath, "utf-8");
  const rows = parseCsv(csvText);
  allRows = allRows.concat(rows);
}

console.log(`Przetworzono łącznie wierszy: ${allRows.length}`);

// Group rows by specialization
const grouped = {};
for (const row of allRows) {
  const specialty = row.dziedzina_medycyny;
  if (!specialty) continue;
  
  if (!grouped[specialty]) {
    grouped[specialty] = [];
  }
  grouped[specialty].push(row);

  // Map recruitment name to its sequence index for chronology
  if (row.rekrutacja && row.kolejnosc_plikow !== undefined) {
    if (recruitmentOrder[row.rekrutacja] === undefined || row.kolejnosc_plikow > recruitmentOrder[row.rekrutacja]) {
      recruitmentOrder[row.rekrutacja] = row.kolejnosc_plikow;
    }
  }
}

// Generate unique, sorted lists
const dziedziny = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "pl"));

const rekrutacje = [...new Set(allRows.map((r) => r.rekrutacja).filter(Boolean))];
rekrutacje.sort((a, b) => (recruitmentOrder[b] || 0) - (recruitmentOrder[a] || 0));

console.log(`Znaleziono specjalizacji: ${dziedziny.length}`);
console.log("Kolejność rekrutacji (od najnowszej):", rekrutacje);

// Write individual JSON files
const specialtyFilesMap = {};
for (const specialty of dziedziny) {
  const slug = slugify(specialty);
  const fileName = `specialty_${slug}.json`;
  const outputPath = path.join(OUTPUT_DIR, fileName);
  
  fs.writeFileSync(outputPath, JSON.stringify(grouped[specialty], null, 2), "utf-8");
  specialtyFilesMap[specialty] = fileName;
}

console.log("Zapisano pliki JSON specjalizacji.");

// Write metadata file
const metadataContent = `// Ten plik jest generowany automatycznie przez skrypt preprocess.js. Nie edytuj go ręcznie.
import type { TrybSzkolenia, PrzedstawWynikJako } from "../types";

export const dziedziny: string[] = ${JSON.stringify(dziedziny, null, 2)};

export const rekrutacje: string[] = ${JSON.stringify(rekrutacje, null, 2)};

export const tryby: TrybSzkolenia[] = ["Rezydencki", "Pozarezydencki"];

export const przedstawWynikJako: PrzedstawWynikJako[] = [
  "% punktów rekrutacyjnych (domyślne)",
  "surowa ilość punktów rekrutacyjnych (poglądowo)",
];

export const specialtyFilesMap: Record<string, string> = ${JSON.stringify(specialtyFilesMap, null, 2)};
`;

fs.writeFileSync(METADATA_FILE, metadataContent, "utf-8");
console.log(`Zapisano metadane do: ${METADATA_FILE}`);
console.log("Przetwarzanie zakończone sukcesem!");

export type TextVariant = "title" | "heading1" | "heading2" | "body" | "caption";

export type TrybSzkolenia = "Rezydencki" | "Pozarezydencki";
export type PrzedstawWynikJako =
  | "% punktów rekrutacyjnych (domyślne)"
  | "surowa ilość punktów rekrutacyjnych (poglądowo)";
export type DashboardMetric = "averageThreshold" | "medianQualifiedScore" | "totalPlaces";

export interface ReportRow {
  rekrutacja: string;
  kolejnosc_plikow: number;
  publication_date: string;
  print_datetime: string;
  page: number;
  page_total: number;
  wojewodztwo: string;
  lp: number;
  dziedzina_medycyny: string;
  numer_wniosku: string;
  tryb_szkolenia: TrybSzkolenia;
  punktacja_proc: number;
  wynik_w_punktach: number;
  wynik_proc_lub_punkty: number;
  srednia_arytmetyczna: number;
  data_zlozenia_wniosku: string;
  ilosc_zakwalifikowanych_w_trybie: number;
  czy_miejsca_doktoranckie: "TAK" | "NIE";
  doktoranckie_podmiot: string;
  doktoranckie_jednostka: string;
}

export interface ReportFilters {
  trybSzkolenia: TrybSzkolenia;
  dziedzinaMedycyny: string;
  przedstawWynikJako: PrzedstawWynikJako;
}

export type NumericField =
  | "punktacja_proc"
  | "wynik_w_punktach"
  | "wynik_proc_lub_punkty"
  | "srednia_arytmetyczna"
  | "ilosc_zakwalifikowanych_w_trybie";

export type CategoryField = "wojewodztwo" | "rekrutacja" | "dziedzina_medycyny" | "tryb_szkolenia";

export type Aggregation = "min" | "median" | "sum" | "avg" | "count";

export interface PivotValueConfig {
  field: NumericField;
  aggregation: Aggregation;
  label: string;
  format?: "number" | "percent" | "score";
}

export interface ConditionalFormatRule {
  valueLabel: string;
  type: "colorScale";
  from: string;
  to: string;
}

export interface PivotConfig {
  rows: CategoryField[];
  columns: CategoryField[];
  values: PivotValueConfig[];
  conditionalFormats?: ConditionalFormatRule[];
}

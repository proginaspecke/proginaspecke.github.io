import { create } from "zustand";
import { getReportOptions, fetchSpecialtyData } from "../data/reportData";
import type { PrzedstawWynikJako, ReportFilters, ReportRow, TrybSzkolenia } from "../types";

const options = getReportOptions();

const defaultFilters: ReportFilters = {
  trybSzkolenia: "Rezydencki",
  dziedzinaMedycyny:
    options.dziedziny.find((item) => item === "Otorynolaryngologia") ?? options.dziedziny[0] ?? "",
  przedstawWynikJako: "% punktów rekrutacyjnych (domyślne)",
};

interface FilterStore {
  filters: ReportFilters;
  activeData: ReportRow[];
  isLoading: boolean;
  setTrybSzkolenia: (trybSzkolenia: TrybSzkolenia) => void;
  setDziedzinaMedycyny: (dziedzinaMedycyny: string) => Promise<void>;
  setPrzedstawWynikJako: (przedstawWynikJako: PrzedstawWynikJako) => void;
  resetFilters: () => void;
  loadSpecialtyData: (specialty: string) => Promise<void>;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: defaultFilters,
  activeData: [],
  isLoading: false,
  setTrybSzkolenia: (trybSzkolenia) => set((state) => ({ filters: { ...state.filters, trybSzkolenia } })),
  setDziedzinaMedycyny: async (dziedzinaMedycyny) => {
    set((state) => ({ filters: { ...state.filters, dziedzinaMedycyny } }));
    await get().loadSpecialtyData(dziedzinaMedycyny);
  },
  setPrzedstawWynikJako: (przedstawWynikJako) =>
    set((state) => ({ filters: { ...state.filters, przedstawWynikJako } })),
  resetFilters: () => {
    const prevSpecialty = get().filters.dziedzinaMedycyny;
    set({ filters: defaultFilters });
    if (defaultFilters.dziedzinaMedycyny !== prevSpecialty) {
      get().loadSpecialtyData(defaultFilters.dziedzinaMedycyny);
    }
  },
  loadSpecialtyData: async (specialty) => {
    set({ isLoading: true });
    try {
      const data = await fetchSpecialtyData(specialty);
      set({ activeData: data, isLoading: false });
    } catch (error) {
      console.error("Failed to load data for specialty", specialty, error);
      set({ activeData: [], isLoading: false });
    }
  },
}));

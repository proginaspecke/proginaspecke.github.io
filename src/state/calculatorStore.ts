import { create } from "zustand";

export interface CalculatorState {
  tryb: "Rezydencki" | "Pozarezydencki";
  examPoints: number;
  maxExamPoints: number;
  hasPhD: boolean;
  hasExperience: boolean; // non-residency: 3-year employment
  isAcademicTeacher: boolean; // non-residency: academic teacher
  publicationsCount: number;
  simulationRecruitment: string;

  setTryb: (tryb: "Rezydencki" | "Pozarezydencki") => void;
  setExamPoints: (points: number) => void;
  setMaxExamPoints: (maxPoints: number) => void;
  setHasPhD: (hasPhD: boolean) => void;
  setHasExperience: (hasExperience: boolean) => void;
  setIsAcademicTeacher: (isAcademicTeacher: boolean) => void;
  setPublicationsCount: (count: number) => void;
  setSimulationRecruitment: (recruitment: string) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  tryb: "Rezydencki",
  examPoints: 160,
  maxExamPoints: 200,
  hasPhD: false,
  hasExperience: false,
  isAcademicTeacher: false,
  publicationsCount: 0,
  simulationRecruitment: "w-2026",

  setTryb: (tryb) => set({ tryb }),
  setExamPoints: (examPoints) => set({ examPoints }),
  setMaxExamPoints: (maxExamPoints) => set({ maxExamPoints }),
  setHasPhD: (hasPhD) => set({ hasPhD }),
  setHasExperience: (hasExperience) => set({ hasExperience }),
  setIsAcademicTeacher: (isAcademicTeacher) => set({ isAcademicTeacher }),
  setPublicationsCount: (publicationsCount) => set({ publicationsCount }),
  setSimulationRecruitment: (simulationRecruitment) => set({ simulationRecruitment }),
}));

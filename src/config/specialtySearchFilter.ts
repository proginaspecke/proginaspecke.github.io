/**
 * Tymczasowe ograniczenie listy w polu „Wybór specjalizacji”.
 * Aby przywrócić pełną listę, ustaw LIMIT_SPECIALTY_SEARCH na false.
 */
export const LIMIT_SPECIALTY_SEARCH = false;

export const ALLOWED_SPECIALTIES_FOR_SEARCH = [
  "Ortodoncja",
  "Protetyka stomatologiczna",
  "Chirurgia stomatologiczna",
  "Stomatologia zachowawcza z endodoncją",
  "Periodontologia",
  "Stomatologia dziecięca",
  "Chirurgia szczękowo-twarzowa",
  "Zdrowie publiczne",
] as const;

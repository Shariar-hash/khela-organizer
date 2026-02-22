"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, getTranslation } from "./translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      t: getTranslation("en"),
      setLanguage: (lang: Language) =>
        set({
          language: lang,
          t: getTranslation(lang),
        }),
    }),
    {
      name: "language-storage",
    }
  )
);

export { getTranslation };
export type { Language };

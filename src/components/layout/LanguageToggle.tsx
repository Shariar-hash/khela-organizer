"use client";

import { useLanguageStore, Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-xl">
      <Globe className="w-4 h-4 text-gray-500" />
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
          language === "en"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("bn")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-lg transition-all font-bangla",
          language === "bn"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        বাং
      </button>
    </div>
  );
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, siteCopyByLocale, SUPPORTED_LOCALES } from "../../content/copy/siteCopy";

const LANGUAGE_STORAGE_KEY = "ta_portfolio_language";

const LanguageContext = createContext(null);

function normalizeLocale(rawLocale) {
  if (SUPPORTED_LOCALES.includes(rawLocale)) return rawLocale;
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!savedLocale) return;
    setLocaleState(normalizeLocale(savedLocale));
  }, []);

  const setLocale = (nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    setLocaleState(normalized);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      copy: siteCopyByLocale[locale] || siteCopyByLocale[DEFAULT_LOCALE],
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

export function useSiteCopy() {
  return useLanguage().copy;
}

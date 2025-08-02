import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../Translations/i18n";

export function useLanguage() {
  const { t } = useTranslation();

  useEffect(() => {
    let langParam = new URLSearchParams(window.location.search).get("language");
    if (langParam) {
      i18n.changeLanguage(langParam);
    } else {
      i18n.changeLanguage("eng");
    }
  }, []);

  // Check if translation exists
  const hasTranslation = (key) => i18n.exists(key);

  return { t, hasTranslation };
}

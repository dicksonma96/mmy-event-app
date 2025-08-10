import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../Translations/i18n";
import { useParams } from "next/navigation";

export function useLanguage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("eng");
    }
  }, []);

  // Check if translation exists
  const hasTranslation = (key) => i18n.exists(key);

  return { t, hasTranslation };
}

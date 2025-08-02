import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import eng from "./eng.json";

i18n.use(initReactI18next).init({
  resources: {
    eng: { translation: eng },
    // cn: { translation: cn },
    // bm: { translation: bm },
  },
  lng: "eng",
  fallbackLng: "eng",
  interpolation: { escapeValue: false },
});

export default i18n;

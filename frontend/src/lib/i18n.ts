import { atom } from "nanostores";
import { createI18n, localeFrom } from "@nanostores/i18n";

// Available locales
export const locale = atom<"en" | "th">("en");

// Auto-detect or load from localStorage (client-side only)
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("locale") as "en" | "th";
  if (saved) {
    locale.set(saved);
  } else {
    const browserLang = navigator.language;
    if (browserLang.toLowerCase().includes("th")) {
      locale.set("th");
    }
  }

  // Save on change
  locale.listen((val) => {
    localStorage.setItem("locale", val);
  });
}

export const i18n = createI18n(locale, {
  async get(code) {
    const m = await import(`./locales/${code}.json`);
    return m.default;
  },
});

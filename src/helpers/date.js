import {
  format as dateFnsFormat,
  formatDistance as dateFnsFormatDistance,
  formatDuration,
  intervalToDuration,
} from "date-fns";

// This file is generated automatically by `scripts/build/indices.js`. Please, don't change it.
const locales = {
 af: async () => { return (await import("date-fns/esm/locale/af/index.js")).default; },
 ar: async () => { return (await import("date-fns/esm/locale/ar/index.js")).default; },
 arDZ: async () => { return (await import("date-fns/esm/locale/ar-DZ/index.js")).default; },
 arEG: async () => { return (await import("date-fns/esm/locale/ar-EG/index.js")).default; },
 arMA: async () => { return (await import("date-fns/esm/locale/ar-MA/index.js")).default; },
 arSA: async () => { return (await import("date-fns/esm/locale/ar-SA/index.js")).default; },
 arTN: async () => { return (await import("date-fns/esm/locale/ar-TN/index.js")).default; },
 az: async () => { return (await import("date-fns/esm/locale/az/index.js")).default; },
 be: async () => { return (await import("date-fns/esm/locale/be/index.js")).default; },
 bg: async () => { return (await import("date-fns/esm/locale/bg/index.js")).default; },
 bn: async () => { return (await import("date-fns/esm/locale/bn/index.js")).default; },
 bs: async () => { return (await import("date-fns/esm/locale/bs/index.js")).default; },
 ca: async () => { return (await import("date-fns/esm/locale/ca/index.js")).default; },
 cs: async () => { return (await import("date-fns/esm/locale/cs/index.js")).default; },
 cy: async () => { return (await import("date-fns/esm/locale/cy/index.js")).default; },
 da: async () => { return (await import("date-fns/esm/locale/da/index.js")).default; },
 de: async () => { return (await import("date-fns/esm/locale/de/index.js")).default; },
 deAT: async () => { return (await import("date-fns/esm/locale/de-AT/index.js")).default; },
 el: async () => { return (await import("date-fns/esm/locale/el/index.js")).default; },
 enAU: async () => { return (await import("date-fns/esm/locale/en-AU/index.js")).default; },
 enCA: async () => { return (await import("date-fns/esm/locale/en-CA/index.js")).default; },
 enGB: async () => { return (await import("date-fns/esm/locale/en-GB/index.js")).default; },
 enIE: async () => { return (await import("date-fns/esm/locale/en-IE/index.js")).default; },
 enIN: async () => { return (await import("date-fns/esm/locale/en-IN/index.js")).default; },
 enNZ: async () => { return (await import("date-fns/esm/locale/en-NZ/index.js")).default; },
 enUS: async () => { return (await import("date-fns/esm/locale/en-US/index.js")).default; },
 enZA: async () => { return (await import("date-fns/esm/locale/en-ZA/index.js")).default; },
 eo: async () => { return (await import("date-fns/esm/locale/eo/index.js")).default; },
 es: async () => { return (await import("date-fns/esm/locale/es/index.js")).default; },
 et: async () => { return (await import("date-fns/esm/locale/et/index.js")).default; },
 eu: async () => { return (await import("date-fns/esm/locale/eu/index.js")).default; },
 faIR: async () => { return (await import("date-fns/esm/locale/fa-IR/index.js")).default; },
 fi: async () => { return (await import("date-fns/esm/locale/fi/index.js")).default; },
 fr: async () => { return (await import("date-fns/esm/locale/fr/index.js")).default; },
 frCA: async () => { return (await import("date-fns/esm/locale/fr-CA/index.js")).default; },
 frCH: async () => { return (await import("date-fns/esm/locale/fr-CH/index.js")).default; },
 gd: async () => { return (await import("date-fns/esm/locale/gd/index.js")).default; },
 gl: async () => { return (await import("date-fns/esm/locale/gl/index.js")).default; },
 gu: async () => { return (await import("date-fns/esm/locale/gu/index.js")).default; },
 he: async () => { return (await import("date-fns/esm/locale/he/index.js")).default; },
 hi: async () => { return (await import("date-fns/esm/locale/hi/index.js")).default; },
 hr: async () => { return (await import("date-fns/esm/locale/hr/index.js")).default; },
 ht: async () => { return (await import("date-fns/esm/locale/ht/index.js")).default; },
 hu: async () => { return (await import("date-fns/esm/locale/hu/index.js")).default; },
 hy: async () => { return (await import("date-fns/esm/locale/hy/index.js")).default; },
 id: async () => { return (await import("date-fns/esm/locale/id/index.js")).default; },
 is: async () => { return (await import("date-fns/esm/locale/is/index.js")).default; },
 it: async () => { return (await import("date-fns/esm/locale/it/index.js")).default; },
 ja: async () => { return (await import("date-fns/esm/locale/ja/index.js")).default; },
 jaHira: async () => { return (await import("date-fns/esm/locale/ja-Hira/index.js")).default; },
 ka: async () => { return (await import("date-fns/esm/locale/ka/index.js")).default; },
 kk: async () => { return (await import("date-fns/esm/locale/kk/index.js")).default; },
 km: async () => { return (await import("date-fns/esm/locale/km/index.js")).default; },
 kn: async () => { return (await import("date-fns/esm/locale/kn/index.js")).default; },
 ko: async () => { return (await import("date-fns/esm/locale/ko/index.js")).default; },
 lb: async () => { return (await import("date-fns/esm/locale/lb/index.js")).default; },
 lt: async () => { return (await import("date-fns/esm/locale/lt/index.js")).default; },
 lv: async () => { return (await import("date-fns/esm/locale/lv/index.js")).default; },
 mk: async () => { return (await import("date-fns/esm/locale/mk/index.js")).default; },
 mn: async () => { return (await import("date-fns/esm/locale/mn/index.js")).default; },
 ms: async () => { return (await import("date-fns/esm/locale/ms/index.js")).default; },
 mt: async () => { return (await import("date-fns/esm/locale/mt/index.js")).default; },
 nb: async () => { return (await import("date-fns/esm/locale/nb/index.js")).default; },
 nl: async () => { return (await import("date-fns/esm/locale/nl/index.js")).default; },
 nlBE: async () => { return (await import("date-fns/esm/locale/nl-BE/index.js")).default; },
 nn: async () => { return (await import("date-fns/esm/locale/nn/index.js")).default; },
 pl: async () => { return (await import("date-fns/esm/locale/pl/index.js")).default; },
 pt: async () => { return (await import("date-fns/esm/locale/pt/index.js")).default; },
 ptBR: async () => { return (await import("date-fns/esm/locale/pt-BR/index.js")).default; },
 ro: async () => { return (await import("date-fns/esm/locale/ro/index.js")).default; },
 ru: async () => { return (await import("date-fns/esm/locale/ru/index.js")).default; },
 sk: async () => { return (await import("date-fns/esm/locale/sk/index.js")).default; },
 sl: async () => { return (await import("date-fns/esm/locale/sl/index.js")).default; },
 sq: async () => { return (await import("date-fns/esm/locale/sq/index.js")).default; },
 sr: async () => { return (await import("date-fns/esm/locale/sr/index.js")).default; },
 srLatn: async () => { return (await import("date-fns/esm/locale/sr-Latn/index.js")).default; },
 sv: async () => { return (await import("date-fns/esm/locale/sv/index.js")).default; },
 ta: async () => { return (await import("date-fns/esm/locale/ta/index.js")).default; },
 te: async () => { return (await import("date-fns/esm/locale/te/index.js")).default; },
 th: async () => { return (await import("date-fns/esm/locale/th/index.js")).default; },
 tr: async () => { return (await import("date-fns/esm/locale/tr/index.js")).default; },
 ug: async () => { return (await import("date-fns/esm/locale/ug/index.js")).default; },
 uk: async () => { return (await import("date-fns/esm/locale/uk/index.js")).default; },
 uz: async () => { return (await import("date-fns/esm/locale/uz/index.js")).default; },
 vi: async () => { return (await import("date-fns/esm/locale/vi/index.js")).default; },
 zhCN: async () => { return (await import("date-fns/esm/locale/zh-CN/index.js")).default; },
 zhHK: async () => { return (await import("date-fns/esm/locale/zh-HK/index.js")).default; },
 zhTW: async () => { return (await import("date-fns/esm/locale/zh-TW/index.js")).default; },
};

export async function format(date, formatStr) {
  const language = navigator.language;
  // Now, check if locales[language] exists, but for the check, remove the - from the language code
  if (locales[language.replace("-", "")])
    return dateFnsFormat(date, formatStr, {
      locale: await locales[language.replace("-", "")](),
    });
  // Otherwise, check if just the language code exists
  else if (locales[language.split("-")[0]])
    return dateFnsFormat(date, formatStr, {
      locale: await locales[language.split("-")[0]](),
    });
  // Otherwise, return the default date format
  else return dateFnsFormat(date, formatStr, { locale: await locales.enUS() });
}

export async function formatDistance(Date, baseDate) {
  const language = navigator.language;
  // Now, check if locales[language] exists, but for the check, remove the - from the language code
  if (locales[language.replace("-", "")])
    return dateFnsFormatDistance(Date, baseDate, {
      locale: await locales[language.replace("-", "")](),
    });
  // Otherwise, check if just the language code exists
  else if (locales[language.split("-")[0]])
    return dateFnsFormatDistance(Date, baseDate, {
      locale: await locales[language.split("-")[0]](),
    });
  // Otherwise, return the default date format
  else return dateFnsFormatDistance(Date, baseDate, { locale: await locales.enUS() });
}

const dateFormats = {
  en: "MMM d, yyyy h:mm a",
  de: "i. MMM yyyy HH:mm",
};
const dateFormatsWithSeconds = {
  en: "MMMM d, yyyy h:mm:ss a",
  de: "i. MMMM yyyy HH:mm:ss",
};

export function getDateFormat() {
  const language = navigator.language;
  // language is something like de-DE, so we need to remove the -
  // Also check if a key with the language code exists
  if (dateFormats[language.replace("-", "")])
    return dateFormats[language.replace("-", "")];
  // Otherwise, check if just the language code exists
  else if (dateFormats[language.split("-")[0]])
    return dateFormats[language.split("-")[0]];
  // Otherwise, return the default date format
  else return dateFormats.en;
}

export function getDateFormatWithSeconds() {
  const language = navigator.language;
  // language is something like de-DE, so we need to remove the -
  // Also check if a key with the language code exists
  if (dateFormatsWithSeconds[language.replace("-", "")])
    return dateFormatsWithSeconds[language.replace("-", "")];
  // Otherwise, check if just the language code exists
  else if (dateFormatsWithSeconds[language.split("-")[0]])
    return dateFormatsWithSeconds[language.split("-")[0]];
  // Otherwise, return the default date format
  else return dateFormatsWithSeconds.en;
}

export async function prettifySeconds(seconds) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return await formatDuration(duration);
}

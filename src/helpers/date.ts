import {
  format as dateFnsFormat,
  formatDistance as dateFnsFormatDistance,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import * as locales from "date-fns/locale";

export function format(date: number | Date, formatStr: string) {
  const language = navigator.language;
  // Now, check if locales[language] exists, but for the check, remove the - from the language code
  if (locales[language.replace("-", "") as keyof typeof locales])
    return dateFnsFormat(date, formatStr, {
      locale: locales[language.replace("-", "") as keyof typeof locales],
    });
  // Otherwise, check if just the language code exists
  else if (locales[language.split("-")[0] as keyof typeof locales])
    return dateFnsFormat(date, formatStr, {
      locale: locales[language.split("-")[0] as keyof typeof locales],
    });
  // Otherwise, return the default date format
  else return dateFnsFormat(date, formatStr, { locale: locales.enUS });
}

export function formatDistance(date: number | Date, baseDate: number | Date) {
  const language = navigator.language;
  // Now, check if locales[language] exists, but for the check, remove the - from the language code
  if (locales[language.replace("-", "") as keyof typeof locales])
    return dateFnsFormatDistance(date, baseDate, {
      locale: locales[language.replace("-", "") as keyof typeof locales],
    });
  // Otherwise, check if just the language code exists
  else if (locales[language.split("-")[0] as keyof typeof locales])
    return dateFnsFormatDistance(date, baseDate, {
      locale: locales[language.split("-")[0] as keyof typeof locales],
    });
  // Otherwise, return the default date format
  else return dateFnsFormatDistance(date, baseDate, { locale: locales.enUS });
}

const dateFormats: Record<string, string> = {
  en: "MMM d, yyyy h:mm a",
  de: "i. MMM yyyy HH:mm",
};
const dateFormatsWithSeconds: Record<string, string> = {
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

export function prettifySeconds(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration);
}

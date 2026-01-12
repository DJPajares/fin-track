const rawLanguages = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'de',
    label: 'Deutsch',
  },
  {
    value: 'fil',
    label: 'Filipino',
  },
  {
    value: 'fr',
    label: 'Français',
  },
  {
    value: 'hi',
    label: 'हिन्दी',
  },
  {
    value: 'ja',
    label: '日本語',
  },
  {
    value: 'ko',
    label: '한국어',
  },
  {
    value: 'zh',
    label: 'Chinese (Simplified)',
  },
  {
    value: 'es',
    label: 'Español',
  },
  {
    value: 'ar',
    label: 'العربية',
  },
  {
    value: 'ru',
    label: 'Русский',
  },
  {
    value: 'it',
    label: 'Italiano',
  },
  {
    value: 'tr',
    label: 'Türkçe',
  },
  {
    value: 'vi',
    label: 'Tiếng Việt',
  },
  {
    value: 'th',
    label: 'ไทย',
  },
  {
    value: 'id',
    label: 'Bahasa Indonesia',
  },
  {
    value: 'ms',
    label: 'Bahasa Melayu',
  },
] as const;

export const languages = [...rawLanguages].sort((a, b) => {
  if (a.value === 'en') return -1;
  if (b.value === 'en') return 1;
  return a.label.localeCompare(b.label);
});

export const locales = rawLanguages.map((language) => language.value);

export type LocaleProps = (typeof locales)[number];

export const defaultLocale: LocaleProps = 'en';

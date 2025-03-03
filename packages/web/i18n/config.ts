const rawLanguages = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'de',
    label: 'German'
  },
  {
    value: 'fil',
    label: 'Filipino'
  },
  {
    value: 'fr',
    label: 'French'
  },
  {
    value: 'hi',
    label: 'Hindi'
  },
  {
    value: 'ja',
    label: 'Japanese'
  },
  {
    value: 'zh',
    label: 'Mandarin'
  },
  {
    value: 'es',
    label: 'Spanish'
  },
  {
    value: 'ar',
    label: 'Arabic'
  },
  {
    value: 'ru',
    label: 'Russian'
  },
  {
    value: 'it',
    label: 'Italian'
  },
  {
    value: 'tr',
    label: 'Turkish'
  },
  {
    value: 'vi',
    label: 'Vietnamese'
  },
  {
    value: 'th',
    label: 'Thai'
  },
  {
    value: 'id',
    label: 'Indonesian'
  },
  {
    value: 'ms',
    label: 'Malay'
  }
] as const;

export const languages = [...rawLanguages].sort((a, b) => {
  if (a.value === 'en') return -1;
  if (b.value === 'en') return 1;
  return a.label.localeCompare(b.label);
});

export const locales = rawLanguages.map((language) => language.value);

export type LocaleProps = (typeof locales)[number];

export const defaultLocale: LocaleProps = 'en';

export const languages = [
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
  }
] as const;

export const locales = languages.map((language) => language.value);

export type LocaleProps = (typeof locales)[number];

export const defaultLocale: LocaleProps = 'en';

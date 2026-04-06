import { languages } from 'packages/shared/constants/languages';

export type LocaleProps = (typeof languages)[number]['value'];

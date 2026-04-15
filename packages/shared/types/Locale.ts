import { languages } from '../constants/languages';

export type LocaleProps = (typeof languages)[number]['value'];

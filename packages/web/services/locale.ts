'use server';

import { cookies } from 'next/headers';
import { LocaleProps } from '@shared/types/Locale';

const COOKIE_NAME = 'NEXT_LOCALE';

const defaultLocale: LocaleProps = 'en';

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: LocaleProps) {
  (await cookies()).set(COOKIE_NAME, locale);
}

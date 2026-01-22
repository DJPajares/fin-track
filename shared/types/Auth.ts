import { LocaleProps } from '@shared/types/Locale';

export type AuthUser = {
  id: string; // MongoDB ObjectId as string
  email?: string | null;
  name?: string | null;
  image?: string | null;
  settings?: {
    language?: LocaleProps | null;
    currency?: string | null;
    darkMode?: boolean | null;
  };
};

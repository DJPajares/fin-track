import type { Metadata } from 'next';

// These styles apply to every route in the application
import './globals.css';
import { Providers } from '../providers/providers';
import NavBar from '@/components/Nav/NavBar';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: 'Fin-Track',
  description: 'Financial tracker tool'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main
              className="w-screen bg-white dark:bg-slate-950"
              vaul-drawer-wrapper=""
            >
              <NavBar>
                <div className="py-2 px-6 sm:px-8">{children}</div>
              </NavBar>
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

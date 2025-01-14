import type { Metadata } from 'next';

import './globals.css';
import { Providers } from '../providers/providers';
import NavBar from '../components/Nav/NavBar';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from '../components/ui/toaster';

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="bg-white dark:bg-slate-950" vaul-drawer-wrapper="">
              <NavBar>
                <div className="w-full py-2 px-6 sm:px-8">{children}</div>
              </NavBar>
            </main>

            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

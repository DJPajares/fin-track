import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';

import './globals.css';
import { Providers } from '../providers/providers';
import { raleway } from '../lib/fonts';

import { Toaster } from '../components/ui/sonner';
import { NavBarWrapper } from '../components/Nav/NavBarWrapper';

export const metadata: Metadata = {
  title: 'Fin-Track',
  description: 'Financial tracker tool',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${raleway.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`antialiased ${raleway.className}`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <main className="bg-background" vaul-drawer-wrapper="">
                <NavBarWrapper>{children}</NavBarWrapper>
              </main>

              <Toaster />
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

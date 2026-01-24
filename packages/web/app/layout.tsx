import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';
import { Providers } from '../providers/providers';
import { montserrat } from '../lib/fonts';

import NavBar from '../components/Nav/NavBar';
import { Toaster } from '../components/ui/sonner';
import PWAInstallPrompt from '../components/shared/PWAInstallPrompt';
import PWARefreshButton from '../components/shared/PWARefreshButton';

import { CONSTANTS } from '@shared/constants/common';

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME,
  description: 'Financial tracker tool for managing your personal finances',
  manifest: '/manifest.ts',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: CONSTANTS.APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="application-name" content={CONSTANTS.APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={CONSTANTS.APP_NAME} />
        <meta
          name="description"
          content="Financial tracker tool for managing your personal finances"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body
        className={`${montserrat.className} ${montserrat.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="bg-background" vaul-drawer-wrapper="">
              <NavBar>
                <div className="mx-auto max-w-5xl justify-center">
                  <div className="flex min-h-[calc(100dvh-3rem)] flex-col gap-4 p-4 sm:min-h-[calc(100dvh-3.5rem)] sm:gap-8 sm:p-8">
                    {children}
                  </div>
                </div>
              </NavBar>
            </main>

            <Toaster />
            <PWAInstallPrompt />
            <PWARefreshButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

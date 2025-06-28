import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';
import { Providers } from '../providers/providers';
import { raleway } from '../lib/fonts';

import NavBar from '../components/Nav/NavBar';
import { Toaster } from '@web/components/ui/sonner';
import PWAInstallPrompt from '../components/shared/PWAInstallPrompt';
import OfflineIndicator from '../components/shared/OfflineIndicator';

export const metadata: Metadata = {
  title: 'Fin-Track',
  description: 'Financial tracker tool for managing your personal finances',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport:
    'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fin-Track',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
    apple: [{ url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  },
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
        <meta name="application-name" content="Fin-Track" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fin-Track" />
        <meta
          name="description"
          content="Financial tracker tool for managing your personal finances"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          href="/favicon.ico"
          sizes="any"
          type="image/x-icon"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`antialiased ${raleway.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="bg-background" vaul-drawer-wrapper="">
              <NavBar>
                <div className="w-full px-6 py-2 sm:px-8">{children}</div>
              </NavBar>
            </main>

            <Toaster />
            <OfflineIndicator />
            <PWAInstallPrompt />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

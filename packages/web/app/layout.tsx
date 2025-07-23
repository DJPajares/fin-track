import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';
import { Providers } from '../providers/providers';
import { raleway } from '../lib/fonts';

import NavBar from '../components/Nav/NavBar';
import { Toaster } from '@web/components/ui/sonner';
import PWAInstallPrompt from '../components/shared/PWAInstallPrompt';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import ServiceWorkerRegistration from '../components/shared/ServiceWorkerRegistration';
import PWARefreshButton from '../components/shared/PWARefreshButton';

export const metadata: Metadata = {
  title: 'Fin-Track',
  description: 'Financial tracker tool for managing your personal finances',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fin-Track',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      {
        url: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        url: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
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

        <link
          rel="icon"
          href="/icons/favicon.ico"
          sizes="any"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
          sizes="180x180"
          type="image/png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
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
            <ServiceWorkerRegistration />
            <PWARefreshButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

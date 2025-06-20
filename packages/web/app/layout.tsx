import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { Providers } from '../providers/providers';
import NavBar from '../components/Nav/NavBar';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from '../components/ui/toaster';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

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
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="bg-background" vaul-drawer-wrapper="">
              <NavBar>
                <div className="w-full px-6 py-2 sm:px-8">{children}</div>
              </NavBar>
            </main>

            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

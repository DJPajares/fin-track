import type { Metadata } from 'next';

// These styles apply to every route in the application
import './globals.css';
import { Providers } from './provider';
import NavMenu from '@/components/shared/NavMenu';

export const metadata: Metadata = {
  title: 'Fin-Track',
  description: 'Financial tracker tool'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <main
            className="min-h-screen bg-white dark:bg-slate-950"
            vaul-drawer-wrapper=""
          >
            <NavMenu />
            <div className="flex flex-col px-6 py-2 sm:py-4">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

// These styles apply to every route in the application
import './globals.css';
import { Providers } from '../providers/providers';
import NavBar from '@/components/Nav/NavBar';

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
            className="w-screen bg-white dark:bg-slate-950"
            vaul-drawer-wrapper=""
          >
            <NavBar>
              <div className="p-6 sm:p-8">{children}</div>
            </NavBar>
          </main>
        </Providers>
      </body>
    </html>
  );
}

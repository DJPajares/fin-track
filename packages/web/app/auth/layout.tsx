// import type { Metadata } from 'next';
// import { getLocale, getMessages } from 'next-intl/server';
// import { NextIntlClientProvider } from 'next-intl';
// import { Providers } from '../../providers/providers';
// import { raleway } from '../../lib/fonts';
// import AuthRehydrator from '../../components/auth/AuthRehydrator';
// import { Toaster } from '../../components/ui/sonner';

// export const metadata: Metadata = {
//   title: 'Fin-Track - Authentication',
//   description: 'Sign in or create your account',
// };

// export default async function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const locale = await getLocale();
//   const messages = await getMessages();

//   return (
//     <html
//       lang={locale}
//       suppressHydrationWarning
//       className={`${raleway.variable}`}
//     >
//       <head>
//         <meta name="application-name" content="Fin-Track" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-title" content="Fin-Track" />
//         <meta
//           name="description"
//           content="Financial tracker tool for managing your personal finances"
//         />
//         <meta name="format-detection" content="telephone=no" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="msapplication-config" content="/icons/browserconfig.xml" />
//         <meta name="msapplication-TileColor" content="#ffffff" />
//         <meta name="msapplication-tap-highlight" content="no" />
//         <meta name="theme-color" content="#ffffff" />

//         <link
//           rel="icon"
//           href="/icons/favicon.ico"
//           sizes="any"
//           type="image/x-icon"
//         />
//         <link
//           rel="apple-touch-icon"
//           href="/icons/apple-touch-icon.png"
//           sizes="180x180"
//           type="image/png"
//         />
//         <link rel="manifest" href="/manifest.json" />
//         <link
//           rel="mask-icon"
//           href="/icons/safari-pinned-tab.svg"
//           color="#000000"
//         />
//         <link rel="shortcut icon" href="/icons/favicon.ico" />
//       </head>
//       <body className={`antialiased ${raleway.className}`}>
//         <NextIntlClientProvider messages={messages}>
//           <Providers>
//             <AuthRehydrator />
//             <div className="min-h-screen bg-gray-50">{children}</div>
//             <Toaster />
//           </Providers>
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}

import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
  // reactStrictMode: true,
  // images: {
  //   unoptimized: true
  // },
  // output: 'export'
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

export default pwaConfig(withNextIntl(nextConfig) as any);

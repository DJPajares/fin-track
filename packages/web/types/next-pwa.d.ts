declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        cacheableResponse?: {
          statuses: number[];
        };
      };
    }>;
    buildExcludes?: Array<string | RegExp>;
    fallbacks?: {
      [key: string]: string;
    };
    reloadOnOnline?: boolean;
    swMinify?: boolean;
    workboxOptions?: {
      [key: string]: any;
    };
  }

  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}

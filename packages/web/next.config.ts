// next.config.js (Corrected for @serwist/next)

import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
  // Serwist will be handled via app/sw.ts manually
};

export default withNextIntl(nextConfig);

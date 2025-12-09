// next.config.js (Corrected for @serwist/next)

import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next'; // Using the correct import
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
};

// Use withSerwist and update the options object
const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
});

export default withSerwist(withNextIntl(nextConfig));

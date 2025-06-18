import createNextIntlPlugin from 'next-intl/plugin';
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

export default withNextIntl(nextConfig);

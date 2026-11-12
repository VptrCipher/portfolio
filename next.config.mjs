import { fileURLToPath } from 'node:url';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep tracing inside this application when it is nested in an unrelated checkout.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
};
export default nextConfig;

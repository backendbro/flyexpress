/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Speeds up `next build` locally; run `npm run lint` in CI when needed. */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

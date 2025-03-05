/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["grammy"],
  images: {
    domains: ["t.me"],
  },
};

export default nextConfig;

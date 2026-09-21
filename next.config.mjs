/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/shark-after-dark",
  assetPrefix: "/shark-after-dark/",
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;

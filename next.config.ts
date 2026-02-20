const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/portfolio" : "",
  assetPrefix: isProd ? "/portfolio/" : "",
  eslint: {
    ignoreDuringBuilds: true, // ← add this
  },
};

export default nextConfig;
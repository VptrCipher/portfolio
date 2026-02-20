const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/portfolio" : "",
  assetPrefix: isProd ? "/portfolio/" : "",
};

export default nextConfig;
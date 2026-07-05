// Import the MDX plugin
const withMDX = require("@next/mdx")();
const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to support MDX
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack(config) {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "../../../node_modules/.pnpm/node_modules"),
    ];
    return config;
  },
};

// Use the MDX plugin
module.exports = withMDX(nextConfig);

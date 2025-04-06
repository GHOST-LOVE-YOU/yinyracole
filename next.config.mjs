import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    // Existing rule to handle `.example` files using `raw-loader`
    config.module.rules.push({
      test: /\.example$/,
      use: "raw-loader",
    });

    // New configuration to alias 'canvas' to false
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default withMDX(config);

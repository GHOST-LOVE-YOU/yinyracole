import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.example$/,
      use: "raw-loader",
    });
    return config;
  },
};

export default withMDX(config);

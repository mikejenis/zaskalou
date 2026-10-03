import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: isGithubPages ? "/zaskalou" : undefined,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const customDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN === "true";
const basePath = isGithubPages && !customDomain ? "/zaskalou" : "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;

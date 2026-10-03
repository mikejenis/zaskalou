import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: isGithubPages ? "/zaskalou" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/zaskalou" : ""
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;

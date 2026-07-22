import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        // ponytail: static Pages export only needs app/; skip CF worker/db typecheck
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;

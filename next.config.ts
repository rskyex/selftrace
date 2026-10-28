import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import pkg from "./package.json";

/** Instrument version for exported results: git short sha, else package version. */
function instrumentVersion(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return pkg.version;
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_INSTRUMENT_VERSION: instrumentVersion(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

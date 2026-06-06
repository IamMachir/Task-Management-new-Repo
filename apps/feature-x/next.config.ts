import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cbsd/ui-components", "@cbsd/utils"],
};

export default nextConfig;

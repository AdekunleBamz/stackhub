import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * Includes Polyfills for crypto-browserify (required for Stacks.js).
 */
const nextConfig: NextConfig = {
  /**
   * Enable React Compiler for experimental optimizations.
   */
  reactCompiler: true,
  /**
   * Configure Turbopack options (empty for defaults).
   */
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
      };
    }
    return config;
  },
};

export default nextConfig;

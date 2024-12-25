/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
import webpack from 'webpack';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: require.resolve('url/'),
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
      };

      config.plugins = [
        ...config.plugins,
        // Add polyfills for node built-in modules
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];

      // Handle node: protocol imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:url': require.resolve('url/'),
        'node:buffer': require.resolve('buffer/'),
        'node:util': require.resolve('util/'),
        'node:stream': require.resolve('stream-browserify'),
        'node:assert': require.resolve('assert/'),
        'node:crypto': require.resolve('crypto-browserify'),
      };
    }
    return config;
  },
};

export default nextConfig;
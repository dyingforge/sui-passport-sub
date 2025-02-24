/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                hostname: "images.suipassport.app",
            },
        ],
    },
    async headers() {
        return [
            {
              source: '/:path*',
              headers: [
                {
                  key: 'referrer-policy',
                  value: 'no-referrer',
                },
                {
                  key: 'Cross-Origin-Opener-Policy',
                  value: 'same-origin',
                },
                {
                  key: 'Cross-Origin-Embedder-Policy',
                  value: 'unsafe-none',
                }
              ],
            },
          ];
    },
};

export default config;

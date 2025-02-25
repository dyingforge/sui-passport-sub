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
                      value: 'no-referrer-when-downgrade',  // 最宽松的 referrer policy
                  },
                  {
                      key: 'Cross-Origin-Opener-Policy',
                      value: 'unsafe-none',  // 最宽松的 COOP
                  },
                  {
                      key: 'Cross-Origin-Embedder-Policy',
                      value: 'unsafe-none',  // 最宽松的 COEP
                  },
                  {
                      key: 'Cross-Origin-Resource-Policy',
                      value: 'cross-origin'  // 最宽松的 CORP
                  },
                  {
                      key: 'Access-Control-Allow-Origin',
                      value: '*'  // 允许所有域名访问
                  }
              ],
          },
      ];
  },
};

export default config;

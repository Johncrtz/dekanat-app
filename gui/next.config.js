// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

// @ts-check
/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    // compress: true,
    serverRuntimeConfig: {
        ironAuthSecret: process.env.IRON_AUTH_SECRET,
    },
    // publicRuntimeConfig: {},
    // swcMinify: true, // experimental – does not work
    eslint: {
        dirs: ["src"],
        ignoreDuringBuilds: true,
    },
    compiler: { removeConsole: false },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\/dekanat-app-plugin\/.*\.ts$/,
            use: [
                {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        onlyCompileBundledFiles: true,
                    }
                }
            ],
        })
        config.module.rules.push({
            test: /\/shared\/.*\.ts$/,
            use: [
                {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        onlyCompileBundledFiles: true,
                    }
                }
            ],
        })
        return config
    },
    // experimental: {
    // should improve the mui imports but does not work yet
    // modularizeImports: {
    //     "@mui/material/?(((\\w*)?/?)*)": {
    //         transform: "@mui/material/{{ matches.[1] }}/{{member}}",
    //     },
    //     "@mui/icons-material/?(((\\w*)?/?)*)": {
    //         transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    //     },
    // },
    // },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        // Maximum payload size in bytes. Set to 0 for no limit.
        maxPayloadSize: 0,
    },
}

module.exports = nextConfig

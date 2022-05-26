/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: "/:path*",
                    destination: "/api/:path*",
                },
            ],
        };
    },
};

module.exports = nextConfig;

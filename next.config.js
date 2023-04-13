const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/contracts/old',
    assetPrefix: '/contracts/old',
    reactStrictMode: false,
    swcMinify: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        SERVER_URL: process.env.SERVER_URL,
        SERVER_URL: process.env.APP_URL,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '4200',
            pathname: '/uploads/**',
          },
        ],
      },

};

export default nextConfig;

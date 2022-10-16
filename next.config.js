/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/register",
        permanent: true,
      },
    ];
  }
}

module.exports = nextConfig

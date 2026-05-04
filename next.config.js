const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {},
});

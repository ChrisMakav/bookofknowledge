import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.sanogobooks.com' },
      { protocol: 'https', hostname: 'metanoiaetvie.com' },
      { protocol: 'https', hostname: 'yop.l-frii.com' },
    ],
  },
};

export default nextConfig;

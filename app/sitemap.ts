export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://camerasimulator.app';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/emulator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];
}

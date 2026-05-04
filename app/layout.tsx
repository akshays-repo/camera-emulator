import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = 'https://camerasimulator.app';
const TITLE    = 'Camera Simulator — Learn ISO, Aperture & Shutter Speed';
const DESC     = 'Free interactive camera simulator. Adjust ISO, aperture, and shutter speed in real-time across 5 animated scenes. See exactly how each setting changes your photo — perfect for beginner and intermediate photographers.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  keywords: [
    'camera simulator', 'photography simulator', 'learn photography',
    'ISO explained', 'aperture explained', 'shutter speed explained',
    'exposure triangle', 'DSLR simulator', 'camera settings', 'photography basics',
  ],
  authors: [{ name: 'Camera Simulator' }],
  creator: 'Camera Simulator',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESC,
    siteName: 'Camera Simulator',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Camera Sim' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0d0d0d',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Camera Simulator',
  url: SITE_URL,
  description: DESC,
  applicationCategory: 'EducationApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Real-time ISO simulation',
    'Aperture exposure control',
    'Shutter speed motion blur',
    '5 animated scenes',
    'Photo gallery with save',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

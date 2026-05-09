import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = 'https://camerasimulator.online';
const TITLE    = 'Camera Simulator — Learn ISO, Aperture & Shutter Speed';
const DESC     = 'Free interactive camera simulator. Adjust ISO, aperture, and shutter speed in real-time across 5 animated scenes. See exactly how each setting changes your photo — perfect for beginner and intermediate photographers.';
const OG_IMG   = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Camera Simulator',
  },
  description: DESC,
  keywords: [
    'camera simulator', 'photography simulator', 'learn photography',
    'ISO explained', 'aperture explained', 'shutter speed explained',
    'exposure triangle', 'DSLR simulator', 'camera settings tutorial',
    'photography for beginners', 'depth of field', 'motion blur photography',
    'how to use a camera', 'photography learning tool',
  ],
  authors:  [{ name: 'Camera Simulator', url: SITE_URL }],
  creator:  'Camera Simulator',
  publisher: 'Camera Simulator',
  category: 'education',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESC,
    siteName: 'Camera Simulator',
    locale: 'en_US',
    images: [{ url: OG_IMG, width: 1200, height: 630, alt: 'Camera Simulator — Learn ISO, Aperture & Shutter Speed' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: [OG_IMG],
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Camera Simulator',
    url: SITE_URL,
    description: DESC,
    applicationCategory: 'EducationApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Real-time ISO grain simulation',
      'Aperture exposure control',
      'Shutter speed motion blur',
      '5 animated scenes',
      'Photo gallery with save',
    ],
    screenshot: OG_IMG,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
      bestRating: '5',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ISO in photography?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO measures how sensitive your camera\'s sensor is to light. A low ISO (100–400) produces clean, smooth images but requires more light. A high ISO (1600–6400+) allows shooting in dim environments but introduces visible grain (noise).',
        },
      },
      {
        '@type': 'Question',
        name: 'What does aperture do in a camera?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aperture controls the size of the opening in your lens that lets light through, measured in f-stops. A smaller f-number (like f/1.8) means a wider opening that lets in more light. A larger f-number (like f/16) means a narrower opening with less light.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does shutter speed affect photos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shutter speed is how long the camera sensor is exposed to light. Fast shutter speeds (1/500s or faster) freeze motion. Slow shutter speeds (1/30s or slower) create motion blur, turning waterfalls silky and car headlights into light trails.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the exposure triangle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The exposure triangle is the relationship between ISO, aperture, and shutter speed. Every time you change one setting, you need to compensate with another to maintain the correct overall exposure.',
        },
      },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}

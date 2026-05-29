import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const siteUrl = 'https://business-asap.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'business-ASAP — Launch your tech startup in 30 days',
    template: '%s | business-ASAP',
  },
  description:
    'Code, office space, and team — all handled. business-ASAP turns your idea into a live business without the chaos. No upfront cost — we take 25%.',
  keywords: ['startup', 'tech startup', 'launch startup', 'MVP', 'Pakistan', 'founder', 'business'],
  authors: [{ name: 'business-ASAP' }],
  openGraph: {
    title: 'business-ASAP — Launch your tech startup in 30 days',
    description: 'Code, office space, and team — all handled. No upfront cost. We take 25%.',
    url: siteUrl,
    siteName: 'business-ASAP',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'business-ASAP — Launch your tech startup in 30 days',
    description: 'Code, office space, and team — all handled. No upfront cost. We take 25%.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

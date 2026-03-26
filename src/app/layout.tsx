import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { PresentationToggle } from '@/components/layout/PresentationToggle';
import { DataProvider } from '@/lib/data/context';

export const metadata: Metadata = {
  metadataBase: new URL('https://selftrace.vercel.app'),
  title: {
    default: 'SelfTrace',
    template: '%s — SelfTrace',
  },
  description: 'Explore how your digital environment may have shaped what became visible, repeated, and reinforced in your sense of self.',
  openGraph: {
    title: 'SelfTrace',
    description: 'You\u2019ve been becoming yourself online for years. Do you know which parts were yours?',
    type: 'website',
    images: [
      {
        url: '/selftrace-1.png',
        width: 1200,
        height: 630,
        alt: 'SelfTrace — layered identity reconstruction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SelfTrace',
    description: 'You\u2019ve been becoming yourself online for years. Do you know which parts were yours?',
    images: ['/selftrace-1.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-linen-50 text-ink-900 min-h-screen">
        <PresentationToggle />
        <DataProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-umber-600 focus:rounded-lg font-sans text-[13px] font-medium">
            Skip to content
          </a>
          <TopNav />
          <main id="main-content" className="mt-16">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}

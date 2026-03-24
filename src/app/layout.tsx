import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { PresentationToggle } from '@/components/layout/PresentationToggle';
import { DataProvider } from '@/lib/data/context';

export const metadata: Metadata = {
  title: 'SelfTrace — See how platforms shaped your online self',
  description: 'Understand how algorithmic feeds and engagement incentives may have shaped your online identity over time. Private, reflective, beautiful.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-charcoal-900 min-h-screen">
        <PresentationToggle />
        <DataProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-accent-700 focus:border focus:border-accent-500 focus:rounded-lg text-[13px] font-medium"
          >
            Skip to content
          </a>
          <TopNav />
          <main id="main-content" className="mt-14">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}

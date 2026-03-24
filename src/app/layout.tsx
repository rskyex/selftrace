import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { PresentationToggle } from '@/components/layout/PresentationToggle';
import { DataProvider } from '@/lib/data/context';

export const metadata: Metadata = {
  title: 'The Platformed Self',
  description: 'A reflective observatory for examining how algorithmic platforms may shape self-presentation over time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-charcoal-900 min-h-screen">
        <PresentationToggle />
        <DataProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-cream-50 focus:px-4 focus:py-2 focus:text-teal-700 focus:border focus:border-teal-700 focus:rounded-sm font-interface text-[12px]">
            Skip to content
          </a>
          <TopNav />
          <main id="main-content" className="mt-12">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}

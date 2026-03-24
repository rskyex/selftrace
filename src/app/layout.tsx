import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { PresentationToggle } from '@/components/layout/PresentationToggle';
import { DataProvider } from '@/lib/data/context';

export const metadata: Metadata = {
  title: 'SelfTrace — See your online patterns clearly',
  description: 'A private, reflective tool that helps you understand how platform incentives may have shaped your online self over time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-warm-50 text-ink-900 min-h-screen">
        <PresentationToggle />
        <DataProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-violet-700 focus:border focus:border-violet-400 focus:rounded-lg font-sans text-[13px]">
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

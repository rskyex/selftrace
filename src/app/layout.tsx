import type { Metadata } from 'next';
import './globals.css';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { DataProvider } from '@/lib/data/context';

export const metadata: Metadata = {
  title: 'The Platformed Self',
  description: 'A reflective observatory for examining how algorithmic platforms may shape self-presentation over time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-charcoal-900 min-h-screen">
        <DataProvider>
          <TopNav />
          <main className="mt-14">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}

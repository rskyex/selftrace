'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useData } from '@/lib/data/context';

const links = [
  { href: '/portrait', label: 'Your portrait' },
  { href: '/drift', label: 'Your drift' },
  { href: '/patterns', label: 'What stuck' },
  { href: '/about', label: 'How it works' },
];

export function TopNav() {
  const pathname = usePathname();
  const { isLoaded } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-50/92 backdrop-blur-md border-b border-warm-200/50" role="navigation" aria-label="Main">
      <div className="content-column h-14 px-6 flex items-center justify-between">
        <Link href="/" className="font-sans text-[16px] font-semibold text-ink-900 tracking-tight hover:text-violet-600">
          SelfTrace
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isLoaded && links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-[14px] px-3 py-1.5 rounded-lg ${
                pathname === link.href
                  ? 'text-violet-700 bg-violet-50 font-medium'
                  : 'text-ink-400 hover:text-ink-700 hover:bg-warm-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isLoaded && (
            <Link href="/about" className="font-sans text-[14px] px-3 py-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-warm-100">
              How it works
            </Link>
          )}

          <Link href="/privacy" className="font-sans text-[14px] px-3 py-1.5 rounded-lg text-ink-300 hover:text-ink-500 hover:bg-warm-100">
            Privacy
          </Link>

          <Link
            href="/start"
            className="ml-3 font-sans text-[14px] font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded-lg"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden text-ink-400 p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-warm-200 px-6 pb-4 pt-2">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block font-sans text-[15px] py-2.5 border-b border-warm-100 ${pathname === link.href ? 'text-violet-700 font-medium' : 'text-ink-500'}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/start" onClick={() => setMobileOpen(false)}
            className="block text-center mt-3 font-sans text-[15px] font-medium text-white bg-violet-600 px-4 py-2.5 rounded-lg">
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}

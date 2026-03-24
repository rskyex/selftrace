'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useData } from '@/lib/data/context';

const resultLinks = [
  { href: '/results', label: 'Your results' },
  { href: '/trends', label: 'Your trends' },
  { href: '/what-stuck', label: 'What stuck' },
];

export function TopNav() {
  const pathname = usePathname();
  const { isLoaded } = useData();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linen-50/92 backdrop-blur-md border-b border-linen-200/60" role="navigation" aria-label="Main">
      <div className="content-column h-14 px-6 flex items-center justify-between">
        <Link href="/" className="font-sans text-[17px] font-bold text-ink-900 tracking-tight hover:text-coral-600">
          SelfTrace
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isLoaded && resultLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`font-sans text-[14px] px-3.5 py-1.5 rounded-lg ${
                pathname === link.href
                  ? 'text-coral-700 bg-coral-50 font-medium'
                  : 'text-ink-400 hover:text-ink-700 hover:bg-linen-100'
              }`}>
              {link.label}
            </Link>
          ))}
          <Link href="/how-it-works"
            className={`font-sans text-[14px] px-3.5 py-1.5 rounded-lg ${
              pathname === '/how-it-works' ? 'text-ink-700 font-medium' : 'text-ink-300 hover:text-ink-500 hover:bg-linen-100'
            }`}>
            How it works
          </Link>
          {!isLoaded && (
            <Link href="/start" className="ml-2 btn-primary !py-1.5 !px-5 !text-[13px]">
              Get started
            </Link>
          )}
        </div>

        <button className="md:hidden p-2 -mr-2 text-ink-400" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open
              ? <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-linen-200 px-6 pb-4 pt-1">
          {isLoaded && resultLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block font-sans text-[15px] py-3 border-b border-linen-100 ${pathname === link.href ? 'text-coral-600 font-medium' : 'text-ink-500'}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/how-it-works" onClick={() => setOpen(false)} className="block font-sans text-[15px] py-3 border-b border-linen-100 text-ink-400">How it works</Link>
          {!isLoaded && (
            <Link href="/start" onClick={() => setOpen(false)} className="block text-center mt-3 btn-primary w-full">Get started</Link>
          )}
        </div>
      )}
    </nav>
  );
}

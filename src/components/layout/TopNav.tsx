'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useData } from '@/lib/data/context';

const resultLinks = [
  { href: '/results', label: 'Your results' },
  { href: '/algorithm-influence', label: 'Algorithm influence' },
  { href: '/kept', label: 'What you kept' },
];

export function TopNav() {
  const pathname = usePathname();
  const { isLoaded } = useData();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linen-50/90 backdrop-blur-md border-b border-linen-200/50" role="navigation" aria-label="Main">
      <div className="hero-column h-16 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="SelfTrace"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-sans text-[16px] font-semibold text-ink-900 tracking-tight">
            SelfTrace
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isLoaded && resultLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`font-sans text-[13px] px-3 py-1.5 rounded-lg ${
                pathname === link.href || (link.href === '/results' && ['/returning', '/rewarded', '/selves', '/shifted'].includes(pathname))
                  ? 'text-umber-600 font-medium'
                  : 'text-ink-400 hover:text-ink-700 hover:bg-linen-100'
              }`}>
              {link.label}
            </Link>
          ))}
          <Link href="/social"
            className={`font-sans text-[13px] px-3 py-1.5 rounded-lg ${
              pathname.startsWith('/social') ? 'text-umber-600 font-medium' : 'text-ink-400 hover:text-ink-700 hover:bg-linen-100'
            }`}>
            Connect account
          </Link>
          <Link href="/how-it-works"
            className={`font-sans text-[13px] px-3 py-1.5 rounded-lg ${
              pathname === '/how-it-works' ? 'text-ink-700 font-medium' : 'text-ink-300 hover:text-ink-500 hover:bg-linen-100'
            }`}>
            How it works
          </Link>
          {!isLoaded && (
            <Link href="/start" className="ml-3 btn-primary !py-2 !px-6 !text-[13px]">
              Begin
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
        <div className="md:hidden bg-white border-b border-linen-200 px-6 pb-5 pt-2">
          {isLoaded && resultLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block font-sans text-[15px] py-3 border-b border-linen-100 ${pathname === link.href ? 'text-umber-600 font-medium' : 'text-ink-500'}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/social" onClick={() => setOpen(false)} className={`block font-sans text-[15px] py-3 border-b border-linen-100 ${pathname.startsWith('/social') ? 'text-umber-600 font-medium' : 'text-ink-500'}`}>Connect account</Link>
          <Link href="/how-it-works" onClick={() => setOpen(false)} className="block font-sans text-[15px] py-3 text-ink-400">How it works</Link>
          {!isLoaded && (
            <Link href="/start" onClick={() => setOpen(false)} className="block text-center mt-4 btn-primary w-full">Begin</Link>
          )}
        </div>
      )}
    </nav>
  );
}

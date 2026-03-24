'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const mainLinks = [
  { href: '/overview', label: 'Overview' },
  { href: '/drift', label: 'Drift' },
  { href: '/reinforcement', label: 'Reinforcement' },
  { href: '/identity', label: 'Identity' },
  { href: '/compare', label: 'Compare' },
];

const secondaryLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/privacy', label: 'Privacy' },
];

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-cream-200/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="content-column h-14 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-[16px] font-semibold text-charcoal-900 tracking-tight hover:text-accent-600"
        >
          SelfTrace
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {mainLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] px-3 py-1.5 rounded-lg ${
                pathname === link.href
                  ? 'text-accent-700 bg-accent-50 font-medium'
                  : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <span className="w-px h-4 bg-cream-200 mx-2" aria-hidden="true" />

          {secondaryLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] px-3 py-1.5 rounded-lg ${
                pathname === link.href
                  ? 'text-charcoal-700 font-medium'
                  : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/connect"
            className="ml-3 text-[13px] font-medium text-white bg-accent-600 hover:bg-accent-700 px-4 py-1.5 rounded-lg"
          >
            Connect
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-charcoal-500 p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-cream-200 px-6 pb-4 pt-2">
          {[...mainLinks, ...secondaryLinks].map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-[14px] py-2.5 border-b border-cream-100 ${
                pathname === link.href ? 'text-accent-700 font-medium' : 'text-charcoal-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/connect"
            onClick={() => setMobileOpen(false)}
            className="block text-center mt-3 text-[14px] font-medium text-white bg-accent-600 px-4 py-2.5 rounded-lg"
          >
            Connect your data
          </Link>
        </div>
      )}
    </nav>
  );
}

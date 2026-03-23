'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const primaryLinks = [
  { href: '/timeline', label: 'Observatory' },
  { href: '/reinforcement', label: 'Patterns' },
  { href: '/narrative', label: 'Narrative' },
  { href: '/memory', label: 'Memory' },
  { href: '/civic', label: 'Civic' },
];

const secondaryLinks = [
  { href: '/governance', label: 'Governance' },
  { href: '/methodology', label: 'Methods' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/about', label: 'About' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50 border-b border-cream-200 h-14">
      <div className="content-column h-full px-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-interface text-[13px] text-charcoal-700 hover:text-charcoal-900 transition-colors duration-150 tracking-wide whitespace-nowrap"
        >
          The Platformed Self
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {primaryLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-interface text-[12px] px-3 py-1.5 rounded-sm transition-colors duration-150 ${
                  isActive
                    ? 'text-charcoal-900 border-b-2 border-teal-700'
                    : 'text-charcoal-500 hover:text-charcoal-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <span className="w-px h-4 bg-cream-200 mx-2" />

          {secondaryLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-interface text-[11px] px-2 py-1.5 transition-colors duration-150 ${
                  isActive
                    ? 'text-charcoal-700'
                    : 'text-charcoal-300 hover:text-charcoal-500'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

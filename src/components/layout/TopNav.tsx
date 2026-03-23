'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const analyticalLinks = [
  { href: '/timeline', label: 'Observatory' },
  { href: '/reinforcement', label: 'Patterns' },
  { href: '/narrative', label: 'Narrative' },
  { href: '/memory', label: 'Memory' },
  { href: '/civic', label: 'Civic' },
];

const referenceLinks = [
  { href: '/governance', label: 'Governance' },
  { href: '/methodology', label: 'Methods' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/about', label: 'About' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 h-12">
      <div className="content-column h-full px-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-interface text-[12px] text-charcoal-700 hover:text-charcoal-900 transition-colors duration-200 tracking-wide"
        >
          The Platformed Self
        </Link>

        <div className="hidden md:flex items-center">
          {analyticalLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-interface text-[11px] px-3 py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-charcoal-900'
                    : 'text-charcoal-400 hover:text-charcoal-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <span className="w-px h-3 bg-cream-300 mx-3" />

          {referenceLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-interface text-[10px] px-2 py-1 transition-colors duration-200 ${
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

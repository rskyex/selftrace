import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-cream-200 mt-16">
      <div className="content-column px-6 py-12">
        <p className="text-[13px] leading-relaxed text-charcoal-500 max-w-2xl">
          This tool analyzes self-presentation patterns in user-provided posting
          history. It does not observe platform recommendation algorithms directly.
          It cannot determine causation. All patterns shown are correlational, and
          all interpretations are provisional. You are the final authority on what
          your own data means.
        </p>

        <div className="flex flex-wrap gap-4 mt-6 font-interface text-[11px] text-charcoal-300">
          <Link href="/governance" className="hover:text-charcoal-500 transition-colors duration-150">Governance</Link>
          <Link href="/methodology" className="hover:text-charcoal-500 transition-colors duration-150">Methodology</Link>
          <Link href="/privacy" className="hover:text-charcoal-500 transition-colors duration-150">Privacy</Link>
          <Link href="/about" className="hover:text-charcoal-500 transition-colors duration-150">About</Link>
        </div>

        <p className="mt-6 font-interface text-[11px] text-charcoal-300">
          A research prototype. Not a product.
        </p>
      </div>
    </footer>
  );
}

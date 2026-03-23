import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-cream-200 mt-20">
      <div className="reading-column px-6 py-14">
        <p className="text-[13px] leading-[1.8] text-charcoal-400">
          This tool analyzes self-presentation patterns in user-provided posting
          history. It does not observe platform recommendation algorithms
          directly. It cannot determine causation. All patterns are
          correlational. All interpretations are provisional. You are the
          final authority on what your own data means.
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-8 font-interface text-[10px] text-charcoal-300">
          <Link href="/methodology" className="hover:text-charcoal-500 transition-colors duration-200">Methods</Link>
          <Link href="/governance" className="hover:text-charcoal-500 transition-colors duration-200">Governance</Link>
          <Link href="/privacy" className="hover:text-charcoal-500 transition-colors duration-200">Privacy</Link>
          <Link href="/about" className="hover:text-charcoal-500 transition-colors duration-200">About</Link>
        </div>

        <p className="mt-8 font-interface text-[10px] text-charcoal-300 tracking-wide">
          A research prototype. Not a product.
        </p>
      </div>
    </footer>
  );
}

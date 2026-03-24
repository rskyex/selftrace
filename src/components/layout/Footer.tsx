import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-warm-200 mt-24">
      <div className="reading-column px-6 py-16 text-center">
        <p className="font-sans text-[15px] font-semibold text-ink-900 tracking-tight mb-4">
          SelfTrace
        </p>
        <p className="text-[15px] text-ink-400 leading-relaxed max-w-sm mx-auto mb-8">
          A reflective tool, not a verdict. Everything here is a pattern,
          not a diagnosis. You decide what it means.
        </p>
        <div className="flex flex-wrap justify-center gap-6 font-sans text-[13px] text-ink-300 mb-8">
          <Link href="/about" className="hover:text-ink-500">How it works</Link>
          <Link href="/privacy" className="hover:text-ink-500">Privacy</Link>
          <Link href="/start" className="hover:text-ink-500">Get started</Link>
        </div>
        <p className="font-sans text-[12px] text-ink-300">
          Your data never leaves your browser. There is no server.
        </p>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-linen-200 mt-24">
      <div className="reading-column px-6 py-14 text-center">
        <p className="font-sans text-[16px] font-bold text-ink-900 tracking-tight mb-3">SelfTrace</p>
        <p className="text-[15px] text-ink-400 leading-relaxed max-w-xs mx-auto mb-8">
          A reflective tool, not a verdict. Patterns you can see are patterns you can choose.
        </p>
        <div className="flex justify-center gap-6 font-sans text-[13px] text-ink-300 mb-6">
          <Link href="/how-it-works" className="hover:text-ink-500">How it works</Link>
          <Link href="/start" className="hover:text-ink-500">Get started</Link>
        </div>
        <p className="font-sans text-[12px] text-ink-300">
          Your data never leaves your browser. There is no server.
        </p>
      </div>
    </footer>
  );
}

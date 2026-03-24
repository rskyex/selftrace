import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-linen-200 mt-32">
      <div className="reading-column px-6 py-16 text-center">
        <p className="font-sans text-[15px] font-bold text-ink-900 tracking-tight mb-4">SelfTrace</p>
        <p className="text-[16px] text-ink-500 leading-relaxed max-w-sm mx-auto mb-10">
          Patterns you can see are patterns you can choose.
        </p>
        <div className="flex justify-center gap-6 font-sans text-[12px] text-ink-300 mb-6">
          <Link href="/how-it-works" className="hover:text-ink-500">How it works</Link>
          <Link href="/start" className="hover:text-ink-500">Begin</Link>
        </div>
        <p className="font-sans text-[11px] text-ink-300">
          Your data never leaves your browser. There is no server.
        </p>
      </div>
    </footer>
  );
}

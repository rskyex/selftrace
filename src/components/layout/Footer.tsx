import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-linen-200 mt-32">
      <div className="hero-column px-6 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="SelfTrace"
                width={24}
                height={24}
                className="w-6 h-6 opacity-70"
              />
              <span className="font-sans text-[15px] font-semibold text-ink-900 tracking-tight">
                SelfTrace
              </span>
            </div>
            <p className="text-[15px] text-ink-500 leading-relaxed max-w-xs">
              Patterns you can see are patterns you can choose.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 font-sans text-[13px] text-ink-400">
            <Link href="/how-it-works" className="hover:text-ink-700">How it works</Link>
            <Link href="/start" className="hover:text-ink-700">Begin</Link>
            <Link href="/privacy" className="hover:text-ink-700">Privacy</Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-linen-200/60 text-center">
          <p className="font-sans text-[12px] text-ink-300">
            Private by design. All analysis runs locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-cream-200 mt-24 bg-white">
      <div className="content-column px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-[16px] font-semibold text-charcoal-900 tracking-tight mb-3">
              SelfTrace
            </p>
            <p className="text-[14px] text-charcoal-500 leading-relaxed max-w-sm">
              Understand how your online self may have been shaped by platform
              incentives. All analysis runs locally in your browser. Your data
              never leaves your device.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[12px] font-medium text-charcoal-400 uppercase tracking-wider mb-4">
              Product
            </p>
            <div className="space-y-2.5">
              <Link href="/overview" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Overview</Link>
              <Link href="/drift" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Drift</Link>
              <Link href="/reinforcement" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Reinforcement</Link>
              <Link href="/identity" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Identity</Link>
              <Link href="/compare" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Compare</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-[12px] font-medium text-charcoal-400 uppercase tracking-wider mb-4">
              About
            </p>
            <div className="space-y-2.5">
              <Link href="/how-it-works" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">How it works</Link>
              <Link href="/privacy" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Privacy</Link>
              <Link href="/connect" className="block text-[14px] text-charcoal-500 hover:text-charcoal-900">Connect data</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-charcoal-400">
            All patterns are correlational. All interpretations are yours.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-sage-500" aria-hidden="true" />
            <span className="text-[12px] text-charcoal-400">100% client-side</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

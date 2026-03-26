import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-column px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <p className="font-sans text-[13px] text-ink-400 tracking-widest uppercase mb-6 animate-fade-up">
              Memory &middot; Identity &middot; Drift
            </p>
            <h1 className="font-display text-[40px] md:text-[56px] lg:text-[64px] text-ink-900 leading-[1.08] tracking-tight mb-8 animate-fade-up animation-delay-100">
              You&apos;ve been becoming yourself online for years.
            </h1>
            <p className="text-[19px] md:text-[21px] text-ink-500 leading-[1.7] mb-10 max-w-md animate-fade-up animation-delay-200">
              Do you know which parts were yours — and which were shaped
              by the quiet architecture of the platforms around you?
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up animation-delay-300">
              <Link href="/start" className="btn-primary">
                Begin
              </Link>
              <Link href="/start?demo=true" className="btn-secondary">
                Try a fictional profile
              </Link>
            </div>
            <div className="mt-6 animate-fade-up animation-delay-400">
              <Link href="#how" className="btn-tertiary">
                How it works &darr;
              </Link>
            </div>
          </div>

          {/* Right: Hero image */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/selftrace-1.png"
                alt="Layered paper-cut profiles representing the sedimented layers of digital identity"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Subtle edge fade to blend into background */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'linear-gradient(to right, var(--color-linen-50) 0%, transparent 8%, transparent 92%, var(--color-linen-50) 100%)'
              }}
            />
          </div>
        </div>
      </section>

      {/* ── The Observation ──────────────────────────────── */}
      <section id="how" className="py-28 md:py-36">
        <div className="hero-column px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Narrow side accent */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden opacity-70">
                <Image
                  src="/selftrace-3.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            </div>

            {/* Main text */}
            <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
              <div className="section-rule mb-10 !mx-0" />
              <div className="prose-body">
                <p className="text-[19px] md:text-[20px] text-ink-700 leading-[1.85]">
                  Every platform you post on has a quiet influence — rewarding some
                  things, ignoring others, surfacing certain patterns back to you.
                  Over time, that shapes which version of yourself becomes easiest
                  to inhabit.
                </p>
                <p className="text-[19px] md:text-[20px] text-ink-700 leading-[1.85]">
                  Memory is not perfectly retrieved; it&apos;s reassembled. Identity is not
                  statically stored; it&apos;s narratively maintained. In digital environments,
                  that reconstruction process now has computational participants inside it.
                </p>
                <p className="text-[18px] text-ink-500 leading-[1.85]">
                  SelfTrace helps you see how. Not to alarm you. Not to tell you
                  what to fix. To give you visibility into a process that has been
                  happening quietly, so you can decide what it means for yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What It Shows ────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="hero-column px-6">
          <p className="font-sans text-[13px] text-ink-400 tracking-widest uppercase mb-16 text-center">
            Three dimensions of self-trace
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: What keeps resurfacing */}
            <div className="insight-panel insight-panel-warm animate-fade-up">
              <p className="font-sans text-[12px] text-umber-600 tracking-widest uppercase mb-4">
                Resurfacing
              </p>
              <h3 className="font-display text-[24px] md:text-[26px] text-ink-900 leading-[1.2] mb-5">
                What keeps coming back
              </h3>
              <p className="text-[16px] text-ink-600 leading-[1.8]">
                Which phrases, themes, and framings you return to — and whether
                they look the same each time they come back.
              </p>
            </div>

            {/* Card 2: What the environment rewarded */}
            <div className="insight-panel animate-fade-up animation-delay-100">
              <p className="font-sans text-[12px] text-trace-600 tracking-widest uppercase mb-4">
                Reinforcement
              </p>
              <h3 className="font-display text-[24px] md:text-[26px] text-ink-900 leading-[1.2] mb-5">
                What the environment rewarded
              </h3>
              <p className="text-[16px] text-ink-600 leading-[1.8]">
                Which kinds of expression got more response — and whether those
                same patterns became more frequent over time.
              </p>
            </div>

            {/* Card 3: What you kept */}
            <div className="insight-panel insight-panel-sage animate-fade-up animation-delay-200">
              <p className="font-sans text-[12px] text-sage-600 tracking-widest uppercase mb-4">
                Agency
              </p>
              <h3 className="font-display text-[24px] md:text-[26px] text-ink-900 leading-[1.2] mb-5">
                What you kept
              </h3>
              <p className="text-[16px] text-ink-600 leading-[1.8]">
                The things you persisted in despite low attention. The parts of
                yourself that didn&apos;t need encouragement. These may be the
                clearest trace of your own agency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="content-column px-6">
          <div className="trust-panel text-center relative overflow-hidden">
            {/* Soft background motif */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-[0.06] pointer-events-none">
              <Image
                src="/selftrace-7.png"
                alt=""
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>

            <div className="relative z-10">
              <div className="w-10 h-10 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-sage-600">
                  <path d="M10 2a5 5 0 0 0-5 5v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v3H7V7z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="font-display text-[26px] md:text-[30px] text-ink-900 leading-[1.2] mb-5">
                Your data never leaves your browser
              </h3>
              <p className="text-[17px] text-ink-500 leading-[1.8] max-w-lg mx-auto mb-2">
                There is no server, no account, and no way for anyone — including
                us — to see what you upload. Everything runs locally.
              </p>
              <Link href="/how-it-works" className="text-link inline-block mt-4 text-[14px]">
                How it works &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Invitation ───────────────────────────────────── */}
      <section className="py-28 md:py-36">
        <div className="content-column px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Image accent */}
            <div className="hidden md:block md:col-span-4">
              <div className="relative aspect-square rounded-full overflow-hidden opacity-60">
                <Image
                  src="/selftrace-5.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            </div>

            {/* CTA content */}
            <div className="md:col-span-8 lg:col-span-6 lg:col-start-6 text-center md:text-left">
              <h2 className="font-display text-[30px] md:text-[38px] text-ink-900 leading-[1.15] mb-6">
                It takes a few minutes.
              </h2>
              <p className="text-[19px] text-ink-500 leading-[1.7] mb-10 max-w-md mx-auto md:mx-0">
                You might notice something you hadn&apos;t seen before.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Link href="/start" className="btn-primary">
                  Begin
                </Link>
                <Link href="/start?demo=true" className="btn-secondary">
                  Try with a fictional profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

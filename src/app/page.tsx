import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { HeroInteractive } from '@/components/landing/HeroInteractive';

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-column px-6 pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-28 lg:pb-28">
        {/* Tagline */}
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-8 animate-fade-up">
          Memory &middot; Identity &middot; Drift
        </p>

        {/* Headline — narrow for impact */}
        <h1 className="font-display text-[34px] sm:text-[44px] md:text-[52px] lg:text-[58px] text-ink-900 leading-[1.06] tracking-[-0.02em] max-w-3xl mb-6 animate-fade-up animation-delay-100">
          Trace how social media shaped the person you became online.
        </h1>

        {/* Supporting text */}
        <p className="text-[17px] md:text-[19px] text-ink-500 leading-[1.7] max-w-xl mb-10 animate-fade-up animation-delay-200">
          Connect your accounts or try a demo profile to explore recurring themes, rewarded traits, and identity shifts.
        </p>

        {/* CTA hierarchy */}
        <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up animation-delay-300">
          <Link href="/start" className="btn-primary">
            Connect your social media
          </Link>
          <Link href="/start?demo=true" className="btn-secondary">
            Try demo
          </Link>
        </div>

        {/* Privacy + tertiary link */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-5 animate-fade-up animation-delay-400">
          <span className="font-sans text-[13px] text-ink-400 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-ink-400 shrink-0">
              <path d="M10 2a5 5 0 0 0-5 5v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v3H7V7z" fill="currentColor"/>
            </svg>
            Private by design. Your data stays in your browser.
          </span>
          <Link href="#how" className="btn-tertiary">
            How it works &darr;
          </Link>
        </div>

        {/* Interactive section */}
        <HeroInteractive />
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="how" className="py-20 md:py-28 border-t border-linen-200">
        <div className="content-column px-6">
          <ScrollReveal>
            <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-14 text-center">
              How it works
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            <ScrollReveal delay={0}>
              <div className="text-center md:text-left">
                <span className="font-display text-[36px] text-ink-300 leading-none block mb-4">1</span>
                <h3 className="font-sans text-[17px] font-semibold text-ink-900 mb-3">
                  Connect or upload
                </h3>
                <p className="text-[15px] text-ink-500 leading-[1.75]">
                  Bring in your social media data, or begin with a fictional profile.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="text-center md:text-left">
                <span className="font-display text-[36px] text-ink-300 leading-none block mb-4">2</span>
                <h3 className="font-sans text-[17px] font-semibold text-ink-900 mb-3">
                  Trace recurring patterns
                </h3>
                <p className="text-[15px] text-ink-500 leading-[1.75]">
                  See which themes, behaviours, and signals keep resurfacing across your online expression.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center md:text-left">
                <span className="font-display text-[36px] text-ink-300 leading-none block mb-4">3</span>
                <h3 className="font-sans text-[17px] font-semibold text-ink-900 mb-3">
                  Explore your narrative shifts
                </h3>
                <p className="text-[15px] text-ink-500 leading-[1.75]">
                  Understand what your environment rewarded, what changed, and what remained constant.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Result Preview ───────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="content-column px-6">
          <ScrollReveal>
            <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-6 text-center">
              What you&apos;ll see
            </p>
            <p className="text-[16px] md:text-[17px] text-ink-500 leading-[1.75] max-w-md mx-auto text-center mb-12">
              A structured reading of your online self — patterns you can see are patterns you can choose.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="max-w-lg mx-auto">
              <div className="card p-8 md:p-10">
                <div className="space-y-5">
                  {[
                    { label: 'Dominant theme', value: 'self-discipline', accent: 'bg-umber-600' },
                    { label: 'Rewarded trait', value: 'vulnerability', accent: 'bg-trace-500' },
                    { label: 'Stable core', value: 'ambition', accent: 'bg-sage-600' },
                    { label: 'Narrative shift', value: 'certainty → openness', accent: 'bg-umber-600' },
                    { label: 'Emotional pattern', value: 'reflective persistence', accent: 'bg-trace-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-baseline justify-between gap-6 pb-4 border-b border-linen-200 last:border-0 last:pb-0">
                      <span className="font-sans text-[13px] text-ink-400 shrink-0 flex items-center gap-2">
                        <span className={`inline-block w-[6px] h-[6px] rounded-full ${item.accent}`} />
                        {item.label}
                      </span>
                      <span className="font-display text-[15px] md:text-[16px] text-ink-900 text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-[12px] text-ink-400 mt-6 text-center italic">
                  Fictional sample — your results will reflect your own data.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What It Shows ────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-linen-200">
        <div className="hero-column px-6">
          <ScrollReveal>
            <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-14 text-center">
              Three dimensions of self-trace
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
            {/* Card 1: What keeps resurfacing */}
            <ScrollReveal delay={0}>
              <div className="insight-panel insight-panel-warm h-full">
                <p className="font-sans text-[11px] text-umber-600 tracking-[0.2em] uppercase mb-5">
                  Resurfacing
                </p>
                <h3 className="font-display text-[22px] md:text-[24px] text-ink-900 leading-[1.2] mb-5">
                  What keeps coming back
                </h3>
                <p className="text-[15px] md:text-[16px] text-ink-600 leading-[1.8]">
                  Which phrases, themes, and framings you return to — and whether
                  they look the same each time they come back.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 2: What the environment rewarded */}
            <ScrollReveal delay={100}>
              <div className="insight-panel h-full">
                <p className="font-sans text-[11px] text-trace-600 tracking-[0.2em] uppercase mb-5">
                  Reinforcement
                </p>
                <h3 className="font-display text-[22px] md:text-[24px] text-ink-900 leading-[1.2] mb-5">
                  What the environment rewarded
                </h3>
                <p className="text-[15px] md:text-[16px] text-ink-600 leading-[1.8]">
                  Which kinds of expression got more response — and whether those
                  same patterns became more frequent over time.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 3: What you kept */}
            <ScrollReveal delay={200}>
              <div className="insight-panel insight-panel-sage h-full">
                <p className="font-sans text-[11px] text-sage-600 tracking-[0.2em] uppercase mb-5">
                  Agency
                </p>
                <h3 className="font-display text-[22px] md:text-[24px] text-ink-900 leading-[1.2] mb-5">
                  What you kept
                </h3>
                <p className="text-[15px] md:text-[16px] text-ink-600 leading-[1.8]">
                  The things you persisted in despite low attention. The parts of
                  yourself that didn&apos;t need encouragement. These may be the
                  clearest trace of your own agency.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── The Observation ──────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="hero-column px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Narrow side accent */}
            <div className="hidden lg:block lg:col-span-4">
              <ScrollReveal>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/selftrace-3.png"
                    alt=""
                    fill
                    className="object-cover opacity-60"
                    sizes="340px"
                  />
                  {/* Bottom fade */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, var(--color-linen-50) 0%, transparent 30%)'
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Main text */}
            <div className="lg:col-span-7 lg:col-start-6">
              <ScrollReveal>
                <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-8">
                  The quiet process
                </p>
              </ScrollReveal>
              <div className="prose-body space-y-0">
                <ScrollReveal delay={80}>
                  <p className="text-[18px] md:text-[19px] text-ink-700 leading-[1.85] mb-6">
                    Every platform you post on has a quiet influence — rewarding some
                    things, ignoring others, surfacing certain patterns back to you.
                    Over time, that shapes which version of yourself becomes easiest
                    to inhabit.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={160}>
                  <p className="text-[18px] md:text-[19px] text-ink-700 leading-[1.85] mb-6">
                    Memory is not perfectly retrieved; it&apos;s reassembled. Identity is not
                    statically stored; it&apos;s narratively maintained. In digital environments,
                    that reconstruction process now has computational participants inside it.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={240}>
                  <p className="text-[17px] text-ink-500 leading-[1.85]">
                    SelfTrace helps you see how. Not to alarm you. Not to tell you
                    what to fix. To give you visibility into a process that has been
                    happening quietly, so you can decide what it means for yourself.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="content-column px-6">
          <ScrollReveal>
            <div className="trust-panel text-center relative overflow-hidden">
              {/* Soft background motif */}
              <div className="absolute -right-16 -bottom-16 w-56 h-56 md:w-72 md:h-72 opacity-[0.05] pointer-events-none">
                <Image
                  src="/selftrace-7.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>

              <div className="relative z-10">
                <div className="w-11 h-11 mx-auto mb-7 rounded-full bg-sage-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-sage-600">
                    <path d="M10 2a5 5 0 0 0-5 5v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v3H7V7z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="font-display text-[24px] md:text-[28px] text-ink-900 leading-[1.2] mb-5">
                  Your data never leaves your browser
                </h3>
                <p className="text-[16px] md:text-[17px] text-ink-500 leading-[1.8] max-w-md mx-auto">
                  There is no server, no account, and no way for anyone — including
                  us — to see what you upload. Everything runs locally.
                </p>
                <Link href="/how-it-works" className="text-link inline-block mt-5 text-[14px]">
                  How it works &rarr;
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Invitation ───────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="content-column px-6">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Image accent */}
              <div className="hidden lg:flex lg:col-span-4 justify-center">
                <div className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden opacity-50">
                  <Image
                    src="/selftrace-5.png"
                    alt=""
                    fill
                    className="object-cover scale-110"
                    sizes="256px"
                  />
                </div>
              </div>

              {/* CTA content */}
              <div className="lg:col-span-7 lg:col-start-6 text-center lg:text-left">
                <h2 className="font-display text-[28px] md:text-[34px] lg:text-[38px] text-ink-900 leading-[1.12] mb-5">
                  It takes a few minutes.
                </h2>
                <p className="text-[18px] md:text-[19px] text-ink-500 leading-[1.7] mb-10 max-w-md mx-auto lg:mx-0">
                  You might notice something you hadn&apos;t seen before.
                </p>
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                  <Link href="/start" className="btn-primary">
                    Connect your social media
                  </Link>
                  <Link href="/start?demo=true" className="btn-secondary">
                    Try demo
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Govern the Human Project ─────────────────────── */}
      <section className="py-20 md:py-28 border-t border-linen-200">
        <div className="content-column px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-4">
                Part of
              </p>
              <h2 className="font-display text-[24px] md:text-[28px] text-ink-900 leading-[1.2] mb-4">
                The Govern the Human Project
              </h2>
              <p className="text-[16px] md:text-[17px] text-ink-500 leading-[1.75] max-w-lg mx-auto">
                SelfTrace is one experiment within a broader inquiry into how
                AI systems shape human identity, agency, and self-understanding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Govern the Human card */}
              <a
                href="https://govern-the-human.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block card card-hover overflow-hidden"
              >
                <div className="relative aspect-[1.91/1] overflow-hidden">
                  <Image
                    src="/govern-the-human-og.png"
                    alt="Govern the Human"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="font-sans text-[14px] font-medium text-ink-900 mb-1">
                    Govern the Human
                  </p>
                  <p className="text-[13px] text-ink-400 leading-[1.5]">
                    The parent project exploring AI governance from the human side.
                  </p>
                </div>
              </a>

              {/* Risa Koyanagi card */}
              <a
                href="https://risakoyanagi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block card card-hover overflow-hidden"
              >
                <div className="relative aspect-[1.91/1] overflow-hidden">
                  <Image
                    src="/risa-koyanagi-og.png"
                    alt="Risa Koyanagi"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="font-sans text-[14px] font-medium text-ink-900 mb-1">
                    Risa Koyanagi
                  </p>
                  <p className="text-[13px] text-ink-400 leading-[1.5]">
                    Creator of SelfTrace and the Govern the Human project.
                  </p>
                </div>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

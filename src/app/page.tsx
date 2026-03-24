import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* ── The Premise ──────────────────────────────────── */}
      <section className="reading-column px-6 pt-36 pb-28">
        <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight text-ink-900 leading-[1.15] max-w-lg">
          You&apos;ve been becoming yourself online for years.
          Do you know which parts were yours?
        </h1>
      </section>

      {/* ── The Observation ──────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="reading-column px-6 prose-body">
          <p className="text-[18px] text-ink-700 leading-[1.85]">
            Every platform you post on has a quiet influence — rewarding some
            things, ignoring others, surfacing certain patterns back to you.
            Over time, that shapes which version of yourself becomes easiest
            to inhabit.
          </p>
          <p className="text-[18px] text-ink-700 leading-[1.85]">
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
      </section>

      {/* ── What It Shows ────────────────────────────────── */}
      <section className="py-24">
        <div className="reading-column px-6 space-y-12">
          <div>
            <p className="font-sans text-[13px] text-ink-400 mb-3">What keeps resurfacing</p>
            <p className="text-[17px] text-ink-700 leading-[1.8]">
              Which phrases, themes, and framings you return to — and whether
              they look the same each time they come back.
            </p>
          </div>
          <div>
            <p className="font-sans text-[13px] text-ink-400 mb-3">What the environment rewarded</p>
            <p className="text-[17px] text-ink-700 leading-[1.8]">
              Which kinds of expression got more response — and whether those
              same patterns became more frequent over time.
            </p>
          </div>
          <div>
            <p className="font-sans text-[13px] text-ink-400 mb-3">What you kept</p>
            <p className="text-[17px] text-ink-700 leading-[1.8]">
              The things you persisted in despite low attention. The parts of
              yourself that didn&apos;t need encouragement. These may be the
              clearest trace of your own agency.
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="narrow-column px-6 text-center">
          <p className="text-[17px] text-ink-500 leading-relaxed">
            Your data stays in your browser. There is no server, no account,
            and no way for anyone — including us — to see what you upload.
          </p>
          <Link href="/how-it-works" className="text-link inline-block mt-4 text-[14px]">
            How it works &rarr;
          </Link>
        </div>
      </section>

      {/* ── Invitation ───────────────────────────────────── */}
      <section className="py-28">
        <div className="narrow-column px-6 text-center">
          <p className="text-[20px] text-ink-700 leading-relaxed mb-10">
            It takes a few minutes. You might notice something
            you hadn&apos;t seen before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/start" className="btn-primary">
              Begin
            </Link>
            <Link href="/start?demo=true" className="btn-secondary">
              Try with a fictional profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

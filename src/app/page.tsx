import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="reading-column px-6 pt-28 pb-20">
      {/* Thesis */}
      <h1 className="text-[32px] leading-[1.35] tracking-tight text-charcoal-900">
        Algorithmic platforms shape what users see.
      </h1>
      <p className="mt-6 text-[22px] leading-[1.5] text-charcoal-700">
        They may also shape what users post, repeat, remember, and
        come to experience as their own voice.
      </p>

      <div className="mt-14 prose-body text-[16px] leading-[1.8] text-charcoal-700">
        <p>
          The Platformed Self is a reflective observatory — a research prototype
          for examining self-presentation patterns in posting history. It does
          not look inside recommendation systems. It cannot observe algorithmic
          processes directly. What it can do is surface temporal patterns in
          what a person posted over time, and invite careful interpretation of
          what those patterns might — or might not — mean.
        </p>
        <p>
          The tool traces how topics concentrate, how language recurs, how
          engagement correlates with repetition, and how self-description
          evolves across months and years of posting. It labels every finding
          by epistemic confidence: observed, inferred, speculative, or
          governance commentary. It never claims certainty about cause.
        </p>
      </div>

      {/* Does / Does Not */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-interface text-[11px] text-charcoal-400 tracking-widest uppercase mb-5">
            This tool examines
          </h2>
          <ul className="space-y-4">
            {[
              'Temporal patterns in self-presentation',
              'Correlations between engagement and content repetition',
              'Narrative drift and identity compression over time',
              'Selective memory and recirculation',
              'Platform governance as structural context',
            ].map((item) => (
              <li key={item} className="text-[15px] text-charcoal-700 leading-relaxed pl-5 border-l border-teal-200">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-interface text-[11px] text-charcoal-400 tracking-widest uppercase mb-5">
            This tool does not
          </h2>
          <ul className="space-y-4">
            {[
              'Access or reverse-engineer any recommendation algorithm',
              'Score, rank, or diagnose identity',
              'Provide optimization or engagement advice',
              'Claim causal certainty about platform influence',
              'Make judgments about authenticity or self-worth',
            ].map((item) => (
              <li key={item} className="text-[15px] text-charcoal-500 leading-relaxed pl-5 border-l border-cream-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Entry */}
      <div className="mt-20 pt-12 border-t border-cream-200">
        <p className="text-[15px] text-charcoal-500 leading-relaxed mb-6">
          You can begin by loading a synthetic demo profile — a fictional
          posting history designed to illustrate the kinds of patterns
          this tool examines.
        </p>
        <div className="space-y-3">
          <Link
            href="/import"
            className="inline-block text-[15px] text-teal-700 hover:text-teal-500 transition-colors duration-300 border-b border-teal-200 pb-0.5"
          >
            Explore with demo data
          </Link>
        </div>
        <div className="mt-6 space-y-2">
          <Link
            href="/methodology"
            className="block text-[14px] text-charcoal-400 hover:text-charcoal-700 transition-colors duration-300"
          >
            Read the methodology
          </Link>
          <Link
            href="/about"
            className="block text-[14px] text-charcoal-400 hover:text-charcoal-700 transition-colors duration-300"
          >
            About this project
          </Link>
        </div>
      </div>

      {/* Epistemic Commitment */}
      <p className="mt-20 text-[14px] italic text-charcoal-400 leading-relaxed max-w-md">
        Every claim in this tool is labeled by epistemic status. None are
        presented as certain. The user is always the final interpreter of
        their own data.
      </p>
    </div>
  );
}

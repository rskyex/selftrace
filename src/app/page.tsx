import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="reading-column px-6 pt-24 pb-16">
      {/* Thesis Statement */}
      <h1 className="text-[36px] leading-[1.3] tracking-tight text-charcoal-900">
        Algorithmic platforms shape what users see. They may also shape what
        users post, repeat, remember, and come to experience as their
        authentic voice.
      </h1>

      <p className="mt-12 text-[16px] leading-relaxed text-charcoal-700">
        The Platformed Self is an observatory for examining that possibility —
        not to produce verdicts, but to make self-presentation patterns visible
        for reflection. It analyzes posting history to surface temporal shifts,
        reinforcement correlations, and narrative patterns that may warrant
        attention.
      </p>

      {/* Does / Does Not */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-interface text-[13px] text-charcoal-500 tracking-wide uppercase mb-4">
            This tool examines
          </h2>
          <ul className="space-y-3">
            {[
              'Temporal patterns in self-presentation',
              'Correlations between engagement and content repetition',
              'Narrative identity drift over time',
              'Memory recirculation and selective remembering',
              'Platform governance as structural context',
            ].map((item) => (
              <li key={item} className="text-[15px] text-charcoal-700 leading-relaxed pl-4 border-l-2 border-teal-200">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-interface text-[13px] text-charcoal-500 tracking-wide uppercase mb-4">
            This tool does not
          </h2>
          <ul className="space-y-3">
            {[
              'Access or reverse-engineer any platform\'s algorithm',
              'Diagnose, score, or rank your online identity',
              'Provide optimization or engagement advice',
              'Claim causal certainty about platform influence',
              'Make judgments about authenticity or self-worth',
            ].map((item) => (
              <li key={item} className="text-[15px] text-charcoal-500 leading-relaxed pl-4 border-l-2 border-cream-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Entry Points */}
      <div className="mt-16 space-y-4">
        <Link
          href="/import"
          className="block text-[16px] text-teal-700 hover:text-teal-500 transition-colors duration-300"
        >
          Explore with demo data
        </Link>
        <Link
          href="/methodology"
          className="block text-[16px] text-teal-700 hover:text-teal-500 transition-colors duration-300"
        >
          Read the methodology
        </Link>
        <Link
          href="/about"
          className="block text-[16px] text-teal-700 hover:text-teal-500 transition-colors duration-300"
        >
          About this project
        </Link>
      </div>

      {/* Epistemic Commitment */}
      <p className="mt-16 text-[14px] italic text-charcoal-500 leading-relaxed">
        All claims in this tool are labeled by confidence level: observed,
        inferred, speculative, or governance commentary. None are presented
        as certain.
      </p>
    </div>
  );
}

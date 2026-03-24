import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-hero-gradient">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-column px-6 pt-28 pb-20 text-center">
        <p className="pill bg-accent-100 text-accent-700 mb-6 mx-auto">
          Private &middot; Reflective &middot; Beautiful
        </p>
        <h1 className="text-[44px] md:text-[56px] font-semibold tracking-tight text-charcoal-900 leading-[1.1] max-w-2xl mx-auto">
          See how platforms shaped your online self
        </h1>
        <p className="mt-6 text-[18px] md:text-[20px] text-charcoal-500 leading-relaxed max-w-xl mx-auto">
          SelfTrace reveals patterns in your posting history — what gets reinforced,
          what fades, and how your voice may have shifted over time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/connect"
            className="inline-flex items-center justify-center px-7 py-3 bg-accent-600 hover:bg-accent-700 text-white text-[15px] font-medium rounded-xl shadow-sm"
          >
            Connect your data
          </Link>
          <Link
            href="/connect?demo=true"
            className="inline-flex items-center justify-center px-7 py-3 bg-white hover:bg-cream-100 text-charcoal-700 text-[15px] font-medium rounded-xl border border-cream-200"
          >
            Try with demo data
          </Link>
        </div>

        <p className="mt-6 text-[13px] text-charcoal-400">
          Everything runs in your browser. Your data never leaves your device.
        </p>
      </section>

      {/* ── Preview Cards ────────────────────────────────── */}
      <section className="wide-column px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card-elevated p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 14l4-8 4 5 3-3 3 6" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">Your Online Drift</h3>
            <p className="text-[14px] text-charcoal-500 leading-relaxed">
              Watch how your topics, tone, and vocabulary have shifted across
              months and years of posting.
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="3" stroke="#D97706" strokeWidth="1.5" />
                <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">What Gets Reinforced</h3>
            <p className="text-[14px] text-charcoal-500 leading-relaxed">
              See which posts and topics earned engagement — and whether
              that shaped what you posted next.
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7 10a3 3 0 016 0" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 4v3M4 13h12" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">Self vs. Persona</h3>
            <p className="text-[14px] text-charcoal-500 leading-relaxed">
              Compare what you say you care about with what your posting
              history actually shows.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="wide-column px-6">
          <h2 className="text-[28px] font-semibold text-charcoal-900 tracking-tight text-center mb-4">
            How SelfTrace works
          </h2>
          <p className="text-[16px] text-charcoal-400 text-center max-w-lg mx-auto mb-16">
            Three steps. No account needed. No data stored.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 font-semibold text-[18px] flex items-center justify-center mx-auto mb-5">
                1
              </div>
              <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">Connect or upload</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">
                Upload an export from Twitter/X, Instagram, or LinkedIn.
                Or try a demo profile instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 font-semibold text-[18px] flex items-center justify-center mx-auto mb-5">
                2
              </div>
              <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">Describe yourself</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">
                Optionally answer a short questionnaire about what you think
                you post about and how you see yourself online.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 font-semibold text-[18px] flex items-center justify-center mx-auto mb-5">
                3
              </div>
              <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">See the patterns</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">
                Explore your drift, reinforcement patterns, identity shifts,
                and compare your self-image with your actual posting behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You&apos;ll Discover ─────────────────────────── */}
      <section className="py-24">
        <div className="wide-column px-6">
          <h2 className="text-[28px] font-semibold text-charcoal-900 tracking-tight text-center mb-16">
            What you&apos;ll discover
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Your Online Drift', desc: 'How your topics, tone, and focus have shifted over time — gradually enough that you might not have noticed.' },
              { title: 'What Gets Reinforced', desc: 'Which posts earned attention, and whether that attention correlated with what you posted more of afterward.' },
              { title: 'The Version That Performs', desc: 'How the identity you project online has crystallized around certain themes, phrases, and self-descriptions.' },
              { title: 'What You Return To', desc: 'Phrases and ideas that echo across your posting history — the refrains of your online voice.' },
              { title: 'Self vs. Rewarded Persona', desc: 'Where your stated interests and values line up with your actual posting behavior — and where they diverge.' },
              { title: 'Timeline of Change', desc: 'A visual timeline showing how your posting patterns evolved across the entire period we can see.' },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <h3 className="text-[16px] font-semibold text-charcoal-900 mb-2">{item.title}</h3>
                <p className="text-[14px] text-charcoal-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Privacy ──────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="wide-column px-6 text-center">
          <h2 className="text-[28px] font-semibold text-charcoal-900 tracking-tight mb-4">
            Your data stays yours
          </h2>
          <p className="text-[16px] text-charcoal-400 max-w-lg mx-auto mb-12">
            SelfTrace is built on a simple principle: your data should never
            leave your device.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: '🔒', label: 'Client-side only', desc: 'All analysis runs in your browser' },
              { icon: '🚫', label: 'No server', desc: 'We never receive your data' },
              { icon: '🗑️', label: 'Nothing stored', desc: 'Close the tab, it\'s gone' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <span className="text-[28px] block mb-3" aria-hidden="true">{item.icon}</span>
                <p className="text-[14px] font-semibold text-charcoal-900">{item.label}</p>
                <p className="text-[13px] text-charcoal-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credibility ──────────────────────────────────── */}
      <section className="py-24">
        <div className="reading-column px-6 text-center">
          <p className="text-[16px] text-charcoal-500 leading-relaxed max-w-md mx-auto">
            SelfTrace doesn&apos;t claim to know the &ldquo;real you.&rdquo; It doesn&apos;t
            diagnose, score, or moralize. It shows patterns in your data and
            lets you decide what they mean. Every insight is labeled by how
            confident we are in it.
          </p>
          <Link
            href="/how-it-works"
            className="inline-block mt-6 text-[14px] font-medium text-accent-600 hover:text-accent-700"
          >
            Read about our methodology &rarr;
          </Link>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-accent-50 py-20">
        <div className="reading-column px-6 text-center">
          <h2 className="text-[28px] font-semibold text-charcoal-900 tracking-tight mb-4">
            Ready to look?
          </h2>
          <p className="text-[16px] text-charcoal-400 mb-8">
            It takes two minutes. See what your posting history reveals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/connect"
              className="inline-flex items-center justify-center px-7 py-3 bg-accent-600 hover:bg-accent-700 text-white text-[15px] font-medium rounded-xl shadow-sm"
            >
              Get started
            </Link>
            <Link
              href="/connect?demo=true"
              className="inline-flex items-center justify-center px-7 py-3 bg-white hover:bg-cream-100 text-charcoal-700 text-[15px] font-medium rounded-xl border border-cream-200"
            >
              Try demo first
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

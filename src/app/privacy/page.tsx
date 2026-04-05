export default function PrivacyPage() {
  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <header className="mb-16">
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
          Privacy
        </p>
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1]">
          Your data stays yours
        </h1>
      </header>

      <div className="prose-body text-[17px] text-ink-500 leading-[1.85] mb-16">
        <p>
          All analysis runs entirely in your browser. Your posting data is
          processed locally and exists only in memory &mdash; when you close the tab,
          it&apos;s gone. If you connect a social account, only the authentication
          handshake passes through our server; your content is never stored on it.
        </p>
      </div>

      {/* Architecture */}
      <div className="observation text-center py-8 mb-16">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-6 font-sans text-[15px] text-ink-700">
          <div className="card px-6 py-3 font-medium">Your Browser</div>
          <span className="text-[20px] text-ink-300" aria-hidden="true">&harr;</span>
          <div className="card px-6 py-3 font-medium">Your Data</div>
          <span className="text-[20px] text-ink-300 hidden md:inline" aria-hidden="true">&harr;</span>
          <div className="card px-6 py-3 font-medium text-ink-400">Auth only (OAuth)</div>
        </div>
        <p className="mt-6 text-[15px] text-ink-400">
          Analysis is local. Server involvement is limited to the authentication handshake when connecting accounts.
        </p>
      </div>

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
        What we don&apos;t collect
      </h2>
      <div className="space-y-2 mb-16">
        {[
          'Your posting data',
          'Analytics or usage telemetry',
          'Cookies or tracking data',
          'Your content sent to or stored on any server',
          'Anything stored after you close the tab',
          'Anything shared with any third party',
        ].map(item => (
          <p key={item} className="text-[15px] text-ink-500 pl-5 border-l-2 border-sage-200 py-1">
            {item}
          </p>
        ))}
      </div>

      <div className="observation-sage">
        <h3>Privacy is the architecture, not a feature</h3>
        <p>
          All analysis happens in your browser. The only server-side component
          is the OAuth handshake when connecting a social account &mdash; we never
          receive, store, or process your content. The source code is available
          for inspection — every claim on this page can be verified.
        </p>
      </div>
    </div>
  );
}

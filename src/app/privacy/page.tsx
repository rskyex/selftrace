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
          There is no &ldquo;trust us&rdquo; here. This tool has no server.
          Your data is processed entirely in your browser and exists only
          in memory. When you close the tab, it&apos;s gone.
        </p>
      </div>

      {/* Architecture */}
      <div className="observation text-center py-8 mb-16">
        <div className="inline-flex items-center gap-6 font-sans text-[15px] text-ink-700">
          <div className="card px-6 py-3 font-medium">Your Browser</div>
          <span className="text-[20px] text-ink-300" aria-hidden="true">&harr;</span>
          <div className="card px-6 py-3 font-medium">Your Data</div>
        </div>
        <p className="mt-6 text-[15px] text-ink-400">
          That&apos;s the entire architecture. There is nothing else.
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
          'Anything sent to any server',
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
          We didn&apos;t add privacy protections to a server-based tool. We built
          a tool that has no server to protect against. The source code is
          available for inspection — every claim on this page can be verified.
        </p>
      </div>
    </div>
  );
}

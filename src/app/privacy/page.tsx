import { PageHeader } from '@/components/shared/PageHeader';

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy"
        subtitle="How this tool handles your data."
      />

      <div className="reading-column px-6 pb-24">
        <h2 className="text-[22px] text-charcoal-900 mb-4 mt-8">
          Architecture
        </h2>
        <p className="text-[16px] text-charcoal-700 leading-relaxed mb-8">
          There is no &ldquo;trust us&rdquo; here. This tool has no server. Your
          data is processed in your browser&apos;s JavaScript runtime and exists
          only in memory. When you close the tab, it is gone. You can verify
          this by reading the source code.
        </p>

        {/* Diagram */}
        <div className="bg-cream-100 border border-cream-200 rounded-sm p-8 text-center font-interface text-[13px] text-charcoal-700 mb-12">
          <div className="inline-flex items-center gap-4">
            <div className="border border-teal-700 rounded-sm px-4 py-2">
              Your Browser
            </div>
            <span className="text-charcoal-300">↔</span>
            <div className="border border-teal-700 rounded-sm px-4 py-2">
              Your Data (in memory)
            </div>
          </div>
          <p className="mt-4 text-charcoal-500 text-[11px]">
            That is the entire architecture. There is nothing else.
          </p>
        </div>

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          What We Do Not Collect
        </h2>
        <ul className="space-y-2 mb-12">
          {[
            'We do not collect your posting data.',
            'We do not collect analytics or usage telemetry.',
            'We do not use cookies or local storage for tracking.',
            'We do not send any data to any server.',
            'We do not use third-party analytics services.',
            'We do not store anything after you close the tab.',
            'We do not share any data with any third party.',
          ].map((item) => (
            <li key={item} className="text-[14px] text-charcoal-700 leading-relaxed pl-4 border-l-2 border-teal-200">
              {item}
            </li>
          ))}
        </ul>

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Third-Party Services
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed mb-8">
          This tool loads web fonts and static assets from CDN services as part
          of the standard Next.js build. No user data is transmitted to these
          services. No third-party JavaScript is loaded that has access to your
          data.
        </p>

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Source Code
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed">
          The source code for this tool is available for inspection. Every
          claim made on this page can be verified by reading the code. If you
          find a discrepancy between what this page says and what the code does,
          please report it.
        </p>
      </div>
    </div>
  );
}

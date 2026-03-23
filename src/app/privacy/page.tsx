import { PageHeader } from '@/components/shared/PageHeader';
import { SectionDivider } from '@/components/shared/SectionDivider';

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy"
        subtitle="How this tool handles data. The short answer: it doesn't leave your browser."
      />

      <div className="reading-column px-6 pb-24">
        <h2 className="text-[22px] text-charcoal-900 mb-4 mt-8">
          Architecture
        </h2>
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8] mb-10">
          <p>
            There is no &ldquo;trust us&rdquo; here. This tool has no server.
            Your data is processed in your browser&apos;s JavaScript runtime
            and exists only in memory. When you close the tab, it is gone.
            You can verify this by reading the source code.
          </p>
        </div>

        {/* Diagram */}
        <div className="border border-cream-200 rounded-sm py-8 px-6 text-center font-interface mb-12">
          <div className="inline-flex items-center gap-5 text-[12px] text-charcoal-700">
            <div className="border border-charcoal-300 rounded-sm px-5 py-2.5">
              Your Browser
            </div>
            <span className="text-charcoal-300">↔</span>
            <div className="border border-charcoal-300 rounded-sm px-5 py-2.5">
              Your Data
            </div>
          </div>
          <p className="mt-5 text-charcoal-400 text-[11px] tracking-wide">
            That is the entire architecture. There is nothing else.
          </p>
        </div>

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          What We Do Not Collect
        </h2>
        <ul className="space-y-2.5 mb-12">
          {[
            'We do not collect your posting data.',
            'We do not collect analytics or usage telemetry.',
            'We do not use cookies or local storage for tracking.',
            'We do not send any data to any server.',
            'We do not use third-party analytics services.',
            'We do not store anything after you close the tab.',
            'We do not share any information with any third party.',
          ].map((item) => (
            <li key={item} className="text-[14px] text-charcoal-700 leading-relaxed pl-5 border-l border-teal-200">
              {item}
            </li>
          ))}
        </ul>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Third-Party Services
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed mb-8">
          This tool loads static assets as part of the standard Next.js build
          process. No user data is transmitted to any external service. No
          third-party JavaScript with access to your data is loaded.
        </p>

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Source Code
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed">
          The source code for this tool is available for inspection. Every
          claim made on this page can be verified by reading the code. If you
          find a discrepancy between what this page says and what the code
          does, please report it.
        </p>
      </div>
    </div>
  );
}

import { PageHeader } from '@/components/shared/PageHeader';

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy"
        subtitle="Your data never leaves your browser. Here's exactly how that works."
      />

      <div className="wide-column px-6 pb-24">
        {/* Architecture */}
        <div className="card-elevated p-8 mb-12 text-center">
          <div className="inline-flex items-center gap-6 text-[14px] text-charcoal-700">
            <div className="card p-4 px-8 font-medium">
              Your Browser
            </div>
            <span className="text-[20px] text-charcoal-300" aria-hidden="true">&harr;</span>
            <div className="card p-4 px-8 font-medium">
              Your Data
            </div>
          </div>
          <p className="mt-6 text-[14px] text-charcoal-400">
            That&apos;s the entire architecture. There is no server, no database,
            no backend.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-[20px] font-semibold text-charcoal-900 mb-4">
              What we don&apos;t collect
            </h2>
            <div className="space-y-2">
              {[
                'Your posting data',
                'Analytics or usage telemetry',
                'Cookies or local storage tracking',
                'Data sent to any server',
                'Third-party analytics',
                'Anything after you close the tab',
                'Information shared with any third party',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2 border-b border-cream-100">
                  <span className="inline-block w-5 h-5 rounded-full bg-sage-100 text-sage-700 text-[11px] font-bold flex items-center justify-center" aria-hidden="true">
                    &times;
                  </span>
                  <span className="text-[14px] text-charcoal-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-charcoal-900 mb-4">
              How it works technically
            </h2>
            <div className="space-y-4 text-[14px] text-charcoal-600 leading-relaxed">
              <p>
                SelfTrace is a static web application. When you upload or
                paste your data, it&apos;s processed entirely in your browser&apos;s
                JavaScript runtime.
              </p>
              <p>
                Data exists only in memory. Nothing is written to disk,
                local storage, or cookies. When you close the tab, your
                data is garbage collected.
              </p>
              <p>
                No third-party JavaScript with access to your data is loaded.
                The source code is available for inspection — every claim on
                this page can be verified.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-sage-100/30 border-sage-200 text-center">
          <p className="text-[16px] font-medium text-charcoal-900 mb-2">
            Privacy isn&apos;t a feature. It&apos;s the architecture.
          </p>
          <p className="text-[14px] text-charcoal-400">
            We didn&apos;t add privacy protections to a server-based tool. We
            built a tool that has no server to protect against.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ImportPage() {
  const { isLoaded, activeProfile } = useData();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Data Import"
        subtitle="Load a demo profile to explore the analytical framework."
      />

      <div className="reading-column px-6 pb-24">
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8] mt-4 mb-10">
          <p>
            In this prototype, analysis runs on synthetic demo data. In a
            future version, you will be able to import your own posting
            archive. Select a profile below to begin.
          </p>
        </div>

        {/* Privacy assurance */}
        <div className="border-l border-teal-200 pl-5 mb-12">
          <p className="text-[14px] text-charcoal-500 leading-relaxed">
            All processing happens in your browser. Nothing is uploaded to
            any server. Nothing persists after you close this tab. There is
            no backend, no database, no analytics telemetry.
          </p>
        </div>

        <ProfileSwitcher />

        {isLoaded && activeProfile && (
          <div className="mt-10 pt-8 border-t border-cream-200 space-y-4">
            <p className="font-interface text-[11px] text-charcoal-400 tracking-widest uppercase mb-4">
              Continue with: {activeProfile.label}
            </p>
            <button
              onClick={() => router.push('/baseline')}
              className="block w-full text-left py-3 border-b border-cream-200 hover:border-charcoal-300 transition-colors duration-300"
            >
              <span className="text-[15px] text-teal-700">View baseline summary</span>
              <span className="block text-[13px] text-charcoal-400 mt-0.5">
                Factual overview of the dataset before analysis.
              </span>
            </button>
            <button
              onClick={() => router.push('/timeline')}
              className="block w-full text-left py-3 border-b border-cream-200 hover:border-charcoal-300 transition-colors duration-300"
            >
              <span className="text-[15px] text-charcoal-700">Go to timeline analysis</span>
              <span className="block text-[13px] text-charcoal-400 mt-0.5">
                Examine temporal self-presentation patterns.
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

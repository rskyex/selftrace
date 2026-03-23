'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ImportPage() {
  const { isLoaded } = useData();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Data Import"
        subtitle="Load a demo profile to explore how self-presentation patterns can be examined. In a future version, you will be able to import your own posting archive."
      />

      <div className="reading-column px-6 pb-24">
        {/* Privacy assurance */}
        <div className="border-l-[3px] border-teal-200 bg-teal-100 pl-6 pr-6 py-4 mb-8">
          <p className="text-[14px] text-charcoal-700 leading-relaxed">
            Your data stays in your browser. Nothing is uploaded to any server.
            Nothing is stored after you close this tab. This tool performs all
            analysis locally using client-side JavaScript. There is no backend,
            no database, and no analytics telemetry.
          </p>
        </div>

        <ProfileSwitcher />

        {isLoaded && (
          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push('/baseline')}
              className="block w-full text-left p-4 border border-teal-700 rounded-sm bg-cream-50 hover:bg-teal-100 transition-colors duration-300"
            >
              <span className="text-[15px] text-teal-700">View baseline summary</span>
              <span className="block font-interface text-[12px] text-charcoal-500 mt-1">
                See a factual overview of the loaded dataset before analysis.
              </span>
            </button>
            <button
              onClick={() => router.push('/timeline')}
              className="block w-full text-left p-4 border border-cream-200 rounded-sm bg-cream-50 hover:bg-cream-100 transition-colors duration-300"
            >
              <span className="text-[15px] text-charcoal-700">Go directly to timeline analysis</span>
              <span className="block font-interface text-[12px] text-charcoal-500 mt-1">
                Begin examining temporal self-presentation patterns.
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

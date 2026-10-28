'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

function ConnectInner() {
  const { isLoaded, activeProfile, loadProfile } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-load first demo if ?demo=true
  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !isLoaded) {
      loadProfile('demo-intellectual');
    }
  }, [searchParams, isLoaded, loadProfile]);

  return (
    <div>
      <PageHeader
        title="Connect your data"
        subtitle="Try a demo profile to see the patterns SelfTrace looks for."
      />

      <div className="wide-column px-6 pb-24">
        {/* Upload section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <h2 className="font-display text-[20px] text-ink-900 mb-3">
              Import an export file
            </h2>
            <p className="text-[14px] text-ink-500 leading-relaxed">
              Importing a data export from Twitter/X, Instagram or LinkedIn is not
              available yet. For now, SelfTrace runs on the fictional demo profiles.
            </p>
          </div>

          <div className="card p-8 bg-accent-50 border-accent-200">
            <h2 className="font-display text-[20px] text-ink-900 mb-3">
              Try with demo data
            </h2>
            <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
              Explore SelfTrace using fictional profiles that illustrate
              different posting patterns. No account needed.
            </p>
            <ProfileSwitcher />
          </div>
        </div>

        {/* Continue buttons */}
        {isLoaded && activeProfile && (
          <div className="card p-6 mb-12">
            <p className="text-[14px] text-ink-500 mb-4">
              <span className="font-medium text-ink-900">{activeProfile.label}</span> is loaded
              &middot; {activeProfile.dataQuality.totalPosts} posts
              &middot; {activeProfile.platform}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/overview')}
                className="px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white text-[14px] font-medium rounded-lg"
              >
                View overview
              </button>
              <button
                onClick={() => router.push('/drift')}
                className="px-5 py-2.5 bg-white hover:bg-linen-100 text-ink-700 text-[14px] font-medium rounded-lg border border-linen-200"
              >
                Jump to drift analysis
              </button>
            </div>
          </div>
        )}

        {/* Baseline questionnaire preview */}
        <div className="card p-8">
          <h2 className="font-display text-[20px] text-ink-900 mb-3">
            Optional: Describe yourself
          </h2>
          <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
            Answer a few questions about how you see your online self. This
            lets SelfTrace compare your self-perception with what your
            posting history actually shows.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="self-topics" className="block text-[13px] font-medium text-ink-700 mb-1.5">
                What topics do you think you post about most?
              </label>
              <input
                id="self-topics"
                type="text"
                placeholder="e.g., technology, cooking, politics, music..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label htmlFor="self-voice" className="block text-[13px] font-medium text-ink-700 mb-1.5">
                How would you describe your online voice?
              </label>
              <input
                id="self-voice"
                type="text"
                placeholder="e.g., casual, analytical, passionate, measured..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label htmlFor="self-value" className="block text-[13px] font-medium text-ink-700 mb-1.5">
                What do you value most about the way you present yourself online?
              </label>
              <input
                id="self-value"
                type="text"
                placeholder="e.g., authenticity, expertise, humor, community..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>
          <p className="mt-4 text-[12px] text-ink-300">
            These answers are not saved or sent anywhere, and this version does
            not use them in the analysis yet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={null}>
      <ConnectInner />
    </Suspense>
  );
}

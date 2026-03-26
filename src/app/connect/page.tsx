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
        subtitle="Upload an export or try a demo profile to see your patterns."
      />

      <div className="wide-column px-6 pb-24">
        {/* Upload section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <h2 className="font-display text-[20px] text-ink-900 mb-3">
              Upload an export
            </h2>
            <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
              Upload your data export from Twitter/X, Instagram, or LinkedIn.
              Everything is processed locally — your data never leaves this device.
            </p>
            <div className="border-2 border-dashed border-linen-300 rounded-xl p-8 text-center">
              <p className="text-[14px] text-ink-400 mb-2">
                Drag and drop your export file here
              </p>
              <p className="text-[12px] text-ink-300">
                .json or .zip &middot; Twitter/X, Instagram, LinkedIn
              </p>
              <button className="mt-4 text-[13px] font-medium text-accent-600 hover:text-accent-700 px-4 py-2 border border-accent-200 rounded-lg">
                Browse files
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-block w-2 h-2 rounded-full bg-sage-500" aria-hidden="true" />
              <span className="text-[12px] text-ink-400">100% local processing — zero data transmission</span>
            </div>
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
          <div className="card-elevated p-6 mb-12">
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
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">
                What topics do you think you post about most?
              </label>
              <input
                type="text"
                placeholder="e.g., technology, cooking, politics, music..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">
                How would you describe your online voice?
              </label>
              <input
                type="text"
                placeholder="e.g., casual, analytical, passionate, measured..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">
                What do you value most about the way you present yourself online?
              </label>
              <input
                type="text"
                placeholder="e.g., authenticity, expertise, humor, community..."
                className="w-full px-4 py-2.5 text-[14px] border border-linen-200 rounded-lg bg-white placeholder:text-ink-300 focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>
          <p className="mt-4 text-[12px] text-ink-300">
            These answers are stored only in your browser session and are used
            solely for the self-vs-persona comparison.
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

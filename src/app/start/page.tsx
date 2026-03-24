'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import type { SelfPortrait } from '@/lib/data/context';

function StartInner() {
  const { isLoaded, loadProfile, setSelfPortrait } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'portrait' | 'data' | 'ready'>('portrait');
  const [portrait, setPortrait] = useState<SelfPortrait>({
    topics: '', voice: '', values: '', driftedFrom: '',
  });

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadProfile('demo-intellectual');
      setStep('portrait');
    }
  }, [searchParams, loadProfile]);

  const handlePortraitDone = () => {
    if (portrait.topics || portrait.voice || portrait.values) {
      setSelfPortrait(portrait);
    }
    setStep(isLoaded ? 'ready' : 'data');
  };

  const handleDataLoaded = () => {
    setStep('ready');
  };

  return (
    <div className="reading-column px-6 pt-20 pb-24">
      {/* ── Step 1: Self-portrait ───────────────── */}
      {step === 'portrait' && (
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-3">
            Before we look at your data&hellip;
          </h1>
          <p className="text-[17px] text-ink-500 leading-relaxed mb-10">
            Tell us a little about how you see yourself online. There are
            no right answers. This is just so we can show you where your
            self-image and your actual patterns might differ.
          </p>

          <div className="space-y-8">
            <div>
              <label className="block font-sans text-[15px] font-medium text-ink-700 mb-2">
                What do you think you mostly post about?
              </label>
              <input
                type="text"
                value={portrait.topics}
                onChange={e => setPortrait({ ...portrait, topics: e.target.value })}
                placeholder="e.g. cooking, politics, parenting, tech, music…"
                className="w-full px-4 py-3 text-[16px] border border-warm-200 rounded-xl bg-white placeholder:text-ink-300 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block font-sans text-[15px] font-medium text-ink-700 mb-2">
                How would you describe your online voice?
              </label>
              <input
                type="text"
                value={portrait.voice}
                onChange={e => setPortrait({ ...portrait, voice: e.target.value })}
                placeholder="e.g. funny, thoughtful, ranty, careful, passionate…"
                className="w-full px-4 py-3 text-[16px] border border-warm-200 rounded-xl bg-white placeholder:text-ink-300 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block font-sans text-[15px] font-medium text-ink-700 mb-2">
                What matters most to you about how you come across?
              </label>
              <input
                type="text"
                value={portrait.values}
                onChange={e => setPortrait({ ...portrait, values: e.target.value })}
                placeholder="e.g. being honest, being helpful, being funny, expertise…"
                className="w-full px-4 py-3 text-[16px] border border-warm-200 rounded-xl bg-white placeholder:text-ink-300 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block font-sans text-[15px] font-medium text-ink-700 mb-2">
                Is there anything you used to post about but drifted away from?
              </label>
              <input
                type="text"
                value={portrait.driftedFrom}
                onChange={e => setPortrait({ ...portrait, driftedFrom: e.target.value })}
                placeholder="e.g. photography, personal stuff, local news…"
                className="w-full px-4 py-3 text-[16px] border border-warm-200 rounded-xl bg-white placeholder:text-ink-300 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={handlePortraitDone}
              className="font-sans px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-[15px] font-medium rounded-xl"
            >
              {portrait.topics || portrait.voice ? 'Continue' : 'Skip this step'}
            </button>
            <p className="font-sans text-[13px] text-ink-300">
              You can skip this. But the comparison is more interesting if you don&apos;t.
            </p>
          </div>
        </div>
      )}

      {/* ── Step 2: Connect data ───────────────── */}
      {step === 'data' && (
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-3">
            Now, bring your posts
          </h1>
          <p className="text-[17px] text-ink-500 leading-relaxed mb-4">
            Upload a data export, or try a demo profile to see how it works.
            Everything happens in your browser — we never see your data.
          </p>

          {/* Upload placeholder */}
          <div className="card p-8 mb-8 text-center">
            <div className="border-2 border-dashed border-warm-300 rounded-xl py-10 px-6">
              <p className="text-[16px] text-ink-400 mb-1">
                Drag your export file here
              </p>
              <p className="font-sans text-[13px] text-ink-300">
                Twitter/X, Instagram, or LinkedIn exports
              </p>
            </div>
          </div>

          <p className="font-sans text-[14px] text-ink-400 text-center mb-6">
            or try a fictional profile:
          </p>

          <ProfileSwitcher />

          {isLoaded && (
            <div className="mt-8 text-center">
              <button
                onClick={handleDataLoaded}
                className="font-sans px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-[15px] font-medium rounded-xl"
              >
                Show me my patterns
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Ready ──────────────────────── */}
      {step === 'ready' && (
        <div className="text-center pt-10">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-4">
            Ready
          </h1>
          <p className="text-[17px] text-ink-500 leading-relaxed max-w-sm mx-auto mb-10">
            We&apos;ve looked at your posting history. Here&apos;s what we noticed.
          </p>
          <button
            onClick={() => router.push('/portrait')}
            className="font-sans px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-[16px] font-medium rounded-xl shadow-sm"
          >
            See your portrait
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex justify-center gap-2 mt-16">
        {['portrait', 'data', 'ready'].map(s => (
          <div key={s} className={`w-2 h-2 rounded-full ${step === s ? 'bg-violet-500' : 'bg-warm-200'}`} />
        ))}
      </div>
    </div>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartInner />
    </Suspense>
  );
}

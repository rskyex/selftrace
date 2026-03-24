'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import type { SelfPortrait } from '@/lib/data/context';

const PROMPTS: { key: keyof SelfPortrait; question: string; context: string }[] = [
  { key: 'whatMatters', question: 'What parts of yourself matter most to you?', context: 'Not what you post about. What you carry.' },
  { key: 'returnTo', question: 'What do you think you return to most often online?', context: 'The things you find yourself writing about again and again.' },
  { key: 'mostVisible', question: 'What side of yourself feels most visible online?', context: 'The version someone would piece together from your posts.' },
  { key: 'leastVisible', question: 'What side of yourself feels least visible online?', context: 'The parts that don\u2019t tend to make it into what you publish.' },
  { key: 'hasChanged', question: 'Do you feel your online self has changed over time?', context: 'Not whether you\u2019ve grown or changed in life \u2014 whether the you that shows up online has shifted.' },
  { key: 'changedBeliefs', question: 'Are there things you believe or care about differently now than you used to?', context: 'This one is worth sitting with for a moment.' },
];

const LOADING_LINES = [
  'Reading through what you wrote.',
  'Noticing what kept coming back.',
  'Tracking how things shifted over time.',
  'Comparing what got attention with what didn\u2019t.',
  'Looking at what you kept doing anyway.',
  'Placing all of this beside what you told us about yourself.',
  'One more moment.',
];

function StartInner() {
  const { isLoaded, loadProfile, setSelfPortrait } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();

  type Step = 'data' | 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'loading';
  const [step, setStep] = useState<Step>('data');
  const [answers, setAnswers] = useState<Record<string, string>>({
    whatMatters: '', returnTo: '', mostVisible: '', leastVisible: '', hasChanged: '', changedBeliefs: '',
  });
  const [loadingLine, setLoadingLine] = useState(0);
  const [loadingFade, setLoadingFade] = useState(true);

  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !isLoaded) loadProfile('demo-intellectual');
  }, [searchParams, isLoaded, loadProfile]);

  useEffect(() => {
    if (step !== 'loading') return;
    const timer = setInterval(() => {
      setLoadingFade(false);
      setTimeout(() => {
        setLoadingLine(prev => {
          if (prev >= LOADING_LINES.length - 1) {
            clearInterval(timer);
            setTimeout(() => router.push('/results'), 1200);
            return prev;
          }
          return prev + 1;
        });
        setLoadingFade(true);
      }, 300);
    }, loadingLine === 4 ? 3200 : 2700);
    return () => clearInterval(timer);
  }, [step, loadingLine, router]);

  const goToReflection = () => setStep('q0');
  const setAnswer = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const next = (current: Step) => {
    const steps: Step[] = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'];
    const idx = steps.indexOf(current);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    } else {
      finishReflection();
    }
  };

  const finishReflection = () => {
    const hasContent = Object.values(answers).some(v => v.trim().length > 0);
    if (hasContent) {
      setSelfPortrait(answers as unknown as SelfPortrait);
    }
    setStep('loading');
  };

  // ── Data connection ───────────────────────────
  if (step === 'data') {
    return (
      <div className="reading-column px-6 pt-28 pb-24">
        <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-3">
          Let&apos;s start with your posts
        </h1>
        <p className="text-[17px] text-ink-500 leading-relaxed mb-12">
          Upload a data export, or choose a fictional profile to see how this works.
          Everything happens in your browser.
        </p>

        <div className="observation text-center py-10 mb-8">
          <div className="border-2 border-dashed border-linen-300 rounded-2xl py-10 px-6 mx-4">
            <p className="text-[16px] text-ink-400 mb-1">Drag your export file here</p>
            <p className="font-sans text-[12px] text-ink-300">Twitter/X, Instagram, or LinkedIn data export</p>
          </div>
        </div>

        <p className="font-sans text-[13px] text-ink-400 text-center mb-6">or explore with a fictional profile:</p>
        <ProfileSwitcher />

        {isLoaded && (
          <div className="mt-12 text-center">
            <button onClick={goToReflection} className="btn-primary">Continue</button>
          </div>
        )}

        <p className="font-sans text-[12px] text-ink-300 text-center mt-8">
          Your data is never sent anywhere. There is no server.
        </p>
      </div>
    );
  }

  // ── Self-reflection prompts (one at a time) ───
  if (step.startsWith('q')) {
    const qIdx = parseInt(step[1]);
    const prompt = PROMPTS[qIdx];

    return (
      <div className="narrow-column px-6 pt-36 pb-24">
        {qIdx === 0 && (
          <p className="font-sans text-[13px] text-ink-400 mb-12">
            Before we look at your data, we&apos;d like to hear from you.
          </p>
        )}

        <label className="block text-[22px] text-ink-900 leading-snug mb-4">
          {prompt.question}
        </label>
        <p className="text-[15px] text-ink-500 mb-8">
          {prompt.context}
        </p>

        <input
          type="text"
          value={answers[prompt.key]}
          onChange={e => setAnswer(prompt.key, e.target.value)}
          className="input-field mb-10"
          autoFocus
        />

        <div className="flex items-center gap-6">
          <button onClick={() => next(step)} className="text-link text-[15px]">
            Continue
          </button>
          <button onClick={() => next(step)} className="font-sans text-[13px] text-ink-300 hover:text-ink-500">
            Skip
          </button>
        </div>

        <p className="font-sans text-[12px] text-ink-300 mt-24 text-center">
          {qIdx + 1} of {PROMPTS.length}
        </p>
      </div>
    );
  }

  // ── Loading threshold ─────────────────────────
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md px-6">
        <p className={`text-[19px] text-ink-500 leading-relaxed transition-opacity duration-300 ${loadingFade ? 'opacity-100' : 'opacity-0'}`}>
          {LOADING_LINES[loadingLine]}
        </p>
      </div>
    </div>
  );
}

export default function StartPage() {
  return <Suspense fallback={null}><StartInner /></Suspense>;
}

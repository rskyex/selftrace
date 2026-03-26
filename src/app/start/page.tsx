'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import type { SelfPortrait } from '@/lib/data/context';

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const ENNEAGRAM_TYPES = [
  '1 — Reformer', '2 — Helper', '3 — Achiever',
  '4 — Individualist', '5 — Investigator', '6 — Loyalist',
  '7 — Enthusiast', '8 — Challenger', '9 — Peacemaker',
];

type Step = 'data' | 'profile' | 'reflection' | 'loading';

const REFLECTION_PROMPTS: { key: keyof SelfPortrait; question: string; context: string; type: 'text' | 'mbti' | 'enneagram' }[] = [
  { key: 'whatMatters', question: 'What parts of yourself matter most to you?', context: 'Not what you post about. What you carry.', type: 'text' },
  { key: 'returnTo', question: 'What do you think you return to most often online?', context: 'The things you find yourself writing about again and again.', type: 'text' },
  { key: 'mostVisible', question: 'What side of yourself feels most visible online?', context: 'The version someone would piece together from your posts.', type: 'text' },
  { key: 'leastVisible', question: 'What side of yourself feels least visible online?', context: 'The parts that don\u2019t tend to make it into what you publish.', type: 'text' },
  { key: 'offlineVsOnline', question: 'How would close friends describe you differently from your online presence?', context: 'The gap between how people who know you would describe you, and what your posts show.', type: 'text' },
  { key: 'hasChanged', question: 'Do you feel your online self has changed over time?', context: 'Not whether you\u2019ve grown or changed in life \u2014 whether the you that shows up online has shifted.', type: 'text' },
  { key: 'platformInfluence', question: 'What do you think platforms have changed about how you express yourself?', context: 'Have you noticed your writing, topics, or tone shifting based on what gets attention?', type: 'text' },
  { key: 'consumptionPattern', question: 'What kind of content do you find yourself consuming most?', context: 'What the algorithm serves you may shape what you produce.', type: 'text' },
  { key: 'changedBeliefs', question: 'Are there things you believe or care about differently now than you used to?', context: 'This one is worth sitting with for a moment.', type: 'text' },
];

const LOADING_LINES = [
  'Reading through what you wrote.',
  'Noticing what kept coming back.',
  'Tracking how things shifted over time.',
  'Comparing what got attention with what didn\u2019t.',
  'Looking at what you kept doing anyway.',
  'Analyzing patterns of algorithmic influence.',
  'Placing all of this beside what you told us about yourself.',
  'One more moment.',
];

function StartInner() {
  const { isLoaded, loadProfile, setSelfPortrait } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('data');
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [showPersonality, setShowPersonality] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({
    whatMatters: '', returnTo: '', mostVisible: '', leastVisible: '',
    hasChanged: '', changedBeliefs: '', platformInfluence: '',
    consumptionPattern: '', mbti: '', enneagram: '', offlineVsOnline: '',
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
    }, loadingLine === 5 ? 3200 : 2700);
    return () => clearInterval(timer);
  }, [step, loadingLine, router]);

  const setAnswer = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const goToProfile = () => setStep('profile');
  const goToReflection = () => { setStep('reflection'); setReflectionIndex(0); };

  const nextReflection = () => {
    if (reflectionIndex < REFLECTION_PROMPTS.length - 1) {
      setReflectionIndex(reflectionIndex + 1);
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
      <div className="reading-column px-6 pt-24 pb-24">
        <header className="mb-12">
          <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
            Getting started
          </p>
          <h1 className="font-display text-[28px] md:text-[34px] tracking-tight text-ink-900 leading-[1.1] mb-4">
            Let&apos;s start with your posts
          </h1>
          <p className="text-[17px] text-ink-500 leading-[1.7]">
            Upload a data export, or choose a fictional profile to see how this works.
            Everything happens in your browser.
          </p>
        </header>

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
            <button onClick={goToProfile} className="btn-primary">Continue</button>
          </div>
        )}

        <p className="font-sans text-[12px] text-ink-300 text-center mt-10">
          Your data is never sent anywhere. There is no server.
        </p>
      </div>
    );
  }

  // ── Self-profile (personality types) ──────────
  if (step === 'profile') {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <header className="mb-12">
          <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
            Self-profile
          </p>
          <h1 className="font-display text-[28px] md:text-[34px] tracking-tight text-ink-900 leading-[1.1] mb-4">
            Tell us a little about yourself
          </h1>
          <p className="text-[17px] text-ink-500 leading-[1.7]">
            This helps us compare your self-understanding with what the traces show.
            Everything here is optional.
          </p>
        </header>

        {/* MBTI */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-sans text-[14px] font-medium text-ink-700">MBTI type</p>
              <p className="text-[14px] text-ink-400 leading-[1.5]">If you know yours, we&apos;ll compare it with your posting patterns.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setAnswer('mbti', answers.mbti === type ? '' : type)}
                className={`py-2.5 px-3 rounded-xl font-sans text-[13px] font-medium transition-all ${
                  answers.mbti === type
                    ? 'bg-ink-900 text-linen-50'
                    : 'bg-linen-100 text-ink-500 hover:bg-linen-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Enneagram */}
        <div className="mb-10">
          <div className="mb-4">
            <p className="font-sans text-[14px] font-medium text-ink-700">Enneagram type</p>
            <p className="text-[14px] text-ink-400 leading-[1.5]">Optional. Adds depth to the self-analysis.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ENNEAGRAM_TYPES.map(type => {
              const num = type.split(' ')[0];
              return (
                <button
                  key={type}
                  onClick={() => setAnswer('enneagram', answers.enneagram === num ? '' : num)}
                  className={`py-2.5 px-3 rounded-xl font-sans text-[12px] font-medium text-left transition-all ${
                    answers.enneagram === num
                      ? 'bg-ink-900 text-linen-50'
                      : 'bg-linen-100 text-ink-500 hover:bg-linen-200'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle for more */}
        <button
          onClick={() => setShowPersonality(!showPersonality)}
          className="font-sans text-[13px] text-ink-400 hover:text-ink-600 mb-6"
        >
          {showPersonality ? 'Hide details' : 'Why personality types?'}
        </button>

        {showPersonality && (
          <div className="observation mb-10">
            <p className="text-[15px] text-ink-500 leading-[1.7]">
              Personality frameworks are imperfect, but they capture something about how you
              understand yourself. By comparing your self-identified type with the patterns
              in your posting data, we can surface interesting gaps — places where the
              platform environment may have amplified or dampened particular tendencies.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 mt-8">
          <button onClick={goToReflection} className="btn-primary">
            Continue to reflection
          </button>
          <button onClick={finishReflection} className="btn-tertiary">
            Skip reflection
          </button>
        </div>
      </div>
    );
  }

  // ── Self-reflection prompts (one at a time) ───
  if (step === 'reflection') {
    const prompt = REFLECTION_PROMPTS[reflectionIndex];

    return (
      <div className="narrow-column px-6 pt-32 pb-24">
        {reflectionIndex === 0 && (
          <p className="font-sans text-[13px] text-ink-400 mb-12 tracking-wide">
            Before we look at your data, we&apos;d like to hear from you.
          </p>
        )}

        <label className="block font-display text-[22px] md:text-[24px] text-ink-900 leading-[1.2] mb-4">
          {prompt.question}
        </label>
        <p className="text-[15px] text-ink-500 leading-[1.7] mb-8">
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
          <button onClick={nextReflection} className="text-link text-[15px]">
            Continue
          </button>
          <button onClick={nextReflection} className="font-sans text-[13px] text-ink-300 hover:text-ink-500">
            Skip
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-20 flex justify-center gap-1.5">
          {REFLECTION_PROMPTS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i <= reflectionIndex ? 'bg-umber-500' : 'bg-linen-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Loading threshold ─────────────────────────
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md px-6">
        <p className={`font-display text-[20px] text-ink-500 leading-relaxed transition-opacity duration-300 ${loadingFade ? 'opacity-100' : 'opacity-0'}`}>
          {LOADING_LINES[loadingLine]}
        </p>
      </div>
    </div>
  );
}

export default function StartPage() {
  return <Suspense fallback={null}><StartInner /></Suspense>;
}

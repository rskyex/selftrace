'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import type { SelfPortrait } from '@/lib/data/context';

const QUESTIONS = [
  { key: 'topics', label: 'What topics matter most to you?', hint: 'The things you care about, whether or not you post about them' },
  { key: 'posting', label: 'What do you think you actually post about most?', hint: 'What would someone see scrolling through your feed?' },
  { key: 'voice', label: 'How would you describe yourself online, in a few words?', hint: 'However feels right — funny, serious, opinionated, careful, loud, quiet…' },
  { key: 'wish', label: 'What side of yourself do you wish came through more?', hint: 'The parts that don\'t make it into posts as often' },
] as const;

const LOADING_LINES = [
  'Reading through your posts…',
  'Noticing some patterns…',
  'Comparing with what you told us…',
  'Almost ready.',
];

function StartInner() {
  const { isLoaded, loadProfile, setSelfPortrait } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();

  type Step = 'data' | 'q0' | 'q1' | 'q2' | 'q3' | 'online' | 'loading';
  const [step, setStep] = useState<Step>('data');
  const [answers, setAnswers] = useState({ topics: '', posting: '', voice: '', wish: '' });
  const [onlineDiff, setOnlineDiff] = useState<string | null>(null);
  const [loadingLine, setLoadingLine] = useState(0);

  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !isLoaded) loadProfile('demo-intellectual');
  }, [searchParams, isLoaded, loadProfile]);

  useEffect(() => {
    if (step !== 'loading') return;
    const timer = setInterval(() => {
      setLoadingLine(prev => {
        if (prev >= LOADING_LINES.length - 1) {
          clearInterval(timer);
          setTimeout(() => router.push('/results'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [step, router]);

  const goToQuestions = () => setStep('q0');
  const setAnswer = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const nextQuestion = (current: Step) => {
    const steps: Step[] = ['q0', 'q1', 'q2', 'q3', 'online'];
    const idx = steps.indexOf(current);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const finishSelfInput = () => {
    if (answers.topics || answers.voice || answers.posting) {
      setSelfPortrait({ topics: answers.topics, voice: answers.voice, values: answers.wish, driftedFrom: answers.posting });
    }
    setStep('loading');
  };

  const skipToLoading = () => {
    setStep('loading');
  };

  // ── Data connection step ──────────────────────
  if (step === 'data') {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-3">
          Let&apos;s start with your posts
        </h1>
        <p className="text-[17px] text-ink-500 leading-relaxed mb-10">
          Upload a data export, or pick a fictional profile to see how it works.
          Everything happens in your browser.
        </p>

        <div className="observation text-center py-10 mb-8">
          <div className="border-2 border-dashed border-linen-300 rounded-2xl py-10 px-6 mx-4">
            <p className="text-[16px] text-ink-400 mb-1">Drag your export file here</p>
            <p className="font-sans text-[13px] text-ink-300">Twitter/X, Instagram, or LinkedIn</p>
          </div>
        </div>

        <p className="font-sans text-[14px] text-ink-400 text-center mb-6">or try a fictional profile:</p>
        <ProfileSwitcher />

        {isLoaded && (
          <div className="mt-10 text-center">
            <button onClick={goToQuestions} className="btn-primary">Continue</button>
          </div>
        )}
      </div>
    );
  }

  // ── Self-input questions (one at a time) ──────
  if (step === 'q0' || step === 'q1' || step === 'q2' || step === 'q3') {
    const qIdx = parseInt(step[1]);
    const q = QUESTIONS[qIdx];
    const dots = ['q0', 'q1', 'q2', 'q3', 'online'];

    return (
      <div className="narrow-column px-6 pt-32 pb-24">
        <p className="font-sans text-[13px] text-ink-300 mb-8">
          {qIdx === 0 ? 'Before we look at your data, we\'d like to hear from you first.' : ''}
        </p>
        <label className="block text-[20px] text-ink-900 leading-snug mb-4">
          {q.label}
        </label>
        <input
          type="text"
          value={answers[q.key as keyof typeof answers]}
          onChange={e => setAnswer(q.key, e.target.value)}
          placeholder={q.hint}
          className="input-field mb-8"
          autoFocus
        />
        <div className="flex items-center gap-4">
          <button onClick={() => nextQuestion(step)} className="btn-primary">Continue</button>
          <button onClick={() => nextQuestion(step)} className="font-sans text-[13px] text-ink-300 hover:text-ink-500">Skip</button>
        </div>
        <div className="flex justify-center gap-2 mt-20">
          {dots.map((s, i) => <div key={s} className={`w-2 h-2 rounded-full ${dots.indexOf(step) >= i ? 'bg-coral-600' : 'bg-linen-300'}`} />)}
        </div>
      </div>
    );
  }

  // ── Online self question ──────────────────────
  if (step === 'online') {
    return (
      <div className="narrow-column px-6 pt-32 pb-24">
        <label className="block text-[20px] text-ink-900 leading-snug mb-6">
          Does your online self feel different from your offline self?
        </label>
        <div className="space-y-3 mb-8">
          {['Yes, noticeably', 'Sometimes', 'Not really'].map(opt => (
            <button key={opt} onClick={() => setOnlineDiff(opt)}
              className={`w-full text-left px-5 py-4 rounded-2xl border font-sans text-[15px] ${
                onlineDiff === opt ? 'border-coral-600 bg-coral-50 text-ink-900' : 'border-linen-200 bg-white text-ink-500 hover:bg-linen-100'
              }`}>
              {opt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={finishSelfInput} className="btn-primary">
            Show me my patterns
          </button>
          <button onClick={skipToLoading} className="font-sans text-[13px] text-ink-300 hover:text-ink-500">Skip</button>
        </div>
        <div className="flex justify-center gap-2 mt-20">
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-coral-600' : 'bg-linen-300'}`} />)}
        </div>
      </div>
    );
  }

  // ── Loading / analysis state ──────────────────
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-[20px] text-ink-500 leading-relaxed transition-opacity duration-500">
          {LOADING_LINES[loadingLine]}
        </p>
        <div className="mt-8 mx-auto w-48 h-px bg-linen-200 rounded overflow-hidden">
          <div className="h-full bg-coral-600 rounded transition-all duration-1000 ease-out"
            style={{ width: `${((loadingLine + 1) / LOADING_LINES.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function StartPage() {
  return <Suspense fallback={null}><StartInner /></Suspense>;
}

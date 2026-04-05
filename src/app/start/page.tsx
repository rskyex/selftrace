'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import type { SelfPortrait } from '@/lib/data/context';
import { createClient } from '@/lib/supabase/client';
import { platformMeta } from '@/lib/platforms/registry';
import type { PlatformId } from '@/lib/platforms/types';
import Link from 'next/link';

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
      <DataStep
        isLoaded={isLoaded}
        onContinue={goToProfile}
        searchParams={searchParams}
      />
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

// ── Data Step (Connect Account + Demo) ──────────────────────────────────────

interface ConnectedAccount {
  id: string;
  platform: string;
  platform_username: string;
  platform_display_name: string;
  platform_avatar_url: string | null;
  status: string;
  last_sync_at: string | null;
}

function DataStep({ isLoaded, onContinue, searchParams }: {
  isLoaded: boolean;
  onContinue: () => void;
  searchParams: ReturnType<typeof useSearchParams>;
}) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [importing, setImporting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle OAuth callback params
  useEffect(() => {
    const error = searchParams.get('error');
    const connected = searchParams.get('connected');
    const username = searchParams.get('username');
    if (error) {
      setMessage({ type: 'error', text: decodeOAuthError(error) });
    } else if (connected && username) {
      setMessage({ type: 'success', text: `Connected @${username} on ${connected.toUpperCase()}.` });
    }
  }, [searchParams]);

  // Fetch connected accounts
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('connected_accounts')
          .select('id, platform, platform_username, platform_display_name, platform_avatar_url, status, last_sync_at')
          .order('connected_at', { ascending: false });
        setAccounts(data ?? []);
      } catch {
        // Supabase not configured — silently ignore
      }
    }
    load();
  }, []);

  async function handleImport(accountId: string) {
    setImporting(accountId);
    setMessage(null);
    try {
      const res = await fetch('/api/social/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Import failed.' });
      } else if (data.imported === 0) {
        setMessage({ type: 'error', text: 'No posts found on this account.' });
      } else {
        setMessage({ type: 'success', text: `Imported ${data.imported} posts.` });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error during import.' });
    } finally {
      setImporting(null);
    }
  }

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
          Connect your social account, or choose a fictional profile to see how this works.
        </p>
      </header>

      {/* Status message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-[14px] font-sans ${
          message.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-sage-100 border border-sage-200 text-sage-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Platform list */}
      <div className="observation py-6 px-6 mb-8">
        <div className="space-y-3">
          {(Object.entries(platformMeta) as [PlatformId, typeof platformMeta[PlatformId]][]).map(
            ([id, meta]) => {
              const connectedAccount = accounts.find(
                (a) => a.platform === id && a.status === 'active'
              );

              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded-xl border border-linen-200 bg-linen-50"
                >
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={id} />
                    <div>
                      <p className="font-sans text-[14px] font-medium text-ink-900">
                        {meta.label}
                      </p>
                      {connectedAccount ? (
                        <p className="text-[12px] text-sage-700 font-sans">
                          @{connectedAccount.platform_username}
                        </p>
                      ) : (
                        <p className="text-[12px] text-ink-400 font-sans">
                          {meta.available ? meta.description : 'Coming soon'}
                        </p>
                      )}
                    </div>
                  </div>

                  {connectedAccount ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleImport(connectedAccount.id)}
                        disabled={importing === connectedAccount.id}
                        className="text-[12px] font-sans font-medium text-accent-600 hover:text-umber-700 disabled:opacity-50"
                      >
                        {importing === connectedAccount.id ? 'Importing...' : 'Import'}
                      </button>
                      <Link
                        href={`/social/import?accountId=${connectedAccount.id}`}
                        className="text-[12px] font-sans font-medium text-ink-400 hover:text-ink-700"
                      >
                        Preview
                      </Link>
                    </div>
                  ) : meta.available ? (
                    <a
                      href={`/api/oauth/${id}`}
                      className="px-4 py-1.5 bg-ink-900 hover:bg-ink-700 text-linen-50 text-[12px] font-sans font-medium rounded-lg"
                    >
                      Connect
                    </a>
                  ) : (
                    <span className="text-[12px] text-ink-300 font-sans italic">Soon</span>
                  )}
                </div>
              );
            }
          )}
        </div>
        <div className="flex items-center gap-2 mt-4 px-1">
          <span className="inline-block w-2 h-2 rounded-full bg-sage-500" aria-hidden="true" />
          <span className="text-[12px] text-ink-400">Official OAuth only — we never ask for your password</span>
        </div>
      </div>

      <p className="font-sans text-[13px] text-ink-400 text-center mb-6">or explore with a fictional profile:</p>
      <ProfileSwitcher />

      {isLoaded && (
        <div className="mt-12 text-center">
          <button onClick={onContinue} className="btn-primary">Continue</button>
        </div>
      )}

      <p className="font-sans text-[12px] text-ink-300 text-center mt-10">
        Your data is never sent anywhere. There is no server.
      </p>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: PlatformId }) {
  const icons: Record<PlatformId, React.ReactNode> = {
    x: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-900" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-600" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-900" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-600" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  };

  return (
    <div className="w-8 h-8 rounded-lg bg-linen-100 flex items-center justify-center flex-shrink-0">
      {icons[platform]}
    </div>
  );
}

function decodeOAuthError(error: string): string {
  const messages: Record<string, string> = {
    access_denied: 'You denied access. No data was collected.',
    missing_params: 'OAuth callback was missing required parameters.',
    invalid_state: 'Invalid OAuth state. Please try connecting again.',
    not_authenticated: 'You must be logged in to connect an account.',
    save_failed: 'Failed to save your connection. Please try again.',
    EXPIRED_TOKEN: 'Your access token has expired. Please reconnect.',
  };
  return messages[error] ?? `Connection error: ${error}`;
}

export default function StartPage() {
  return <Suspense fallback={null}><StartInner /></Suspense>;
}

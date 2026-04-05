'use client';

import { useState } from 'react';

const traceOptions = [
  {
    id: 'themes',
    label: 'Recurring themes',
    description: 'Which ideas, framings, and subjects you keep returning to across years of expression.',
    preview: { label: 'Dominant theme', value: 'self-discipline' },
  },
  {
    id: 'traits',
    label: 'Rewarded traits',
    description: 'Which sides of yourself got the most response — and whether they became more frequent over time.',
    preview: { label: 'Rewarded trait', value: 'vulnerability' },
  },
  {
    id: 'shifts',
    label: 'Identity shifts',
    description: 'How your narrative self changed across platforms, audiences, and algorithmic environments.',
    preview: { label: 'Narrative shift', value: 'certainty → openness' },
  },
  {
    id: 'tone',
    label: 'Emotional tone',
    description: 'The emotional register of your expression — and how it drifted in response to engagement.',
    preview: { label: 'Emotional pattern', value: 'reflective persistence' },
  },
] as const;

const sampleResults = [
  { label: 'Dominant theme', value: 'self-discipline', color: 'umber' },
  { label: 'Rewarded trait', value: 'vulnerability', color: 'trace' },
  { label: 'Stable core', value: 'ambition', color: 'sage' },
  { label: 'Narrative shift', value: 'certainty → openness', color: 'umber' },
  { label: 'Emotional pattern', value: 'reflective persistence', color: 'trace' },
] as const;

export function HeroInteractive() {
  const [selected, setSelected] = useState<string>('themes');

  const current = traceOptions.find((o) => o.id === selected) ?? traceOptions[0];

  return (
    <div className="mt-12 md:mt-14 animate-fade-up animation-delay-500">
      {/* Chip prompt */}
      <p className="font-sans text-[12px] text-ink-400 tracking-[0.15em] uppercase mb-4">
        What do you want to trace?
      </p>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {traceOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`
              font-sans text-[13px] font-medium px-4 py-2 rounded-full
              border transition-all duration-200 cursor-pointer
              ${
                selected === option.id
                  ? 'bg-ink-900 text-linen-50 border-ink-900'
                  : 'bg-transparent text-ink-500 border-ink-300 hover:border-ink-400 hover:text-ink-700'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Description + Preview Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dynamic description */}
        <div className="flex items-start">
          <p
            key={current.id}
            className="text-[15px] md:text-[16px] text-ink-500 leading-[1.75] animate-fade-in"
            style={{ animationDuration: '0.3s' }}
          >
            {current.description}
          </p>
        </div>

        {/* Preview card */}
        <div className="card p-5 md:p-6">
          <p className="font-sans text-[11px] text-ink-400 tracking-[0.15em] uppercase mb-4">
            Sample insight
          </p>
          <div className="space-y-3">
            {sampleResults.map((item) => (
              <div
                key={item.label}
                className={`
                  flex items-baseline justify-between gap-4 transition-all duration-300
                  ${current.preview.label === item.label ? 'opacity-100' : 'opacity-40'}
                `}
              >
                <span className="font-sans text-[12px] text-ink-400 shrink-0">
                  {item.label}
                </span>
                <span className="font-display text-[14px] md:text-[15px] text-ink-900 text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

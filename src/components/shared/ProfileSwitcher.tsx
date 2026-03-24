'use client';

import { useData } from '@/lib/data/context';

export function ProfileSwitcher() {
  const { profiles, activeProfile, loadProfile } = useData();

  return (
    <div>
      <p className="text-[15px] text-ink-400 mb-6 leading-relaxed">
        These are fictional profiles — made-up posting histories that show
        different patterns. Pick one to see how SelfTrace works.
      </p>
      <div className="space-y-3">
        {profiles.map((profile) => {
          const isActive = activeProfile?.id === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => loadProfile(profile.id)}
              className={`card w-full text-left p-5 ${
                isActive
                  ? 'border-violet-400 bg-violet-50'
                  : 'hover:border-ink-300'
              }`}
              aria-pressed={isActive}
            >
              <p className={`font-sans text-[16px] font-medium ${isActive ? 'text-violet-700' : 'text-ink-900'}`}>
                {profile.label}
              </p>
              <p className="text-[14px] text-ink-400 leading-relaxed mt-1">
                {profile.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

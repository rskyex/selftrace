'use client';

import { useData } from '@/lib/data/context';

export function ProfileSwitcher() {
  const { profiles, activeProfile, loadProfile } = useData();

  return (
    <div>
      <p className="text-[13px] text-charcoal-400 mb-6">
        These are fictional profiles — synthetic posting histories designed
        to show different patterns. No real person is represented.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {profiles.map((profile) => {
          const isActive = activeProfile?.id === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => loadProfile(profile.id)}
              className={`card text-left p-5 ${
                isActive
                  ? 'border-accent-500 bg-accent-50 shadow-sm'
                  : 'hover:border-charcoal-300'
              }`}
              aria-pressed={isActive}
            >
              <p className={`text-[15px] font-medium leading-snug ${isActive ? 'text-accent-700' : 'text-charcoal-900'}`}>
                {profile.label}
              </p>
              <p className="text-[13px] text-charcoal-500 leading-relaxed mt-2 line-clamp-2">
                {profile.description}
              </p>
              <p className="text-[11px] text-charcoal-300 mt-3">
                {profile.dataQuality.totalPosts} posts &middot; {profile.platform}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useData } from '@/lib/data/context';

export function ProfileSwitcher() {
  const { profiles, activeProfile, loadProfile } = useData();

  return (
    <div>
      <p className="font-interface text-[11px] text-charcoal-400 tracking-widest uppercase mb-5">
        Demo Profiles
      </p>
      <p className="text-[14px] text-charcoal-500 leading-relaxed mb-8">
        These profiles are entirely synthetic — fictional posting histories
        designed to illustrate different patterns of self-presentation over
        time. No real person is represented. Each profile exercises a different
        set of analytical features.
      </p>
      <div className="space-y-4">
        {profiles.map((profile) => {
          const isActive = activeProfile?.id === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => loadProfile(profile.id)}
              className={`w-full text-left p-5 border rounded-sm transition-colors duration-300 ${
                isActive
                  ? 'border-teal-700 bg-teal-100/40'
                  : 'border-cream-200 hover:border-charcoal-300 bg-cream-50'
              }`}
            >
              <p className={`text-[16px] leading-snug ${isActive ? 'text-teal-700' : 'text-charcoal-900'}`}>
                {profile.label}
              </p>
              <p className="text-[13px] text-charcoal-500 leading-relaxed mt-2">
                {profile.description}
              </p>
              <p className="font-interface text-[10px] text-charcoal-300 mt-3 tracking-wide">
                {profile.dataQuality.totalPosts} posts · {profile.platform} · {profile.dataQuality.dateRange.start.slice(0, 7)} to {profile.dataQuality.dateRange.end.slice(0, 7)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

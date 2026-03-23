'use client';

import { useData } from '@/lib/data/context';

export function ProfileSwitcher() {
  const { profiles, activeProfile, loadProfile } = useData();

  return (
    <div className="bg-cream-100 border border-cream-200 rounded-sm p-6">
      <h3 className="font-interface text-[13px] text-charcoal-500 tracking-wide uppercase mb-4">
        Demo Profiles
      </h3>
      <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
        These profiles are entirely synthetic. They represent plausible posting
        histories, not real people. Each illustrates a different pattern of
        self-presentation over time.
      </p>
      <div className="space-y-3">
        {profiles.map((profile) => {
          const isActive = activeProfile?.id === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => loadProfile(profile.id)}
              className={`w-full text-left p-4 border rounded-sm transition-colors duration-300 ${
                isActive
                  ? 'border-teal-700 bg-teal-100'
                  : 'border-cream-200 hover:border-charcoal-300 bg-cream-50'
              }`}
            >
              <p className={`text-[15px] mb-1 ${isActive ? 'text-teal-700' : 'text-charcoal-900'}`}>
                {profile.label}
              </p>
              <p className="text-[13px] text-charcoal-500 leading-relaxed">
                {profile.description}
              </p>
              <div className="mt-2 font-interface text-[11px] text-charcoal-300">
                {profile.dataQuality.totalPosts} posts · {profile.platform} · {profile.dataQuality.dateRange.start.slice(0, 7)} to {profile.dataQuality.dateRange.end.slice(0, 7)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

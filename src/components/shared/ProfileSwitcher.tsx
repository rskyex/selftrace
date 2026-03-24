'use client';

import { useData } from '@/lib/data/context';

export function ProfileSwitcher() {
  const { profiles, activeProfile, loadProfile } = useData();

  return (
    <div className="space-y-3">
      {profiles.map(profile => {
        const active = activeProfile?.id === profile.id;
        return (
          <button key={profile.id} onClick={() => loadProfile(profile.id)}
            className={`card card-hover w-full text-left p-5 ${active ? 'border-umber-600 bg-umber-50' : ''}`}
            aria-pressed={active}>
            <p className={`font-sans text-[15px] font-semibold ${active ? 'text-umber-700' : 'text-ink-900'}`}>
              {profile.label}
            </p>
            <p className="text-[14px] text-ink-500 leading-relaxed mt-1">
              {profile.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { DatasetProfile, AnalysisResult } from '@/lib/data/types';
import { getDemoProfiles, getDemoProfile } from '@/data/demo/profiles';
import { runAnalysis } from '@/lib/analysis/pipeline';

interface DataContextValue {
  profiles: DatasetProfile[];
  activeProfile: DatasetProfile | null;
  analysis: AnalysisResult | null;
  loadProfile: (id: string) => void;
  isLoaded: boolean;
}

const DataContext = createContext<DataContextValue>({
  profiles: [],
  activeProfile: null,
  analysis: null,
  loadProfile: () => {},
  isLoaded: false,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const profiles = useMemo(() => getDemoProfiles(), []);
  const [activeProfile, setActiveProfile] = useState<DatasetProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const loadProfile = useCallback((id: string) => {
    const profile = getDemoProfile(id);
    if (!profile) return;
    setActiveProfile(profile);
    setAnalysis(runAnalysis(profile));
  }, []);

  return (
    <DataContext.Provider value={{
      profiles,
      activeProfile,
      analysis,
      loadProfile,
      isLoaded: activeProfile !== null,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

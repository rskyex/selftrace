'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { DatasetProfile, AnalysisResult } from '@/lib/data/types';
import { getDemoProfiles, getDemoProfile } from '@/data/demo/profiles';
import { runAnalysis } from '@/lib/analysis/pipeline';

export interface SelfPortrait {
  /** What parts of yourself matter most to you? */
  whatMatters: string;
  /** What do you think you return to most often online? */
  returnTo: string;
  /** What side of yourself feels most visible online? */
  mostVisible: string;
  /** What side of yourself feels least visible online? */
  leastVisible: string;
  /** Do you feel your online self has changed over time? */
  hasChanged: string;
  /** Are there things you believe or care about differently now? */
  changedBeliefs: string;
}

interface DataContextValue {
  profiles: DatasetProfile[];
  activeProfile: DatasetProfile | null;
  analysis: AnalysisResult | null;
  loadProfile: (id: string) => void;
  isLoaded: boolean;
  selfPortrait: SelfPortrait | null;
  setSelfPortrait: (portrait: SelfPortrait) => void;
}

const DataContext = createContext<DataContextValue>({
  profiles: [],
  activeProfile: null,
  analysis: null,
  loadProfile: () => {},
  isLoaded: false,
  selfPortrait: null,
  setSelfPortrait: () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const profiles = useMemo(() => getDemoProfiles(), []);
  const [activeProfile, setActiveProfile] = useState<DatasetProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selfPortrait, setSelfPortrait] = useState<SelfPortrait | null>(null);

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
      selfPortrait,
      setSelfPortrait,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

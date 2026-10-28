'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { DatasetProfile, AnalysisResult } from '@/lib/data/types';
import { getDemoProfiles, getDemoProfile } from '@/data/demo/profiles';
import { runAnalysis } from '@/lib/analysis/pipeline';
import { DEFINITIONS, isRewardedAndRising } from '@/lib/analysis/definitions';

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
  /** What do you think platforms have changed about how you express yourself? */
  platformInfluence: string;
  /** What kind of content do you find yourself consuming most? */
  consumptionPattern: string;
  /** MBTI type (optional) */
  mbti: string;
  /** Enneagram type (optional) */
  enneagram: string;
  /** How would close friends describe you vs your online presence? */
  offlineVsOnline: string;
}

export interface AlgorithmInfluence {
  /**
   * Influence index, 0-1: min(1, 0.3·E + 0.3·T + 0.2·V + 0.2·N) with the
   * components below. An index of signals, not a percentage or probability.
   */
  sensitivityScore: number;
  indexComponents: {
    /** E: 1 if the engagement-driven shift pattern is detected, else 0 */
    engagementShift: number;
    /** T: relative drop in topic entropy, first to last quarter */
    topicConcentration: number;
    /** V: fading terms / (fading + emerging terms) */
    vocabularyConvergence: number;
    /** N: average narrowing of tone ranges */
    toneNarrowing: number;
  };
  /** Detected influence patterns */
  patterns: AlgorithmPattern[];
  /** Content homogeneity trend */
  homogeneityTrend: 'increasing' | 'stable' | 'decreasing';
  /** Engagement optimization signals */
  engagementOptimization: {
    detected: boolean;
    strength: 'low' | 'medium' | 'high';
    description: string;
  };
  /** Echo chamber indicators */
  echoChamber: {
    topicConcentration: number;
    vocabularyConvergence: number;
    toneNarrowing: number;
    description: string;
  };
  /** Platform-specific behavioral signals */
  platformSignals: PlatformSignal[];
}

export interface AlgorithmPattern {
  name: string;
  description: string;
  evidence: string;
  strength: 'subtle' | 'moderate' | 'strong';
  category: 'engagement' | 'echo_chamber' | 'content_drift' | 'self_presentation' | 'attention';
}

export interface PlatformSignal {
  signal: string;
  description: string;
  observed: boolean;
}

interface DataContextValue {
  profiles: DatasetProfile[];
  activeProfile: DatasetProfile | null;
  analysis: AnalysisResult | null;
  algorithmInfluence: AlgorithmInfluence | null;
  loadProfile: (id: string) => void;
  isLoaded: boolean;
  selfPortrait: SelfPortrait | null;
  setSelfPortrait: (portrait: SelfPortrait) => void;
}

const DataContext = createContext<DataContextValue>({
  profiles: [],
  activeProfile: null,
  analysis: null,
  algorithmInfluence: null,
  loadProfile: () => {},
  isLoaded: false,
  selfPortrait: null,
  setSelfPortrait: () => {},
});

export function computeAlgorithmInfluence(profile: DatasetProfile, analysis: AnalysisResult): AlgorithmInfluence {
  const posts = profile.posts;
  const eng = analysis.engagementSensitivity;

  // 1. Engagement optimization: share of topics that are rewarded and rising
  let engOptStrength: 'low' | 'medium' | 'high' = 'low';
  let engOptDetected = false;
  const reinforcedCount = eng ? eng.value.filter(isRewardedAndRising).length : 0;
  if (eng && eng.value.length > 0) {
    const ratio = reinforcedCount / eng.value.length;
    engOptDetected = ratio >= DEFINITIONS.engagementShiftMinShare;
    engOptStrength = ratio > 0.35 ? 'high' : ratio > 0.2 ? 'medium' : 'low';
  }

  // 2. Echo chamber: topic concentration (first vs last window) + vocabulary convergence
  const narrowing = analysis.narrowing.value;
  const topicConcentration = narrowing.sufficient ? Math.max(0, -narrowing.relativeChange) : 0;

  const drift = analysis.vocabularyDrift.value;
  const emergingCount = drift.filter(t => t.direction === 'emerging').length;
  const fadingCount = drift.filter(t => t.direction === 'fading').length;
  // Share of directional drift that is fading (stable terms excluded), so it
  // is above 0.5 exactly when more words faded than emerged.
  const vocabConvergence = fadingCount + emergingCount > 0 ? fadingCount / (fadingCount + emergingCount) : 0;
  const vocabNarrowed = fadingCount > emergingCount;

  // 3. Tone narrowing
  const tones = analysis.toneTrends.value;
  const toneRanges = (['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(m => {
    const s = tones[m];
    if (s.length < 2) return 0;
    const vals = s.map(p => p.value);
    const range = Math.max(...vals) - Math.min(...vals);
    const lateVals = vals.slice(Math.floor(vals.length / 2));
    const lateRange = Math.max(...lateVals) - Math.min(...lateVals);
    return range > 0 ? Math.max(0, (range - lateRange) / range) : 0;
  });
  const toneNarrowing = toneRanges.reduce((a, b) => a + b, 0) / toneRanges.length;

  // 4. Overall sensitivity
  const sensitivityScore = Math.min(1, (
    (engOptDetected ? 0.3 : 0) +
    topicConcentration * 0.3 +
    vocabConvergence * 0.2 +
    toneNarrowing * 0.2
  ));

  // 5. Detect patterns
  const patterns: AlgorithmPattern[] = [];

  if (engOptDetected) {
    patterns.push({
      name: 'Engagement-driven content shift',
      description: 'Topics that received more engagement became more frequent in your posting over time.',
      evidence: `${reinforcedCount} of ${eng?.value.length ?? 0} topics were rewarded and rising.`,
      strength: engOptStrength === 'high' ? 'strong' : engOptStrength === 'medium' ? 'moderate' : 'subtle',
      category: 'engagement',
    });
  }

  if (narrowing.narrowed) {
    patterns.push({
      name: 'Topic narrowing over time',
      description: 'Your range of subjects contracted. You engaged with fewer topics by the end of the period than at the start.',
      evidence: `Topic diversity dropped by ${Math.round(topicConcentration * 100)}% between the first and last ${narrowing.windowMonths} months.`,
      strength: topicConcentration > 0.35 ? 'strong' : topicConcentration > 0.2 ? 'moderate' : 'subtle',
      category: 'echo_chamber',
    });
  }

  if (vocabNarrowed) {
    patterns.push({
      name: 'Vocabulary convergence',
      description: 'More words faded from your writing than emerged. Your linguistic range may have narrowed.',
      evidence: `${fadingCount} words fading vs ${emergingCount} emerging.`,
      strength: vocabConvergence > 0.75 ? 'strong' : 'moderate',
      category: 'echo_chamber',
    });
  }

  if (toneNarrowing > 0.15) {
    patterns.push({
      name: 'Tone stabilization',
      description: 'Your writing tone became less variable over time, potentially settling into a narrower expressive range.',
      evidence: `Tone variability decreased by ~${Math.round(toneNarrowing * 100)}%.`,
      strength: toneNarrowing > 0.3 ? 'moderate' : 'subtle',
      category: 'content_drift',
    });
  }

  // Check for self-description drift toward platform norms
  const earlyDescs = analysis.selfDescriptionShift.value.early;
  const lateDescs = analysis.selfDescriptionShift.value.late;
  const earlyRoles = earlyDescs.filter(d => d.pattern === 'expertise_signal').length;
  const lateRoles = lateDescs.filter(d => d.pattern === 'expertise_signal').length;
  if (lateRoles > earlyRoles * 1.5 && lateRoles > 2) {
    patterns.push({
      name: 'Expertise performance increase',
      description: 'You described yourself as an expert more often over time. This aligns with platform incentives that reward authority signals.',
      evidence: `Expertise signals: ${earlyRoles} (early) → ${lateRoles} (late).`,
      strength: 'moderate',
      category: 'self_presentation',
    });
  }

  // Platform signals
  const platformSignals: PlatformSignal[] = [
    {
      signal: 'Engagement-frequency correlation',
      description: 'Topics with more engagement appeared more frequently over time',
      observed: engOptDetected,
    },
    {
      signal: 'Topic funnel effect',
      description: 'Content diversity decreased while posting remained active',
      observed: narrowing.narrowed,
    },
    {
      signal: 'Vocabulary narrowing',
      description: 'More words faded from your writing than emerged over the posting period',
      observed: vocabNarrowed,
    },
    {
      signal: 'Tone conformity',
      description: 'Expressive range in writing tone narrowed over time',
      observed: toneNarrowing > 0.15,
    },
    {
      signal: 'Self-branding escalation',
      description: 'Self-description shifted toward expertise and authority claims',
      observed: lateRoles > earlyRoles * 1.5 && lateRoles > 2,
    },
  ];

  return {
    sensitivityScore,
    indexComponents: {
      engagementShift: engOptDetected ? 1 : 0,
      topicConcentration,
      vocabularyConvergence: vocabConvergence,
      toneNarrowing,
    },
    patterns,
    homogeneityTrend: topicConcentration > 0.2 ? 'increasing' : topicConcentration < -0.1 ? 'decreasing' : 'stable',
    engagementOptimization: {
      detected: engOptDetected,
      strength: engOptStrength,
      description: engOptDetected
        ? 'Your posting patterns show correlation between engagement and content direction. The environment appears to have shaped what you expressed more of.'
        : 'No strong signal that engagement patterns drove your content direction.',
    },
    echoChamber: {
      topicConcentration,
      vocabularyConvergence: vocabConvergence,
      toneNarrowing,
      description: topicConcentration > 0.2
        ? 'Your content shows signs of narrowing — fewer topics, less vocabulary variety. This is consistent with algorithmic environments that reward specialization.'
        : 'Your content maintained relative diversity. Algorithmic narrowing signals are weak.',
    },
    platformSignals,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const profiles = useMemo(() => getDemoProfiles(), []);
  const [activeProfile, setActiveProfile] = useState<DatasetProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [algorithmInfluence, setAlgorithmInfluence] = useState<AlgorithmInfluence | null>(null);
  const [selfPortrait, setSelfPortrait] = useState<SelfPortrait | null>(null);

  const loadProfile = useCallback((id: string) => {
    const profile = getDemoProfile(id);
    if (!profile) return;
    setActiveProfile(profile);
    const result = runAnalysis(profile);
    setAnalysis(result);
    setAlgorithmInfluence(computeAlgorithmInfluence(profile, result));
  }, []);

  return (
    <DataContext.Provider value={{
      profiles,
      activeProfile,
      analysis,
      algorithmInfluence,
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

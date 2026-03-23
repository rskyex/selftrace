import type { EpistemicStatus } from '@/lib/data/types';

export const EPISTEMIC_LABELS: Record<EpistemicStatus, {
  label: string;
  description: string;
  tooltip: string;
}> = {
  observed: {
    label: 'Observed',
    description: 'Directly present in the data.',
    tooltip: 'This is drawn directly from your data. No interpretation has been applied.',
  },
  inferred: {
    label: 'Inferred',
    description: 'Derived from pattern analysis.',
    tooltip: 'This pattern was detected through analysis. It reflects a plausible reading, not a certainty.',
  },
  speculative: {
    label: 'Speculative',
    description: 'A possible interpretation.',
    tooltip: 'This is one possible interpretation. You may read the same data differently.',
  },
  governance_commentary: {
    label: 'Governance Commentary',
    description: 'About platform design, not your behavior.',
    tooltip: 'This note concerns platform design or policy, not your behavior. It provides structural context.',
  },
};

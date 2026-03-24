import type { EpistemicStatus } from '@/lib/data/types';

export const EPISTEMIC_LABELS: Record<EpistemicStatus, {
  label: string;
  description: string;
  tooltip: string;
}> = {
  observed: {
    label: 'Observed',
    description: 'Directly in your data.',
    tooltip: 'This comes directly from your data. No interpretation applied.',
  },
  inferred: {
    label: 'Inferred',
    description: 'Pattern-based finding.',
    tooltip: 'Detected through pattern analysis. A plausible reading, not a certainty.',
  },
  speculative: {
    label: 'Speculative',
    description: 'One possible reading.',
    tooltip: 'One possible interpretation. You may read the same data differently.',
  },
  governance_commentary: {
    label: 'Platform context',
    description: 'About platform design, not your behavior.',
    tooltip: 'Context about how platforms work. Not a claim about your behavior.',
  },
};

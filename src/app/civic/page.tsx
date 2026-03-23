import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export default function CivicPage() {
  return (
    <PlaceholderPage
      title="Civic Lens"
      subtitle="From individual patterns to collective questions about public discourse."
      framingText="The patterns examined in this tool concern one person's posting history. But platform incentive structures operate at scale. If reinforcement dynamics shape self-presentation for millions of users simultaneously, the effects are not only personal — they are civic. This page will consider what algorithmic self-presentation shaping might mean for public discourse, democratic participation, and collective sense-making."
      willExamine={[
        'Whether platform incentives that reward legible, categorizable identities may reduce the space for productive ambiguity in public discourse',
        'How engagement-driven content selection might systematically amplify certain forms of civic expression over others',
        'What it means for democratic participation when self-presentation is shaped by attention markets',
        'How the patterns observed in individual posting histories might aggregate into collective discourse effects',
        'Research questions that emerge from this analysis — posed as genuine open questions, not predetermined conclusions',
      ]}
    />
  );
}

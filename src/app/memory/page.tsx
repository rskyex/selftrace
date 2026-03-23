import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export default function MemoryPage() {
  return (
    <PlaceholderPage
      title="Memory & Recirculation"
      subtitle="How platform memory features may shape which past selves are revisited."
      framingText="Platforms do not only shape what users post in the present. Through features like 'On This Day,' memory prompts, and resharing mechanics, they also mediate the relationship between past and present self-presentation. This page will examine patterns of content recirculation — what gets revisited, what remains dormant, and whether recirculated content is representative of the full archive or skewed toward particular themes."
      willExamine={[
        'Frequency and timing of self-referential posts (throwbacks, self-quotes, reshares of own content)',
        'Whether recirculated content is topically representative of the full archive or asymmetric',
        'Whether higher-engagement past content is disproportionately recirculated',
        'Periods of the posting history that are never revisited',
        'How platform memory features (which are not directly observable) may structure these patterns',
      ]}
    />
  );
}

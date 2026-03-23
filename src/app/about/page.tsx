import { PageHeader } from '@/components/shared/PageHeader';
import { SectionDivider } from '@/components/shared/SectionDivider';

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About"
        subtitle="What this project is, why it exists, and where it comes from."
      />

      <div className="reading-column px-6 pb-24">
        <h2 className="text-[22px] text-charcoal-900 mb-4 mt-8">
          Project Description
        </h2>
        <p className="text-[16px] text-charcoal-700 leading-relaxed mb-4">
          The Platformed Self is a research prototype that examines how
          algorithmic platforms may shape self-presentation over time. It
          analyzes user-provided posting history to surface temporal patterns,
          reinforcement correlations, narrative repetition, and identity
          compression that may correlate with platform incentive structures.
        </p>
        <p className="text-[16px] text-charcoal-700 leading-relaxed mb-8">
          It is designed for researchers, policy analysts, journalists, and
          individuals interested in reflective examination of their own
          platform behavior. It is not a consumer product, not a wellness tool,
          and not a diagnostic instrument.
        </p>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Intellectual Context
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed mb-4">
          This project draws on several research traditions:
        </p>
        <ul className="space-y-3 mb-8">
          {[
            {
              tradition: 'Platform Studies',
              note: 'Examining how platform architectures shape user behavior and cultural production (Gillespie, Plantin, van Dijck).',
            },
            {
              tradition: 'Narrative Identity Theory',
              note: 'Understanding how people construct and maintain identity through self-narration (McAdams, Ricoeur).',
            },
            {
              tradition: 'Science and Technology Studies (STS)',
              note: 'Analyzing the co-construction of technology and social practice (Winner, Jasanoff, Latour).',
            },
            {
              tradition: 'Surveillance Capitalism',
              note: 'Examining the economic logic of behavioral prediction markets (Zuboff).',
            },
            {
              tradition: 'Attention Economy',
              note: 'Understanding the competition for human attention as an economic and political resource (Wu, Williams).',
            },
          ].map((ref) => (
            <li key={ref.tradition} className="pl-4 border-l-2 border-cream-200">
              <span className="text-[15px] text-charcoal-900">{ref.tradition}</span>
              <p className="text-[13px] text-charcoal-500 leading-relaxed mt-1">{ref.note}</p>
            </li>
          ))}
        </ul>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          How to Cite
        </h2>
        <div className="bg-cream-100 border border-cream-200 rounded-sm p-5 font-mono text-[13px] text-charcoal-700 leading-relaxed">
          The Platformed Self: A Reflective Observatory for Examining
          Algorithmic Self-Presentation. Research Prototype, 2024.
        </div>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Contributing
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed mb-4">
          This project welcomes critique, methodological review, and
          contributions from researchers, designers, and developers.
          If you find errors in the analysis, limitations in the framing,
          or opportunities for improvement, your input is valued.
        </p>

        <SectionDivider />

        <p className="text-[14px] italic text-charcoal-500">
          A research prototype. Built for reflection, not optimization.
        </p>
      </div>
    </div>
  );
}

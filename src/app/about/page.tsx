import { PageHeader } from '@/components/shared/PageHeader';
import { SectionDivider } from '@/components/shared/SectionDivider';

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About This Project"
        subtitle="What it is, why it exists, and where it comes from."
      />

      <div className="reading-column px-6 pb-24">
        <div className="prose-body text-[15px] leading-[1.8] text-charcoal-700 mt-8">
          <p>
            The Platformed Self is a research prototype that examines how
            algorithmic platforms may shape self-presentation over time. It
            analyzes user-provided posting history to surface temporal
            patterns, reinforcement correlations, narrative repetition, and
            identity compression — patterns that may correlate with the
            incentive structures platforms create, but that may equally
            reflect personal growth, circumstance, or deliberate choice.
          </p>
          <p>
            It is designed for researchers, policy analysts, journalists,
            and individuals interested in reflective examination of their
            own platform behavior. It is not a consumer product, not a
            wellness tool, not a diagnostic instrument, and not a basis
            for claims about anyone&apos;s authenticity or mental state.
          </p>
          <p>
            The project takes seriously the possibility that platforms do
            not only shape what users see — they may also shape what users
            post, repeat, remember, and come to experience as their own
            voice. It also takes seriously the possibility that this framing
            can be overstated, that human agency is more resilient than
            platform criticism sometimes assumes, and that the same patterns
            can have multiple valid explanations. Holding both possibilities
            in tension, without collapsing into either certainty or
            dismissal, is the intellectual commitment of this project.
          </p>
        </div>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Intellectual Context
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          This project draws on several research traditions, each of which
          contributes a different lens to the question of platform-mediated
          self-presentation.
        </p>
        <div className="space-y-5">
          {[
            {
              tradition: 'Platform Studies',
              note: 'Examining how platform architectures shape user behavior, cultural production, and public discourse. Gillespie, Plantin, van Dijck.',
            },
            {
              tradition: 'Narrative Identity Theory',
              note: 'Understanding how people construct and maintain identity through self-narration, and how narrative environments shape self-understanding. McAdams, Ricoeur, Bruner.',
            },
            {
              tradition: 'Science and Technology Studies',
              note: 'Analyzing the co-construction of technology and social practice, and how technical systems embed and enforce values. Winner, Jasanoff, Latour.',
            },
            {
              tradition: 'Surveillance Capitalism',
              note: 'Examining the economic logic of behavioral prediction markets and the extraction of behavioral surplus from user activity. Zuboff.',
            },
            {
              tradition: 'Attention Economy',
              note: 'Understanding the competition for human attention as an economic and political resource, and its effects on communication norms. Wu, Williams, Crawford.',
            },
            {
              tradition: 'Behavioral Design Criticism',
              note: 'Examining how interface design patterns — variable-ratio reinforcement, social proof, default effects — shape user behavior at scale. Fogg, Harris, Eyal (critically).',
            },
          ].map((ref) => (
            <div key={ref.tradition} className="border-l border-cream-300 pl-5">
              <span className="text-[15px] text-charcoal-900">{ref.tradition}</span>
              <p className="text-[13px] text-charcoal-500 leading-relaxed mt-1">{ref.note}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Design Philosophy
        </h2>
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8]">
          <p>
            The visual and interaction design of this tool is deliberately
            restrained. It uses serif typography for interpretive text,
            generous whitespace, muted colors, and slow transitions. It
            avoids progress bars, achievement patterns, scores, rankings,
            and any visual language that implies optimization or
            gamification.
          </p>
          <p>
            These are not aesthetic preferences. They are ethical choices.
            A tool that examines how platforms shape self-presentation
            must not itself use the same design patterns it critiques.
            The interface should feel like reading a carefully typeset
            essay, not using a product.
          </p>
        </div>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          How to Cite
        </h2>
        <div className="bg-cream-100 border border-cream-200 rounded-sm p-5 font-mono text-[12px] text-charcoal-700 leading-relaxed">
          The Platformed Self: A Reflective Observatory for Examining
          Algorithmic Self-Presentation. Research Prototype, 2024.
        </div>

        <SectionDivider />

        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Contributing and Critique
        </h2>
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8]">
          <p>
            This project welcomes critique. If you find errors in the
            analysis, limitations in the framing, methodological weaknesses,
            or opportunities for improvement, your input is valued. If you
            believe the tool overclaims in any respect, that feedback is
            especially welcome — epistemic discipline requires external
            review.
          </p>
        </div>

        <div className="mt-16">
          <p className="text-[14px] italic text-charcoal-400">
            Built for reflection, not optimization. A research prototype,
            not a product.
          </p>
        </div>
      </div>
    </div>
  );
}

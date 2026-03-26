import Link from 'next/link';
import { PageHeader } from './PageHeader';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  framingText: string;
  willExamine: string[];
}

export function PlaceholderPage({ title, subtitle, framingText, willExamine }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="reading-column px-6 pb-24">
        <div className="border-l border-linen-300 pl-5 mb-12 mt-4">
          <p className="font-sans text-[11px] text-ink-400 tracking-[0.2em] uppercase mb-3">
            Under Development
          </p>
          <p className="text-[14px] text-ink-500 leading-relaxed">
            This analysis is not yet available in the current prototype.
            The framing below describes what this page will examine and why.
            When implemented, it will process data locally using the same
            epistemic framework applied throughout this tool.
          </p>
          <div className="mt-4 flex gap-5 font-sans text-[11px]">
            <Link href="/methodology" className="text-link">
              Read the methodology
            </Link>
            <Link href="/timeline" className="text-link">
              Return to timeline
            </Link>
          </div>
        </div>

        <div className="prose-body text-[15px] text-ink-700 leading-[1.8] mb-12">
          <p>{framingText}</p>
        </div>

        <h2 className="font-display text-[22px] text-ink-900 mb-5">
          What this page will examine
        </h2>
        <ul className="space-y-4">
          {willExamine.map((item, i) => (
            <li key={i} className="text-[14px] text-ink-700 leading-relaxed pl-5 border-l border-linen-200">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

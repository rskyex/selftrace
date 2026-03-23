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
        <div className="bg-cream-100 border border-cream-200 rounded-sm p-6 mb-8">
          <p className="font-interface text-[13px] text-charcoal-500 mb-3">
            This analysis is not yet available.
          </p>
          <p className="text-[14px] text-charcoal-700 leading-relaxed">
            The framing below describes what this page will examine and why.
            When this analysis is ready, it will process your data locally using
            the same epistemic framework applied throughout this tool.
          </p>
          <div className="mt-4 flex gap-4 font-interface text-[13px]">
            <Link href="/methodology" className="text-teal-700 hover:text-teal-500 transition-colors duration-150">
              Read the methodology
            </Link>
            <Link href="/timeline" className="text-teal-700 hover:text-teal-500 transition-colors duration-150">
              Return to timeline
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-[16px] leading-relaxed text-charcoal-700 mb-8">
            {framingText}
          </p>

          <h2 className="text-[22px] text-charcoal-900 mb-4">
            What this page will examine
          </h2>
          <ul className="space-y-3">
            {willExamine.map((item, i) => (
              <li key={i} className="text-[14px] text-charcoal-700 leading-relaxed pl-4 border-l-2 border-cream-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

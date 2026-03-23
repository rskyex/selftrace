import { EpistemicBadge } from './EpistemicBadge';

interface GovernanceBlockProps {
  children: React.ReactNode;
}

export function GovernanceBlock({ children }: GovernanceBlockProps) {
  return (
    <div className="border-l-[3px] border-slate-200 bg-slate-100 pl-6 pr-6 py-5 ml-4 my-8">
      <div className="mb-2">
        <EpistemicBadge status="governance_commentary" />
      </div>
      <div className="text-[14px] leading-relaxed text-slate-600">
        {children}
      </div>
    </div>
  );
}

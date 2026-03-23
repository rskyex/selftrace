import { EpistemicBadge } from './EpistemicBadge';

interface GovernanceBlockProps {
  children: React.ReactNode;
}

export function GovernanceBlock({ children }: GovernanceBlockProps) {
  return (
    <div className="border-l border-slate-200 bg-slate-100/60 pl-6 pr-6 py-5 my-10">
      <div className="mb-3">
        <EpistemicBadge status="governance_commentary" />
      </div>
      <div className="text-[14px] leading-relaxed text-slate-600">
        {children}
      </div>
    </div>
  );
}

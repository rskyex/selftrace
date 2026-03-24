interface GovernanceBlockProps {
  children: React.ReactNode;
}

export function GovernanceBlock({ children }: GovernanceBlockProps) {
  return (
    <div className="card px-6 py-5 my-8 bg-slate-100/40">
      <p className="text-[11px] font-medium text-charcoal-400 uppercase tracking-wider mb-2">
        Platform context
      </p>
      <div className="text-[14px] leading-relaxed text-charcoal-500">
        {children}
      </div>
    </div>
  );
}

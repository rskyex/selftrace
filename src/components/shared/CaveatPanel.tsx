interface CaveatPanelProps {
  title?: string;
  children: React.ReactNode;
}

export function CaveatPanel({ title = 'Keep in mind', children }: CaveatPanelProps) {
  return (
    <div className="card-elevated px-6 py-5 my-8 border-l-3 border-l-amber-400">
      <h3 className="text-[13px] font-medium text-amber-700 mb-2">
        {title}
      </h3>
      <div className="text-[14px] leading-relaxed text-charcoal-500">
        {children}
      </div>
    </div>
  );
}

interface CaveatPanelProps {
  title?: string;
  children: React.ReactNode;
}

export function CaveatPanel({ title = 'Keep in mind', children }: CaveatPanelProps) {
  return (
    <div className="card px-6 py-5 my-8 border-l-3 border-l-umber-500">
      <h3 className="font-sans text-[13px] font-medium text-umber-700 mb-2">
        {title}
      </h3>
      <div className="text-[14px] leading-relaxed text-ink-500">
        {children}
      </div>
    </div>
  );
}

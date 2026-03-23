interface CaveatPanelProps {
  title?: string;
  children: React.ReactNode;
}

export function CaveatPanel({ title = 'What this page cannot tell you.', children }: CaveatPanelProps) {
  return (
    <div className="border-l-[3px] border-amber-500 bg-amber-100 pl-6 pr-6 py-5 my-8">
      <h3 className="text-[15px] font-interface font-semibold text-amber-700 mb-2">
        {title}
      </h3>
      <div className="text-[14px] leading-relaxed text-charcoal-700">
        {children}
      </div>
    </div>
  );
}

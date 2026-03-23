interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-28 pb-6 reading-column px-6">
      <h1 className="text-[26px] leading-tight tracking-tight text-charcoal-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-charcoal-400">
          {subtitle}
        </p>
      )}
    </header>
  );
}

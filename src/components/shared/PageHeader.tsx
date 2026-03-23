interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-24 pb-8 reading-column px-6">
      <h1 className="text-[28px] leading-tight tracking-tight text-charcoal-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[16px] leading-relaxed text-charcoal-500">
          {subtitle}
        </p>
      )}
    </header>
  );
}

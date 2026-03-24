interface PageHeaderProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export function PageHeader({ title, subtitle, compact = false }: PageHeaderProps) {
  return (
    <header className={`${compact ? 'pt-10 pb-4' : 'pt-20 pb-8'} wide-column px-6`}>
      <h1 className="text-[32px] font-semibold tracking-tight text-charcoal-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[16px] leading-relaxed text-charcoal-400 max-w-xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}

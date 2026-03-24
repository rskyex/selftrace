interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-20 pb-6 reading-column px-6">
      <h1 className="text-[32px] font-semibold tracking-tight text-ink-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[17px] leading-relaxed text-ink-400">
          {subtitle}
        </p>
      )}
    </header>
  );
}

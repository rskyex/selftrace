interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-24 pb-8 reading-column px-6">
      <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-[17px] leading-[1.7] text-ink-500">
          {subtitle}
        </p>
      )}
    </header>
  );
}

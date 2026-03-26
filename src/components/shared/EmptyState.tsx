import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message: string;
  actions?: { label: string; href: string }[];
}

export function EmptyState({
  title = 'No data yet',
  message,
  actions,
}: EmptyStateProps) {
  return (
    <div className="wide-column py-20 px-6 text-center">
      <h3 className="font-display text-[20px] text-ink-700 mb-3">{title}</h3>
      <p className="text-[15px] text-ink-400 leading-relaxed max-w-md mx-auto">{message}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="text-link text-[14px]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

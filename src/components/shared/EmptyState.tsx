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
      <h3 className="text-[20px] font-semibold text-charcoal-700 mb-3">{title}</h3>
      <p className="text-[15px] text-charcoal-400 leading-relaxed max-w-md mx-auto">{message}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="text-[14px] font-medium text-accent-600 hover:text-accent-700"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

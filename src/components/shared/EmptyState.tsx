import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message: string;
  actions?: { label: string; href: string }[];
}

export function EmptyState({
  title = 'Nothing to show yet.',
  message,
  actions,
}: EmptyStateProps) {
  return (
    <div className="reading-column text-center py-16 px-6">
      <h3 className="text-[18px] text-charcoal-700 mb-3">{title}</h3>
      <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">{message}</p>
      {actions && (
        <div className="flex items-center justify-center gap-4 font-interface text-[13px]">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="text-teal-700 hover:text-teal-500 transition-colors duration-150"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

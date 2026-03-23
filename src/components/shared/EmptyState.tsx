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
    <div className="reading-column py-20 px-6">
      <h3 className="text-[18px] text-charcoal-700 mb-4">{title}</h3>
      <p className="text-[14px] text-charcoal-500 leading-relaxed max-w-md">{message}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 font-interface text-[12px]">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="text-teal-700 hover:text-teal-500 transition-colors duration-200"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

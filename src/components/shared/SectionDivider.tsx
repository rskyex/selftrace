interface SectionDividerProps {
  withRule?: boolean;
}

export function SectionDivider({ withRule = false }: SectionDividerProps) {
  return (
    <div className="my-16">
      {withRule && <hr className="border-cream-200" />}
    </div>
  );
}

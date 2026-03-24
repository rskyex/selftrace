'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PresentationToggleInner() {
  const searchParams = useSearchParams();
  const isPresenting = searchParams.get('present') === 'true';
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('presentation-mode', isPresenting);
    return () => { document.documentElement.classList.remove('presentation-mode'); };
  }, [isPresenting, mounted]);

  return null;
}

export function PresentationToggle() {
  return (
    <Suspense fallback={null}>
      <PresentationToggleInner />
    </Suspense>
  );
}

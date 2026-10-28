import Link from 'next/link';

/** Shown on the social import/results pages when NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT is off. */
export function SocialConnectDisabled() {
  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="font-display text-[28px] md:text-[34px] tracking-tight text-ink-900 leading-[1.1] mb-4">
        Account connection is not available
      </h1>
      <p className="text-[17px] text-ink-500 leading-[1.7] mb-8">
        This version of SelfTrace works with fictional demo profiles only, generated and analysed in your browser.
      </p>
      <Link href="/start?demo=true" className="btn-primary">Try a demo profile</Link>
    </div>
  );
}

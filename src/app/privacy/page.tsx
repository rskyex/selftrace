import { SOCIAL_CONNECT_ENABLED } from '@/lib/features';

// Every statement here must be exactly true for the deployed build. With the
// default build (NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT off) nothing leaves the
// browser; with the flag on, the page lists what the X connection stores.

const NOT_COLLECTED_DEFAULT = [
  'Your reflection answers, personality types or choices',
  'Analytics or usage telemetry (no analytics scripts are included)',
  'Cookies (SelfTrace sets none)',
  'Anything sent to or stored on a server',
  'Anything kept after you reload or close the tab',
  'Anything shared with a third party',
];

const NOT_COLLECTED_CONNECT = [
  'Your reflection answers, personality types or choices (they stay in the browser tab)',
  'Analytics or usage telemetry (no analytics scripts are included)',
  'Your X password (connection uses X’s official OAuth)',
  'Anything about the demo profiles',
];

const STORED_WHEN_CONNECTED = [
  'Your X account ID, username, display name and profile image URL',
  'The OAuth access token and refresh token for your X account, stored as plain text in our Supabase database, with their granted scopes and expiry time',
  'Every post you import: its full text, hashtags, mentions, like/share/reply/view counts, and the raw post data returned by the X API',
  'Each analysis run of your imported posts, which runs on our server, and its results',
  'A Supabase sign-in session, kept in cookies in your browser',
];

export default function PrivacyPage() {
  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <header className="mb-16">
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
          Privacy
        </p>
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1]">
          {SOCIAL_CONNECT_ENABLED ? 'What stays in your browser, and what we store' : 'Your data stays yours'}
        </h1>
      </header>

      <div className="prose-body text-[17px] text-ink-500 leading-[1.85] mb-16">
        {SOCIAL_CONNECT_ENABLED ? (
          <p>
            Demo profiles are generated and analysed entirely in your browser; nothing about them is sent
            to our server. Connecting an X account is different: the connection, the import and the
            analysis of your imported posts run on our server, and the data listed below is stored in our
            database.
          </p>
        ) : (
          <p>
            In this version SelfTrace works with fictional demo profiles. They are generated in your
            browser and all analysis runs there. Your reflection answers and choices are held in this
            tab&apos;s memory and are gone when you reload or close it. Nothing you type or load is sent
            to a server.
          </p>
        )}
      </div>

      {/* Architecture */}
      <div className="observation text-center py-8 mb-16">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-6 font-sans text-[15px] text-ink-700">
          <div className="card px-6 py-3 font-medium">Your Browser</div>
          <span className="text-[20px] text-ink-300" aria-hidden="true">&harr;</span>
          <div className="card px-6 py-3 font-medium">Demo data</div>
          {SOCIAL_CONNECT_ENABLED && (
            <>
              <span className="text-[20px] text-ink-300 hidden md:inline" aria-hidden="true">&harr;</span>
              <div className="card px-6 py-3 font-medium text-ink-400">Our server (connected X accounts)</div>
            </>
          )}
        </div>
        <p className="mt-6 text-[15px] text-ink-400">
          {SOCIAL_CONNECT_ENABLED
            ? 'Demo analysis is local. Connected X accounts are imported, stored and analysed on our server.'
            : 'Analysis is local. The server only delivers the pages; it receives nothing you enter.'}
        </p>
      </div>

      {SOCIAL_CONNECT_ENABLED && (
        <>
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
            What we store if you connect an X account
          </h2>
          <div className="space-y-2 mb-6">
            {STORED_WHEN_CONNECTED.map(item => (
              <p key={item} className="text-[15px] text-ink-500 pl-5 border-l-2 border-amber-200 py-1">
                {item}
              </p>
            ))}
          </div>
          <p className="text-[15px] text-ink-500 mb-16">
            There is no in-app option to delete this data yet.
          </p>
        </>
      )}

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
        What we don&apos;t collect
      </h2>
      <div className="space-y-2 mb-6">
        {(SOCIAL_CONNECT_ENABLED ? NOT_COLLECTED_CONNECT : NOT_COLLECTED_DEFAULT).map(item => (
          <p key={item} className="text-[15px] text-ink-500 pl-5 border-l-2 border-sage-200 py-1">
            {item}
          </p>
        ))}
      </div>
      <p className="text-[14px] text-ink-400 leading-[1.7] mb-16">
        Like any website, the host (Vercel) receives the standard information your browser sends when it
        loads a page, such as your IP address.
      </p>

      <div className="observation-sage">
        <h3>Privacy is the architecture, not a feature</h3>
        <p>
          {SOCIAL_CONNECT_ENABLED
            ? 'The demo path has no server-side component. The X connection does, and it is switched on in this deployment (NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT). The source code is available for inspection, so every claim on this page can be verified.'
            : 'In this version nothing server-side receives your data: no sign-in, no database writes, no API calls. Account connection is switched off (NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT). The source code is available for inspection, so every claim on this page can be verified.'}
        </p>
      </div>
    </div>
  );
}

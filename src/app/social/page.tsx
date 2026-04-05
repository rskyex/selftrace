'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/client';
import { platformMeta } from '@/lib/platforms/registry';
import type { PlatformId } from '@/lib/platforms/types';
import Link from 'next/link';

interface ConnectedAccount {
  id: string;
  platform: string;
  platform_username: string;
  platform_display_name: string;
  platform_avatar_url: string | null;
  status: string;
  last_sync_at: string | null;
  connected_at: string;
}

function SocialInner() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const error = searchParams.get('error');
  const connected = searchParams.get('connected');
  const username = searchParams.get('username');

  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: decodeError(error) });
    } else if (connected && username) {
      setMessage({ type: 'success', text: `Connected @${username} on ${connected.toUpperCase()}.` });
    }
  }, [error, connected, username]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('connected_accounts')
      .select('id, platform, platform_username, platform_display_name, platform_avatar_url, status, last_sync_at, connected_at')
      .order('connected_at', { ascending: false });

    setAccounts(data ?? []);
    setLoading(false);
  }

  async function handleImport(accountId: string) {
    setImporting(accountId);
    setMessage(null);

    try {
      const res = await fetch('/api/social/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Import failed.' });
      } else if (data.imported === 0) {
        setMessage({ type: 'error', text: 'No posts found on this account.' });
      } else {
        setMessage({ type: 'success', text: `Imported ${data.imported} posts.` });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error during import.' });
    } finally {
      setImporting(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Connect an account"
        subtitle="Link your social media account via official login, import your posts, and run SelfTrace analysis on your own data."
      />

      <div className="wide-column px-6 pb-24">
        {/* Status messages */}
        {message && (
          <div className={`mb-8 p-4 rounded-xl text-[14px] font-sans ${
            message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-sage-100 border border-sage-200 text-sage-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Platform selection grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {(Object.entries(platformMeta) as [PlatformId, typeof platformMeta[PlatformId]][]).map(
            ([id, meta]) => {
              const connectedAccount = accounts.find(
                (a) => a.platform === id && a.status === 'active'
              );

              return (
                <div key={id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={id} />
                      <div>
                        <h3 className="font-sans text-[16px] font-semibold text-ink-900">
                          {meta.label}
                        </h3>
                        <p className="text-[13px] text-ink-400">{meta.description}</p>
                      </div>
                    </div>
                    {connectedAccount && (
                      <span className="pill bg-sage-100 text-sage-700">Connected</span>
                    )}
                  </div>

                  {connectedAccount ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {connectedAccount.platform_avatar_url && (
                          <img
                            src={connectedAccount.platform_avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-[14px] font-medium text-ink-900">
                            {connectedAccount.platform_display_name}
                          </p>
                          <p className="text-[12px] text-ink-400">
                            @{connectedAccount.platform_username}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleImport(connectedAccount.id)}
                          disabled={importing === connectedAccount.id}
                          className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white text-[13px] font-sans font-medium rounded-lg disabled:opacity-50"
                        >
                          {importing === connectedAccount.id ? 'Importing...' : 'Import posts'}
                        </button>
                        <Link
                          href={`/social/import?accountId=${connectedAccount.id}`}
                          className="px-4 py-2 bg-white hover:bg-linen-100 text-ink-700 text-[13px] font-sans font-medium rounded-lg border border-linen-200"
                        >
                          Preview & analyze
                        </Link>
                      </div>
                      {connectedAccount.last_sync_at && (
                        <p className="mt-3 text-[12px] text-ink-300">
                          Last synced {new Date(connectedAccount.last_sync_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : meta.available ? (
                    <a
                      href={`/api/oauth/${id}`}
                      className="inline-flex items-center px-5 py-2.5 bg-ink-900 hover:bg-ink-700 text-linen-50 text-[14px] font-sans font-medium rounded-lg"
                    >
                      Connect {meta.label}
                    </a>
                  ) : (
                    <p className="text-[13px] text-ink-300 font-sans italic">
                      Coming soon
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Privacy note */}
        <div className="observation-sage">
          <h3>Your data, your control</h3>
          <p>
            SelfTrace connects via official OAuth login only. We never ask for
            your password, and we never access accounts you haven&rsquo;t
            explicitly connected. You can disconnect at any time.
          </p>
        </div>

        {/* Existing connect page link */}
        {!loading && (
          <div className="mt-8 text-center">
            <Link href="/connect" className="text-link text-[14px]">
              Or upload a data export instead &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: PlatformId }) {
  const icons: Record<PlatformId, React.ReactNode> = {
    x: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink-900" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink-900" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-600" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  };

  return (
    <div className="w-10 h-10 rounded-xl bg-linen-100 flex items-center justify-center flex-shrink-0">
      {icons[platform]}
    </div>
  );
}

function decodeError(error: string): string {
  const messages: Record<string, string> = {
    access_denied: 'You denied access. No data was collected.',
    missing_params: 'OAuth callback was missing required parameters.',
    invalid_state: 'Invalid OAuth state. Please try connecting again.',
    not_authenticated: 'You must be logged in to connect an account.',
    save_failed: 'Failed to save your connection. Please try again.',
    EXPIRED_TOKEN: 'Your access token has expired. Please reconnect.',
  };
  return messages[error] ?? `Connection error: ${error}`;
}

export default function SocialPage() {
  return (
    <Suspense fallback={null}>
      <SocialInner />
    </Suspense>
  );
}

// ── Privacy statements ────────────────────────────────────────────────────────
// One source for the short privacy lines used across the site, so they stay
// exactly true for whichever build is deployed (see src/lib/features.ts).

import { SOCIAL_CONNECT_ENABLED } from '@/lib/features';

/** One-line statement for the footer, /start and the home hero. */
export const PRIVACY_SHORT = SOCIAL_CONNECT_ENABLED
  ? 'Demo profiles are analysed in your browser. Connecting an X account stores your posts and access tokens on our server.'
  : 'Private by design. Demo profiles are generated and analysed in your browser; nothing you enter is sent to a server.';

/** Paragraph for the home page privacy section. */
export const PRIVACY_HOME = SOCIAL_CONNECT_ENABLED
  ? 'Demo profiles are generated and analysed in your browser, with no sign-in. If you connect an X account, your access tokens and imported posts (their full text and the raw data X returns) are stored in our database, and those posts are analysed on our server. The Privacy page lists exactly what is kept.'
  : 'This version works with fictional demo profiles, generated and analysed in your browser. Nothing you type or load is sent to a server, nothing is kept after you reload or close the tab, and there is no sign-in.';

/** Paragraph for /how-it-works. */
export const PRIVACY_HOW_IT_WORKS = SOCIAL_CONNECT_ENABLED
  ? 'Demo profiles are generated and analysed entirely in your browser, and nothing about them is sent to a server. Connecting an X account works differently: your access tokens and the posts you import (their full text and the raw data X returns) are stored in our database, and the analysis of those posts runs on our server. The Privacy page lists exactly what is stored.'
  : 'All analysis runs in your browser, on fictional demo profiles that are also generated there. Nothing you type or load is sent to any server, and it is gone when you reload or close the tab.';

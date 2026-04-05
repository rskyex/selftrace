# Platform Connectors — TODO

## YouTube
- [ ] Register OAuth 2.0 credentials in Google Cloud Console
- [ ] Enable YouTube Data API v3
- [ ] Implement `youtube.ts` connector:
  - Auth URL: `https://accounts.google.com/o/oauth2/v2/auth`
  - Token URL: `https://oauth2.googleapis.com/token`
  - Scopes: `youtube.readonly`
  - Fetch profile: `GET /youtube/v3/channels?part=snippet&mine=true`
  - Fetch posts: `GET /youtube/v3/search?forMine=true&type=video&part=snippet`
  - Map video titles + descriptions to post content
- [ ] Add `youtube` to registry.ts
- [ ] Add OAuth route at `/api/oauth/youtube/`
- [ ] Add callback route at `/api/oauth/youtube/callback/`
- [ ] Add env vars: `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`

## TikTok
- [ ] Register app in TikTok Developer Portal
- [ ] Implement `tiktok.ts` connector:
  - Auth URL: `https://www.tiktok.com/v2/auth/authorize/`
  - Token URL: `https://open.tiktokapis.com/v2/oauth/token/`
  - Scopes: `user.info.basic`, `video.list`
  - Fetch profile: `GET /v2/user/info/`
  - Fetch posts: `GET /v2/video/list/`
  - Map video descriptions/captions to post content
- [ ] Add `tiktok` to registry.ts
- [ ] Add OAuth route at `/api/oauth/tiktok/`
- [ ] Add callback route at `/api/oauth/tiktok/callback/`
- [ ] Add env vars: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`

## Instagram
- [ ] Register app in Meta Developer Portal
- [ ] Implement `instagram.ts` connector:
  - Use Instagram Basic Display API or Graph API
  - Auth URL: `https://api.instagram.com/oauth/authorize`
  - Token URL: `https://api.instagram.com/oauth/access_token`
  - Scopes: `user_profile`, `user_media`
  - Fetch profile: `GET /me?fields=id,username`
  - Fetch posts: `GET /me/media?fields=id,caption,timestamp,media_type,like_count`
  - Map captions to post content
- [ ] Add `instagram` to registry.ts
- [ ] Add OAuth route at `/api/oauth/instagram/`
- [ ] Add callback route at `/api/oauth/instagram/callback/`
- [ ] Add env vars: `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`

## General
- [ ] Add token refresh cron job or middleware for proactive token renewal
- [ ] Add disconnect/revoke account flow
- [ ] Add rate limit handling with retry + backoff for each platform
- [ ] Add incremental sync (only fetch posts newer than last sync)
- [ ] Add data export/delete for GDPR compliance

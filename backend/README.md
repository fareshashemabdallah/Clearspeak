# ClearSpeak — Natural speech AI connection

The GitHub Pages app is ready to use this service, but genuine AI rewrites will not run until you deploy this private-key backend. The Worker starts **disabled** to prevent accidental API charges.

## Setup (pilot only)

1. Create a Cloudflare Workers account.
2. Deploy the `backend/` directory with Wrangler: from that folder run `npx wrangler deploy`.
3. Store your model API key as a Cloudflare secret using `npx wrangler secret put OPENAI_API_KEY`. **Never paste a key into GitHub or ClearSpeak's public files.**
4. Set a strict spending budget / alerts in your model-provider account, and protect your Worker with authentication or an access gateway before broad public release. The included 5-per-minute per-location IP limiter is not a production-grade usage quota.
5. Set `COACH_ENABLED` to `true` in your Worker configuration and redeploy.
6. Copy the Worker's HTTPS public URL into `coach-config.js` as `window.CS_COACH_API_URL` (without `/rewrite`).
7. Test `Help me say it naturally` from the live GitHub Pages site. The model is set to `gpt-6-luna` by default, and can be changed in Worker settings.

The app only sends **text** to this endpoint. Voice dictation uses browser/OS facilities where supported; some providers may process it remotely. The Worker does not explicitly save messages, but model and hosting providers may retain operational logs. Publish privacy disclosures before collecting consumer recordings.

The server returns one natural rewrite, short memory cues and one delivery tip, not pronunciation scoring. Azure pronunciation assessment is a separate integration.

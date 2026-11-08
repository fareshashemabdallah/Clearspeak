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

## Conversation practice

The same Worker now also supports `POST /conversation` for **Start a conversation**. It accepts a brief situation (`meet`, `call`, `chat`), the latest user line and at most six recent roleplay messages. It responds with a fictional counterpart's reply, one human-sounding follow-up suggestion, and a short coaching tip. It uses the same secret, disabled-by-default switch, origin check and rate-limiting binding as `/rewrite`. No additional public key is needed.

Without an activated Worker and `coach-config.js` HTTPS URL, the website uses a clearly labelled, limited **guided preview** with prewritten fictional replies. Guided replies are not an AI evaluation and should not be presented as live intelligence. The conversation text stays in the browser tab in this preview; with the Worker enabled, typed messages are sent to your configured service for processing. Add privacy disclosures, authentication and per-user quotas before a public AI launch.

## Situation-aware guidance

The Worker also includes `POST /conversation-plan`, taking `{ "situation": "...", "channel": "meet|call|chat" }`, and returns one opener, a shorter alternative, two potential follow-up prompts, and a natural closing. The `/conversation` roleplay accepts an additional situation string, uses it to guide fictional responses, and stays subject to the same disabled-by-default switch, IP rate limit and origin restriction. Do not activate it publicly without additional authentication, user-specific quotas, spending controls and appropriate privacy disclosures.

The browser shows limited local suggestions until the Worker URL and secret are configured; no public client-side API keys are needed.

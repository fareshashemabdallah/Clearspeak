# ClearSpeak subscriptions — staged implementation (November 2026)

## Implemented in the public app

- **Starter:** $2.99/month, 100 AI-generated replies.
- **Plus:** $4.99/month, 500 replies.
- **Power:** $7.99/month, 1,500 replies.
- Same core features and model quality for every plan. One generated AI reply or rewrite (including a requested revision) consumes one unit; non-AI local preview and offline practice use zero.
- `plans.js` + `plans.css` provide a mobile-friendly Plans modal with transparent pricing, plan comparison, a device-only usage *preview*, and the proposed reminder text at 80% and 100%.
- The UI **does not sell, activate, bill, authenticate, or grant a subscription**, and the device-only usage count **must not** be used as an access-control or billing record. It cannot reliably cover multiple devices.
- On-device suggestions stay available for free and remain clearly marked as not AI.

## Required before paid launch — not implemented

1. Secure sign-in and durable account identity. Never use IP address, editable localStorage, or a client-supplied plan as the subscription identity.
2. Billing provider + verified payment webhook or native in-app purchase receipt validation as appropriate for the distribution channel. Keep Apple/Google purchase rules in mind if distributing through app stores; GitHub Pages itself is a website, not an App Store subscription service.
3. Authoritative subscription records (account ID, product, status, period start/end, monthly limit, replies used) in a server-side transactional store (e.g. Cloudflare D1 or Durable Objects).
4. Protect every paid AI endpoint (`/rewrite`, `/conversation-plan`, `/conversation`, `/message-coach`) with authentication and an atomic quota reservation before calling the AI provider. Count **successful** generated replies only; roll back failed calls and prevent concurrent requests exceeding the limit.
5. Return an authenticated `GET /me/usage` result (plan, used, limit, renewal date, status). The client must use it to show authoritative usage. Upgrade, cancellation, renewal, refunds and grace periods must be driven by verified billing events.
6. Show a gentle 80% prompt; at 100% respond with a structured quota response and offer upgrade / wait. No overage charges without explicit user approval. Do not automatically renew a promotional trial into a paid plan without legally required clear consent and disclosure.
7. Determine regional price display, VAT/GST handling, consumer notices, financial reporting, consent, deletion/export and privacy policy. Set model spend caps, abuse protection, and monitor unit economics, especially voice.
8. Test month-boundary renewals, concurrent requests, billing grace period, provider outages, failed payments, account/device switches, refunds, and cancellation.

The existing AI Worker remains **disabled** by default and has no live billing credentials. Do not describe the three plans as purchasable until these steps are complete.

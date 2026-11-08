# ClearSpeak — Speak with Impact

## Current experience (November 2026)

The main `index.html` is the **English-first lightweight ClearSpeak coach**. It opens with one message field and a guided sequence: improve the wording → say it → review → repeat. The `training` area offers three short daily exercises, not a full menu of tools. The previous bilingual 28-day experience remains archived in `training.html` for future development.

**Before/after listening:** `voice.js` dispatches a local recording event; `growth.js` displays first and second attempts side by side inside the reflection screen. Recordings are kept only in the current tab, are not uploaded by the app, and are cleared when a new thought starts. `growth.js` also shows practice days over the last week, stored locally in the browser.

**Important accuracy limitation:** Current writing guidance is heuristic and voice playback is self-review; the app does not yet use Azure or another server-side pronunciation assessment service. Optional browser speech recognition can involve the browser vendor's online service and does not measure phoneme accuracy. No clinical claims are made.

A lightweight **28-day communication training app with five additional Speaking with Influence labs**, with English and Arabic examples, a practice timer, optional voice recording and playback, dictation where supported, locally saved progress, and transparent text-based coaching feedback.

It is a **static website**, so no server, accounts, database, or API key is required. The app is intended for GitHub Pages.

## Deploy with GitHub Pages

1. Sign in to GitHub and create a **new repository** named `clearspeak-trainer` (keep it **separate from Dabberna**). On GitHub Free, choose **Public** for free GitHub Pages hosting.
2. Extract `ClearSpeak_GitHub_Pages_Ready.zip`. Upload **all files from the archive's root** (including `index.html`, `styles.css`, `trainer.js`, `influence.js`, `manifest.webmanifest`, and `icon.svg`) into the repository root on the `main` branch. Commit the files.
3. In the repository, open **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
4. Open your GitHub Pages URL once deployment completes, typically `https://YOUR-USERNAME.github.io/clearspeak-trainer/`. To use voice recording on iPhone, open it in **Safari**, not the ChatGPT file preview. Allow microphone access on request. Add to your Home Screen if desired.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## How to use

1. Start at Day 1 or choose another day under the 28-day programme.
2. Read the visible worked example and say the answer aloud.
3. Optionally record it with **Record → Stop → Play**, or dictate into the practice text box if browser speech recognition is supported. You can always type your response.
4. Use **Assess my attempt** for word-count, possible filler, and sentence-structure **hints**. These are simple rules, *not* AI judgments of meaning, medical assessments, pronunciation, voice volume, or emotional confidence. If the tool misses a reason or recommendation, trust the actual meaning over the automated hint.
5. Use the practice timer and save your daily scorecard. Export progress periodically from My Progress.

## New: Speaking with Influence lab

Open **Influence lab** (English) / **مختبر التأثير** (Arabic) in the top navigation. The extra five self-guided labs are:

1. **Voice modulation and pacing:** meaningful pauses, comfortable speed, natural intonation (not simply higher volume).
2. **Minto Pyramid Principle:** answer first, one to three reasons, evidence when available, and a clear recommendation.
3. **Congruent body language:** comfortable posture, culturally appropriate eye contact, and natural gestures.
4. **Structured storytelling:** one true (or explicitly hypothetical) situation, challenge, response, and lesson.
5. **Empathic bridge-building:** recognize concern, name shared interest, suggest a practical solution.

Each lab includes an *overexplained example*, a clearer model, precise step-by-step instructions, timer (20/30/60/90 seconds), optional in-browser recording/playback, example text-to-speech when supported, user practice text, a self-rating, targeted text-based coaching, and local save / export. The app does **not** infer eye contact, vocal pitch, emotion, persuasion success, or pronunciation from a typed transcript. Your ratings reflect your own observation. The five lab ratings are stored locally under a separate key and can be exported separately in the Influence lab; **the original 28-day progress export does not include Influence lab data**.

For real use on an iPhone, open the deployed HTTPS site in Safari. A downloaded HTML file opened in a preview may disable interactivity and microphone. Text-to-speech depends on device-installed voices.


## Voice and privacy

- **Microphone recording:** performed within your browser when MediaRecorder is supported and access is allowed over HTTPS. Audio playback and downloading may be offered, but recordings are **not uploaded or preserved as part of saved progress**.
- **Speech-to-text:** browser-dependent. When used, some browsers may send audio to their speech recognition service, governed by the browser/provider. This is **not** a guarantee of offline transcription.
- **Your written notes, ratings, and automated text assessment history** are stored in browser localStorage (if enabled), not uploaded by this app. They may disappear if you clear browser storage or change device. Use the Export feature to make a backup.
- The **code and hosted site are public** if published through a public GitHub Pages repository. Don't commit sensitive personal data to the repository. Your locally entered exercises are not automatically committed to GitHub.
- On iPhone, some versions of Safari may not support browser speech recognition; in that case record and listen back, or use the iOS keyboard's dictation microphone to enter text. The microphone controls never need to be used to complete a lesson.
- This tool provides communication skills practice, not diagnosis or treatment. Progressive word-finding issues in more than one language merit clinical assessment; sudden speech difficulty should be evaluated urgently.

## Editing and maintenance

- `index.html` — interface structure
- `styles.css` — theme and responsive layout
- `trainer.js` — lessons, translations, assessment logic, timer, audio controls, and local progress
- `influence.js` — bilingual Speaking with Influence labs, optional recording, self-rating, coaching, and separate local progress
- `manifest.webmanifest` and `icon.svg` — installable app identity
- `.nojekyll` — ensures GitHub Pages serves all static files directly

All app functionality runs client-side. If advanced AI feedback based on meaning or voice acoustics is needed later, a **separate secure backend** will be necessary to protect API keys and users' recordings; do not put API secrets in this repository.
## Natural spoken-language coaching (November 2026)

The main button is now **Help me say it naturally**. The home page supports typed thoughts or speech dictation where the browser allows it, then a natural-sounding suggested message, with an optional speaking exercise. There are no new dashboards.

- On GitHub Pages today, a **basic local suggestion** remains available without a server. It is explicitly identified as non-AI.
- Genuine personalized AI suggestions are implemented as an **optional backend integration**. The public client code is in `coach.js` and its public URL is in `coach-config.js` (currently blank). The secure Cloudflare Worker scaffold and activation steps are in `backend/README.md`.
- The Worker is disabled by default and requires a private model API key, deployment, spend controls, and production-grade authentication before a public paid launch. **Never put a secret API key in public GitHub Pages JavaScript.**
- Pronunciation scoring remains a **separate, not-yet-connected** specialized speech-analysis service. Audio replay is not the same as automated articulation assessment.

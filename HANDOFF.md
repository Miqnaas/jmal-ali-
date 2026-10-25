# Tahreek Sound Design — implementation handoff

The supplied V4 prototype has been implemented as a lightweight Vite site with vanilla JavaScript, shared bilingual content, self-hosted fonts and original CSS sound artwork. Arabic is the first-visit default. The approved V4 curriculum, audience, access benefits and 14-section conversion sequence are retained. The README-only Git checkout was used; no worktree was created.

## Run and build

Requires Node.js 20.19+ or 22.12+ (validated on Node 24.19), npm and Chromium for browser tests.

```sh
cd /workspace/jmal-ali-
npm ci --cache /tmp/tahreek-npm
npm run dev -- --port 5173
```

In a second terminal:

```sh
npm run lint
npm test
npm run build
npm run preview -- --port 4173
```

`npm test` expects the development server on port 5173, or set `TEST_URL`. It uses `/usr/bin/chromium` when present. Else install the Playwright browser with `npx playwright install chromium`; `CHROMIUM_PATH` can override the executable. Production output is `dist/`; deploy its contents to a static host when approved. No public deployment has been performed.

## Files

- `src/content.js`: complete AR/EN dictionaries and editorial refinements to V4 copy.
- `src/main.js`: reusable section rendering, original sound-study artwork, language/currency state, native accordions, accessible modals and integration logic.
- `src/config.js`: all commerce, campaign, media and policy settings. Never add credentials here: it is public browser code.
- `src/base.css`: retained V4 component behavior, layout and reduced-motion foundations.
- `src/styles.css`: Tahreek art direction and responsive refinements.
- `public/assets/`: original supplied Tahreek logo/course cover, extracted from V4, and an original favicon. No reference-site media or source was copied.
- `screenshots/`: full-page and hero AR/EN desktop/mobile images, callback states, test evidence.
- `tests/browser.mjs`: repeatable browser and campaign-boundary checks.

## Configuration

Edit `CONFIG` in `src/config.js`, then rebuild. All missing values are intentionally blank.

| Key | Expected value / behavior |
| --- | --- |
| `checkoutEGP`, `checkoutUSD` | Client-verified official Nazamly HTTPS URLs, one per currency. Every enrollment CTA uses the selected currency. Empty links open a clear unconfigured checkout modal. |
| `prices` | Separate EGP and USD base/introductory prices; not an FX conversion. Defaults: 3,500 → 700 and 65 → 13. |
| `campaignStart` | Client-confirmed ISO timestamp with timezone. No date has been invented. |
| `campaignDays` | 5. Offer is active at the start timestamp and ends exclusively 120 hours later. Display dates use Africa/Cairo. |
| `leadEndpoint` | Public HTTPS JSON POST endpoint, with CORS permitting the landing-page origin. Must accept the payload below. |
| `introVideo` | Approved direct video-file path/HTTPS URL. Native controls, metadata-only preload, no autoplay. Not a YouTube iframe URL. |
| `beforeAudio`, `afterAudio` | Both approved, matched real audio file paths/HTTPS URLs. Native controls and version switching are enabled only when both exist. |
| `instructorPortrait` | Approved image path/HTTPS URL. Otherwise an explicitly labeled typography placeholder is shown. |
| `projectStills` | Up to five approved image paths, in gallery order. Replaces illustrative studies. Obtain usage approval first. |
| `ratingVerified` | Set true only after receiving evidence for 4.9/5. Defaults to an adjacent pending-verification label. |
| `experienceVerified` | Evidence for 7+ audio years, real client work and 500+ students across broader teaching. Does not imply 500 course enrollments. |
| `refundTermsVerified`, `refundTermsURL` | Confirm the actual published 14-day terms before enabling the verified policy and link. No unconditional guarantee is offered by the preview. |
| `privacyURL` | Published privacy policy URL. Adds a footer link. Required before collecting real personal data. |
| `canonicalURL`, `socialImage` | Final approved public URL and social image. Canonical/image tags are omitted until configured. |

With no campaign dates, the introductory price is visibly identified as proposed and inactive. Before the real campaign starts and after it expires, the **base price** is displayed. The UI updates on page load and every 30 seconds while open; Nazamly must enforce pricing independently. There is no artificial countdown.

## Callback API contract

```json
{
  "name": "Visitor name",
  "phone": "+201012345678",
  "website": "",
  "source": "Tahreek Sound Design Landing Page",
  "locale": "ar",
  "submitted_at": "ISO timestamp"
}
```

A successful 2xx response means the backend accepted the request; other statuses and network/15-second timeout errors show the localized failure state and allow retry. The button is disabled while sending. The client validates name, international phone and optional HTTP(S) website. Arabic phone digits are normalized. A hidden honeypot blocks basic autofill spam; the production endpoint must additionally validate, rate-limit, secure storage and handle abuse. Do not put CRM secret keys in the browser. Use the privacy policy and appropriate consent process before launch. Blank endpoint: no request is made and no success is simulated.

The modal supports name-first focus, Tab/Shift+Tab trapping, Escape/backdrop/close, background inertness, focus restoration, field errors and live status. Native details/summary support keyboard curriculum and FAQ interaction. Language switching changes document direction, all copy/forms/errors and SEO metadata, with persisted language preference. There is no autoplay audio. Fonts are bundled locally with their upstream licenses in the npm packages.

## Verification

- `npm run lint`: JavaScript syntax checks passed (not a full ESLint ruleset).
- `npm run build`: production Vite build passed.
- `npm test`: **92 assertions passed**, no uncaught runtime errors.
- AR/EN checked at 1440, 1024, 768, 390 and 360 pixels: no horizontal document overflow; logo images load.
- Checked locked section order, complete FAQ, RTL/LTR and metadata, language persistence, mobile navigation, keyboard FAQ, curriculum, currency and sticky prices, all visible purchase CTAs, callback focus trap/validation/close/focus restoration and honest no-endpoint state.
- Configured callback loading/success/server-error and currency-specific checkout routing were tested using intercepted test responses. These do **not** establish connectivity to a real CRM or Nazamly.
- Configured media controls/source switching were exercised; no genuine client audio/video has been supplied, so content/playback quality awaits real media.
- Campaign rendering tested for active, scheduled and expired states, plus exact start/end boundaries.
- axe automated WCAG A/AA audit in AR and EN, page and callback open: **zero detected violations** after fixing callback-note and help-button contrast. Evidence: `screenshots/accessibility-results.json`. This is an automated check, not a complete accessibility certification.
- Desktop/mobile and callback screenshots were captured and reviewed. Refinements included shorter English heading, corrected media fallback, CSS arrows instead of missing font glyphs, different sound-study compositions and stronger text contrast.

## Required before public launch

1. Official Nazamly EGP/USD links and confirmed payment/access behavior.
2. Real campaign start timestamp and matching Nazamly prices/offer expiration.
3. Approved intro video, matched before/after recordings, instructor portrait, and real portfolio stills. Current visual studies are labeled illustrations, not client projects.
4. Evidence for rating, instructor experience and broader student count. Real student reviews and publication consent; no invented quotes or identities have been added.
5. Published refund terms and privacy policy; working secured callback service. Verify its real success/error flow after configuration.
6. Final public canonical/social image; analytics and advertising pixels are not installed or active.

The reference URL returned HTTP 403 in this environment. Implementation followed the master document's locked section map, with original Tahreek visual treatments. Browser validation used Chromium; Safari/iOS/Firefox, real payments, real lead delivery and real media still need launch acceptance testing. This is a working development preview, not a live sales checkout.

## GitHub Pages compatibility fix

The editable Vite HTML entry is now `app/index.html`. `npm run build` emits `dist/` and synchronizes the compiled `index.html` and managed `assets/` into the repository root. Those root outputs are committed intentionally so GitHub Pages configured for **main / (root)** serves a runnable page, without requiring Node or a build workflow on GitHub. `.nojekyll` preserves static assets. Edit source files, not the generated root HTML/assets. `.static-assets.json` records managed outputs so repeat builds remove only obsolete generated assets.

Vite uses relative production URLs; application logos/media resolve under the deployed document base. This supports the project URL `/jmal-ali-/` as well as a domain root. `vite.config.js` keeps the development HTML entry separate and resolves the shared source directory.

Regression check: serve `dist/` under a local `/jmal-ali-/` path, then run `node tests/static-pages.mjs` (`STATIC_URL` overrides its default test URL). The check verifies 14 rendered sections, images/fonts without failed requests, Arabic/English, callback, currency and curriculum. The live GitHub Pages URL could not be fetched from this cloud network because its proxy returned HTTP 403; check the site's GitHub Pages deployment after the commit is published.

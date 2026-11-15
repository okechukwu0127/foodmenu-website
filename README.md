# Liberq website (v5 — clean dark design)

React 18 + Vite 5 + Lenis (smooth scroll). Plain CSS.

Motion: `src/lib/motion.js` fades/slides every `data-sa` element in and out with the scroll; `src/components/Sparkles.jsx` draws the sparkles; the hero phone (tilt, bounce, scroll-spin) is in `src/components/Top.jsx`; the pinned How-it-works section is `HowPinned` in `src/components/Story.jsx`.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
```

## Edit text
All copy is in `src/content.js`. Fields written as `{ restaurant: '…', partner: '…' }`
change with the "I run a restaurant / I want to earn" switch in the top bar.
Link straight to a view with `/#restaurants` or `/#partners`. Force a background look with `?look=aurora|dusk|noir`.

## Swap media
| What | File(s) | Where it's set |
|---|---|---|
| Hero phone recording | `public/assets/video/app-demo.mp4` + `.webm` | `hero.video` |
| Onboarding carousel (How it works, step 01) | `public/assets/screens/onboarding-1..3.webp` | `how.steps[0].screens` |
| AI waiter recording | `public/assets/video/ai-waiter.mp4` + `.webm` | `ai.video`; step timings in `ai.beats[].at` |
| Background looks | `public/assets/video/heroA/B/C` | `looks` |

## Forms
- **Join the beta** → `POST {VITE_API_BASE_URL}/api/v1/beta-testers` (foodMenuAPI identity-service).
- **Book a demo / Apply now** → `POST {VITE_API_BASE_URL}/api/v1/demo-requests` (saved as a WebsiteLead and emailed to `LEADS_NOTIFY_EMAIL` on the backend).
- Both forms are emailed to the team inbox set in the backend's `LEADS_NOTIFY_EMAIL`.
Copy `.env.example` to `.env` and fill in. Restart `npm run dev` after editing `.env`.

## Structure
```
src/content.js            all text, numbers and media paths
src/styles.css            colours, layout, motion
src/components/Top.jsx    nav + audience switch, hero (phone follows mouse & scroll)
src/components/Story.jsx  problem, how it works, brands, AI waiter
src/components/Dashboard.jsx
src/components/Bottom.jsx 06 calculators & plans, forms, footer
src/lib/api.js            beta + lead form calls
```

# Progress

## Done
- Phase 1: Vite + React + Tailwind + Vitest skeleton, sample data loaded.
- Phase 2: `calcLandedCost`, `categoryBreakdown`, `auditBills` with 13 passing tests covering the expected results table (initial and late-bill), duplicate, not-in-quote, above-quote, duty mismatch, approve and dispute.
- Phase 3: cost cards, money at risk line, bill timeline, flag list, duty-checked line, breakdown bars.
- Phase 4: Dispute, Approve, Simulate new bill (idempotent, disables after use), highlight animation, Reset demo.
- Phase 5: demo path walked three times each at 1440x900 and 1920x1080 on both `npm run dev` and `npm run preview`, using a headless Chrome script. No scrolling, no console errors, reset restores initial state.
- Tier 3: "Draft dispute email" modal (string template, nothing sent).
- Polish pass: shared `Badge` component, keyboard focus rings, Escape to close the email draft with focus returned to its link, reduced-motion handling, flag rows keep their height when buttons become a badge, empty state for no flags, layout stacks on narrow screens (checked at 390px wide).

- Restyle: Ramp palette (lime #E4F222, near-black #1F1F1F, white on a warm off-white page) with readability first. Flat white cards with hairline borders, no gradients or glass, larger text, darker secondary text, dark bars. Lime is used only as an accent on dark surfaces and as a soft highlight. The actual cost number counts up when it changes.

## Cut
- Second shipment and shipment list page (Tier 3). Not built.

## Next
- Nothing required.

## Decisions
- Repo was empty, so scaffolded by hand instead of using a template (fewer leftover files).
- Tailwind v4 via the `@tailwindcss/vite` plugin: no tailwind or postcss config files needed.
- Working branch: `main`.
- Besides `bills` and `flagStatus`, App holds one piece of UI state, `selectedBillId`, for "click a bill to highlight its flags". Flags and costs are still fully derived.
- Highlight animation needs no state: the late bill row and its flag animate on mount, and the actual cost number is re-keyed on the total so it replays when the total changes.
- Dispute/Approve buttons are replaced by the status badge once clicked. Reset demo is the way back.
- Duty mismatch `amountAtRisk` is the absolute difference between billed and expected duty (spec did not say).
- Quote lines are matched by `chargeType` only.
- Timeline warning marker is the word "FLAGGED" in amber; it clears when all of a bill's flags are approved.
- `money()` shows whole dollars without cents ($420) and cents only when needed.
- Earlier glass and sage reference-image passes were replaced for readability.
- The on-screen sample-data footer was removed at the team's request. The README still states it is a prototype on sample data.
- No Ramp logo, wordmark or name is used in the UI, only the colours.
- The side rail shows only the logo mark and one active view icon. No extra nav icons were added, since there are no other pages.
- The email draft is rendered on `document.body` because a blurred glass ancestor would trap a fixed overlay.
- Font is the system stack (SF Pro on Apple devices); Inter from Google Fonts is the fallback elsewhere.
- Favicon is `public/favicon.svg` (lime tile with the box mark).
- `docs/demo.gif` was recorded from the production build with a scripted headless browser; the grey dot in it is a drawn pointer, not part of the app.
- Deployed to Vercel from the CLI at https://asvc.vercel.app. Re-run `vercel deploy --prod` after changes.
- Browser checks were scripted with headless Chrome from outside the repo, so no test-browser dependency was added to the project.

## Resume notes
- `npm install`, `npm run dev`, `npm test`. Logic is in `src/lib`, UI in `src/components`, state in `src/App.jsx`.

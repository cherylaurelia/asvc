# Progress

## Done
- Phase 1: Vite + React + Tailwind + Vitest skeleton, sample data loaded.
- Phase 2: `calcLandedCost`, `categoryBreakdown`, `auditBills` with 13 passing tests covering the expected results table (initial and late-bill), duplicate, not-in-quote, above-quote, duty mismatch, approve and dispute.
- Phase 3: cost cards, money at risk line, bill timeline, flag list, duty-checked line, breakdown bars.
- Phase 4: Dispute, Approve, Simulate new bill (idempotent, disables after use), highlight animation, Reset demo.
- Phase 5: demo path walked three times each at 1440x900 and 1920x1080 on both `npm run dev` and `npm run preview`, using a headless Chrome script. No scrolling, no console errors, reset restores initial state.
- Tier 3: "Draft dispute email" modal (string template, nothing sent).
- Polish pass: shared `Badge` component, keyboard focus rings, Escape to close the email draft with focus returned to its link, reduced-motion handling, flag rows keep their height when buttons become a badge, empty state for no flags, layout stacks on narrow screens (checked at 390px wide).

- Restyle: Apple-style liquid glass dashboard. Translucent blurred panels over a soft colour field, floating pill toolbar, one blue accent (#0066cc), Apple system red, orange and green for state, system font stack, 400/600/700 weights only. The actual cost number counts up when it changes. Tokens and the `.glass` recipe live in `src/index.css`.

## Cut
- Second shipment and shipment list page (Tier 3). Not built.

## Next
- Nothing required. Optional: deploy to Vercel (default Vite settings, no config needed).

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
- Look and tokens follow the open-source `rukkiecodes/claude-apple-design-system` reference (blue accent, pill buttons, hairlines), plus glass panels at the team's request. That reference avoids shadows; the glass panels use a soft one so they read as lifted. An earlier lime and black pass was replaced.
- The email draft is rendered on `document.body` because a blurred glass ancestor would trap a fixed overlay.
- Font is the system stack (SF Pro on Apple devices); Inter from Google Fonts is the fallback elsewhere.
- Empty inline favicon added so the page loads with no console 404.
- Browser checks were scripted with headless Chrome from outside the repo, so no test-browser dependency was added to the project.

## Resume notes
- `npm install`, `npm run dev`, `npm test`. Logic is in `src/lib`, UI in `src/components`, state in `src/App.jsx`.

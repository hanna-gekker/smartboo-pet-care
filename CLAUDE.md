# SmartBoo — notes for Claude

Read this file and `docs/PRODUCT.md` before every task. If a task conflicts with them, ask first.

## Product

SmartBoo is an iOS app for US pet owners: everything about your pets in one place. The assistant **Boo** takes vet papers (photo, PDF), events and questions by voice or text, files everything into each pet's folder, sets reminders, and makes records quick to share (PDF via the iOS share sheet).

- Tab bar: a floating black capsule **Today · Schedule · Pets** + the round **Boo button** to its right. Boo opens as a bottom sheet, not a chat.
- First-version screens: Welcome, Today, Schedule, Boo (bottom sheet), Pet folder (+ pet list), Share.
- Main screen: **Today** (first tab, Figma "Today · V17"): Boo card, Next up, Coming up, Your pack, Done today.
- Main flow: a paper → Boo creates the pet and its vaccines → review card "Looks right" → reminder.
- Boo's rules: never makes things up; simple records are saved right away with Undo, important ones (documents, meds, symptoms, plans, a new pet) go through a review card; never guesses which pet; no diagnoses or doses.
- Until the demo (Wed Dec 2): no household sharing, no accounts, no backend. Data lives on the phone behind a single storage module. The only server piece is one function for Boo.
- Components to start with: TabBar (with the Boo button), TaskRow, PetAvatar, BooSheet (bottom sheet), Card and Button.
- Bundle ID: `com.hannagekker.smartboo`. UI copy and sample data are in English.
- Full details: `docs/PRODUCT.md`.

## Stack

- Vite + React + TypeScript + Tailwind, mobile-first. Tailwind takes its values from our tokens, not from its default palette (no `bg-red-500` and the like).
- App: Capacitor 8 → iOS (TestFlight); web version on Cloudflare Pages. Android is not a focus.
- Boo's server function: Cloudflare Pages Functions (`functions/api/boo`); the AI key is a Cloudflare secret.
- Data on the phone, always through `src/data/store`. For now the store uses the browser's localStorage; the next step after adding Capacitor switches it to `@capacitor/filesystem`.
- iOS plugins via Swift Package Manager only, never CocoaPods.
- Storybook for components.
- Architecture details: `docs/ARCHITECTURE.md`.

## Commands

Run them in the project folder. The first time, run `npm install`.

- `npm install` — downloads the libraries the app needs into `node_modules/`. Run again after `package.json` changes.
- `npm run dev` — starts the app on your computer at http://localhost:5173. Changes show up right away; stop it with Ctrl+C. In the Claude app it starts from the Browser panel ("app" in `.claude/launch.json`).
- `npm run build` — checks the TypeScript code for errors, then makes the finished app in `dist/`. This is what goes to the iPhone (Capacitor) and to Cloudflare Pages.
- `npm run preview` — opens the finished app from `dist/` to check the build before shipping.
- `npm run lint` — looks for common mistakes in the code (oxlint).
- `npm run ios` — builds the app and copies it into the iOS project (`ios/`, Capacitor). Then open it in the iPhone simulator from Xcode or the Claude simulator panel.

When I write «онови iOS» / «update iOS»: run `npm run ios`, build the Xcode project `ios/App/App.xcodeproj` (scheme App) and launch it in the iPhone 17 Pro simulator, then show me a screenshot.

Testing data: the first launch loads sample pets (Rocky, Milo, Cleo, Tank). Settings → "Start fresh" shows the real first launch (Welcome); "Load sample pets" brings them back. Boo is faked in `src/lib/boo.ts` until the Boo spike.

## Design

- Mockups and Variables live in Figma (file "Smartboo - Pet care app": screen Today · V17, page Design system).
- Tokens come from the Figma Variables collections "SmartBoo · Primitives" (raw colors), "SmartBoo · Color" (roles, Light and Dark, pointing to primitives) and "SmartBoo · Layout" (spacing, radii, sizes, fonts). The "Legacy · …" collections are an archive — ignore them.
- How tokens get into code: Figma → `design/figma-variables.json` (raw export, as is) → `npm run tokens` → `tokens.json` (W3C DTCG) → `src/styles/tokens.css` (Style Dictionary). CSS names are the Figma names: `accent/primary` → `--accent-primary`.
- To update tokens: change them in Figma, re-run the export, replace `design/figma-variables.json`, run `npm run tokens`. Never edit `tokens.json` or `tokens.css` by hand, and never rename tokens that come from Figma.
- Components use the semantic tokens (`--surface-*`, `--text-*`, `--accent-*`…), not primitives like `--blue-700`. Text and icons on an `accent/primary` fill use `text/on-accent`.
- `src/styles/legacy-tokens.css` holds the early teal colors the screens still use until step 07 (P6). Don't add to it.
- Colors, spacing, radii and fonts only through CSS variables. No hex values in components.
- Text contrast at least 4.5:1 (3:1 for large text and icons), in both themes.
- No made-up copy: UI texts come from `docs/PRODUCT.md` or the Figma mockups. If a text is missing, ask me.
- `design/` holds early HTML sketches — don't touch them. The one exception: `design/figma-variables.json`, the raw Variables export from Figma, is replaced with each new export.
- Mobile UI rules: works from 360px wide, checked at 390px; safe areas via `viewport-fit=cover` and `env(safe-area-inset-*)`; touch targets at least 44px; no hover-only states; no text selection or tap highlight on buttons; the page never scrolls sideways (swipeable rows like chips and Your Pack are fine); light and dark themes follow the phone.

## Working with me

- I'm a designer and this is my first app. Explain in plain words, one step at a time.
- Chat with me in Russian. Code, files, docs and commits are in English (the repo is a public portfolio).
- Plan first, then wait for my "ok".
- After each step, tell me what to check and where (which screen, which file).
- Don't change `README.md`, `docs/` or `design/` unless the task is about them.

## Git

- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), in English, only after my "ok".
- `main` is the stable version. Each change gets its own branch and a pull request into `main`.
- Never push or merge without my "ok".
- No passwords, API keys or access tokens in the repo. The AI key lives only as a Cloudflare secret; `.env` files are ignored. Real vet documents for testing Boo stay in `boo-tests/` (ignored) and never get committed.

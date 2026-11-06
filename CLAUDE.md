# SmartBoo — notes for Claude

Read this file and `docs/PRODUCT.md` before every task. If a task conflicts with them, ask first.

## Product

SmartBoo is an iOS app for US pet owners: everything about your pets in one place. The assistant **Boo** takes vet papers (photo, PDF), events and questions by voice or text, files everything into each pet's folder, sets reminders, and makes records quick to share (PDF via the iOS share sheet).

- Tab bar: **Today · Boo · Pets**. Boo opens as a bottom sheet, not a chat.
- First-version screens: Welcome, Today, Boo (bottom sheet), Pet folder (+ pet list), Share.
- Main flow: a paper → Boo creates the pet and its vaccines → review card "Looks right" → reminder.
- Boo's rules: never makes things up; simple records are saved right away with Undo, important ones (documents, meds, symptoms, plans, a new pet) go through a review card; never guesses which pet; no diagnoses or doses.
- Until the demo (Dec 1): no household sharing, no accounts, no backend. Data lives on the phone behind a single storage module. The only server piece is one function for Boo.
- Bundle ID: `com.hannagekker.smartboo`. UI copy and sample data are in English.
- Full details: `docs/PRODUCT.md`.

## Stack

- Vite + React + TypeScript + Tailwind, mobile-first.
- App: Capacitor 8 → iOS (TestFlight); web version on Cloudflare Pages. Android is not a focus.
- Boo's server function: Cloudflare Pages Functions (`functions/api/boo`); the AI key is a Cloudflare secret.
- Data on the phone via `@capacitor/filesystem`, always through `src/data/store`.
- iOS plugins via Swift Package Manager only, never CocoaPods.
- Storybook for components.
- Architecture details: `docs/ARCHITECTURE.md`.

## Design

- Mockups and Variables live in Figma (file "Smartboo - Pet care app": screen Today · V17, page Design system).
- Colors, spacing, radii and fonts only through CSS variables from `src/styles/tokens.css`. No hex values in components.
- `design/` holds early HTML sketches — don't touch.
- Mobile UI rules: works from 360px wide, checked at 390px; safe areas via `viewport-fit=cover` and `env(safe-area-inset-*)`; touch targets at least 44px; no hover-only states; no text selection or tap highlight on buttons; no horizontal scroll; light and dark themes follow the phone.

## Working with me

- I'm a designer and this is my first app. Explain in plain words, one step at a time.
- Plan first, then wait for my "ok". Commits follow Conventional Commits, after my "ok".
- Don't change `README.md`, `docs/` or `design/` unless the task is about them.

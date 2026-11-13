# SmartBoo

**Just hand it to Boo.**

SmartBoo is an iOS app for US pet owners that keeps everything about your pets in one place. Hand Boo, the built-in assistant, a paper from the vet or tell it what happened. Boo files it in the right pet's folder, remembers what's due and when, and pulls up the record you need in seconds — ready to share as a PDF.

Building in the [UX Hero](https://uxhero.design) Design Engineer cohort.

## Why

Pet records are scattered across clinic emails, PDFs, paper and memory. Vaccine and recheck dates slip, and when a boarding place or a new vet asks for the shots, owners can't pull them together quickly. Most owners don't want to log every day — so SmartBoo works from the papers they already get.

## What's in the first version

- **Snap a vet paper** — Boo reads it, creates the pet and its vaccines, and shows a review card before saving anything.
- **Reminders** — "Remind you 2 weeks before each one?" One tap.
- **Today and Schedule** — what's due for every pet, with simple checkboxes.
- **Pet folders** — papers, vaccines, meds and notes for each pet, any species.
- **Share** — a clean PDF of the record via the iOS share sheet.
- **Talk to Boo** — by voice or text. Boo never makes things up, never guesses which pet, and doesn't give diagnoses or doses.

Until the demo, data stays on the phone: no accounts, no sign-in.

## Tech stack

- Vite + React + TypeScript + Tailwind CSS, design tokens from Figma Variables
- Capacitor → iOS (TestFlight); web version on Cloudflare Pages
- Boo's AI runs in one Cloudflare Pages Function
- Storybook for components

## Components

Every component in every state, light and dark, at iPhone size: **[Storybook](https://main--6af74f44d16cc9fc689d9bef.chromatic.com)**.

It is published to Chromatic on every push to `main`. Locally: `npm run storybook` (http://localhost:6006).

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 with sample pets. Boo is simulated for now.

## Status

Early development. Demo on December 2, 2026.

# SmartBoo

**Say it once. Your whole household knows.**

SmartBoo is an AI pet care companion for US pet owners. Instead of filling in forms, you just say what happened ("Gave Luna her heartworm pill, she ate half her dinner"), and SmartBoo turns it into care records you confirm with a tap. Everyone in the household sees the same up-to-date picture.

> Less tracking. More caring.

## Why

Pet owners juggle meds, feedings, vet visits and weigh-ins across notes apps, paper and memory. Existing trackers ask for too much manual input, are built for dogs and cats only, and keep the records locked inside the app or the vet's system.

## Core ideas

- **Capture** — log care by voice or text; AI turns it into cards you review and confirm.
- **Care together** — invite a household member so meds and feedings aren't doubled or missed.
- **Own the record** — your pet's history belongs to you; export it as PDF or CSV anytime.
- **Every species** — dogs and cats, but also birds, reptiles, fish and small pets, including tanks, enclosures and weights in grams.

## MVP scope

- Voice and text capture covering several pets at once
- Tasks and reminders with simple checkboxes
- Household sharing (one invited member)
- PDF / CSV export
- Sign in with Apple

Coming next: document scanning and sitter links.

## Tech stack

- Vite + React + TypeScript + Tailwind CSS
- Storybook for UI components
- Progressive Web App (add to Home Screen on iOS)
- Supabase (database, auth, Edge Functions)
- Web Speech API for voice, with server transcription as a fallback
- LLM via Supabase Edge Function
- Hosting on Cloudflare Pages / Vercel

## Status

Early development. Public beta planned for December 2026.

# SmartBoo — Product

> **Just hand it to Boo.**
> SmartBoo keeps everything about your pets in one place. Hand Boo a paper from the vet or tell it what happened — Boo files it in the right pet's folder, remembers what's due and when, and pulls up the record you need in seconds.

Sources: product interviews, an ongoing survey of US pet owners, and an analysis of App Store reviews of pet apps. Current numbers live in the research notes; this file keeps the conclusions. It is the source of truth for the product.

## Problem

- Pet records are scattered: emails and PDFs from different clinics, paper, portals, memory. Finding the right one when you need it is hard.
- Due dates for vaccines, lab rechecks and insurance claims slip. These are the most annoying tasks owners mention.
- When a boarding place, groomer, new vet or emergency vet asks "can you show the shots / history?", owners can't pull it together quickly.
- Nobody wants to log every day: most respondents look up or record pet info only a few times a year or almost never, and most have never used a pet care app. Our real competitor is memory, paper and email.

## Who it's for

- Pet owners in the US on iPhone (most respondents use one).
- Most often a dog or a cat, often more than one pet. Any species is supported: small mammals, birds, reptiles — weight in grams, no irrelevant fields.
- Not now: breeders, clinics, shelters, professional sitters.

### When people open the app

1. **"I just got a paper."** Back from the vet, or a PDF landed in email. They want to put it somewhere safe. This is the install moment and the "aha" moment.
2. **"I need to show it right now."** Boarding asks for shots, a new vet asks for history. This is why people keep the app on their phone.
3. **A push from Boo.** "Rocky's rabies is due in 2 weeks." This brings people back when they've forgotten the app.
4. **"Something happened."** A symptom, a weight, a new course of meds, "when did this happen last time?". Important, but secondary.

## Main flow — the first minute

The first screen offers two equal ways in:

- **Snap a vet paper** (for people in a hurry):
  1. Camera, photo library, or a PDF from Files.
  2. Boo reads it for 3–8 seconds ("Reading…").
  3. Review card: the pet (name, species, breed, date of birth — Boo creates the pet from the paper), document type, clinic, date, vaccines found with "given" and "due" dates, amount. Uncertain fields are highlighted and editable with a tap. Button: **Looks right**.
  4. "Remind you 2 weeks before each one?" → **Yes** → only now does iOS ask for notification permission.
  5. "Add a photo of Rocky?" [Take photo] [Later].
  6. Done: the pet's folder holds the paper and the vaccines; Today shows "Next: Bordetella in 5 months".
- **Add your pet** (for organized people): name, species, breed, date of birth, photo. Papers can come later.
- **No papers right now** → "Tell me about your pet" by voice or text.

If a pet with the same name already exists, the paper goes into that pet's folder; when unsure, Boo asks "Is this the same Rocky?". If a paper covers several pets, Boo finds or creates each of them.

## Boo — how it works

Tap the round Boo button next to the tab bar → a **bottom sheet** over the current screen (not a chat, no conversation history). Three actions: 🎙️ **Talk** · 📷 **Snap a paper** · ⌨️ **Type**. The result appears right in the sheet.

Boo takes three kinds of input:

| Input | Example | What Boo does |
| --- | --- | --- |
| 📄 Document | photo of a vaccine certificate, PDF invoice | Finds the pet, vaccines, dates, meds, clinic, amount → review card → reminders |
| 🎙️ Event | "Cleo weighs 950 grams", "Rocky threw up", "Ear drops twice a day for 10 days" | Files it in the folder, creates a course of meds, asks one follow-up question for a symptom |
| ❓ Question | "When is Rocky's rabies due?", "When did Rocky last throw up?" | Answers only from the records and shows the source |

### What is saved right away vs. reviewed

- 🟢 **Saved right away + "Saved · Undo" toast (5 s):** weight (the toast shows a comparison, e.g. "−30 g since last week"), marking something done, a note, a photo, feeding, a walk.
- 🟡 **Review card → Looks right:** anything extracted from a document; a new medication or course; a symptom (+ one question like "Once? Is he eating?"); a new reminder or plan; a new pet.
- ❓ **Question:** nothing is saved; an answer + a link to the record.
- If it's unclear which pet is meant, Boo doesn't guess — it asks: [Milo] [Cleo] [Both].

### Voice and rules

- English. Short and warm: "Got it — Cleo, 950 g. That's 30 g less than last week."
- Replies as text in the sheet + a light haptic on save. Spoken replies come later.
- Never makes things up: missing data stays empty or becomes a question.
- No diagnoses, no medication or dose advice. For red-flag signs from a fixed list: "That sounds worth a call to your vet today" + a button to call the vet.
- Boo says plainly that it isn't a vet: on the first-use screen and in Settings → About ("Boo keeps your pet's records. It isn't a vet.").
- There is always a non-AI path: manual add and edit.

## Screens in the first version

Tab bar: a floating black capsule with **Today · Schedule · Pets**, and the round **Boo button** to the right of it. Settings: icon in the top-right corner of Today.

1. **Welcome** — two ways in: Snap a vet paper / Add your pet (+ No papers right now).
2. **Today** — what's due soon:
   - Boo card with a text field, mic and camera;
   - **Next up** — the single most urgent item with actions [Done] / [Book vet];
   - **Coming up** — the next few items (vaccines, med courses, lab rechecks, insurance deadlines), overdue on top, with "See schedule"; daily chores only if the owner set them up;
   - **Your pack** — avatars with a dot when a pet has something due soon;
   - **Done today** — small, collapsed;
   - empty day: "All good. Next: Rocky's rabies in 3 weeks." + one Boo hint about a gap ("I don't know Milo's shots yet. Snap his last vet paper?"); "Not now" hides it for a week.
3. **Schedule** — the plan by day:
   - a week strip at the top (dots under days that have something due); swipe for other weeks;
   - for the selected day: *Due today*, *Done today*, *Tomorrow*, *Later this week*;
   - each task: pet avatar, what (with dose), pet name and time; overdue shows "waiting since 8 AM";
   - tapping a task's circle crosses it out and moves it to Done (tap again to undo);
   - past days show what was done — the answer to "did anyone give the pill yesterday?".
4. **Boo (bottom sheet)** — Talk / Snap / Type → toast, review card, or answer.
5. **Pet folder**:
   - header: photo in the flower frame, name, species and breed, age, **Share** button;
   - **Key facts** tiles: Vaccines · Meds now · Weight (sparkline) · Allergies · Vet (call); the Vaccines tile is hidden for species that don't need vaccines;
   - **History** — one timeline by date with filters All · Health · Meds · Vaccines · Weight · Documents, plus search; documents sit in the timeline on the visit date, and records extracted from a document link back to it;
   - profile (species, breed, date of birth, microchip, insurance, vet) — editable;
   - plus the pet list (Pets tab) and adding a pet.
6. **Share** — from the pet folder, via Boo ("send Rocky's shots to the boarding"), or from the menu on Today:
   1. pick a set: 🏨 Boarding & groomer (vaccines, vet, owner contacts) · 🩺 New vet (everything) · 🚨 Emergency (current meds, allergies, symptoms from the last 2 weeks, vet, weight);
   2. pick one or more pets;
   3. PDF preview → the iOS share sheet.

## Not now

- Household sharing, "who did it", double-dose protection — after the demo (Wed Dec 2).
- Backend, accounts and sign-in — after the demo, together with backup and in-app account deletion.
- Expiring share links for boarding (need a backend) — PDF only for now.
- Terrarium and aquarium logs as a separate "habitat", water parameters.
- Spoken replies from Boo.
- Widget, Siri, Apple Watch, forwarding emails to Boo.
- Insurance helper, lab comparison, expenses and supplies, weekly reports, memorial mode.
- Never: diagnoses or an AI vet, pet "translators", a cap on the number of pets, paid export of your own data.
- Android is not a focus.

## Native features

Without these the app would be a website; here they are the core of the flows:

- **Camera and photos** — snap a paper (Snap a vet paper) and the pet.
- **File picker** — PDFs from Files and email.
- **Local notifications** — reminders for vaccines, meds, lab rechecks, insurance deadlines.
- **iOS share sheet** — send a PDF to boarding or a vet.
- **Microphone and on-device speech recognition** — Talk.
- **Haptics** — confirm a save.
- **Phone call** — call the vet from the folder and from a warning.
- Later: "Share → SmartBoo" from Mail and Files (share extension).

## Data

- **Until the demo everything lives on the phone**, with no account and no sign-in. Storage goes through a single module so that after the demo we can move to a server (Supabase) by rewriting only that module.
- **What we store:** pets (profile), records (type, data, time, source phrase or source document), tasks and reminders (repeat counted from the actual completion date), documents (original photo/PDF), vaccines, medications and courses, weight.
- **Only Boo needs a server:** one server function parses documents and phrases with AI. The AI key never lives in the app. Per-device rate limit and a spending cap. Documents and phrases are not kept on the server after parsing.
- No audio is stored — text only.
- Risk: deleting the app deletes the data. This is a deliberate trade-off until the demo; backup comes first after it.

## Success metric

**≥ 60% of new users save their first paper or pet and get at least one reminder in their first session.** That is the "aha" moment.

Secondary: ≥ 80% of review cards are confirmed with "Looks right" without edits — Boo's accuracy.

How we measure before there is a backend: usability tests + an anonymous event counter in Boo's server function (no personal data). Details at the architecture step.

## App Store and privacy

What the app needs so Apple approves it and people trust it:

- **Not a website in a wrapper.** The core flows use the phone: camera, Files, on-device storage, local notifications, speech, share sheet, haptics (see Native features).
- **AI consent before the first send.** The first time Boo is about to read a paper or a phrase, a one-time screen explains: "Boo sends your photo or words to an AI service to read them. Nothing is kept after that." [Continue] [Not now]. "Not now" leaves manual add and edit fully working. The choice can be changed in Settings.
- **Permissions only at the moment of use**, each with a plain reason:
  - Camera — "to snap vet papers and pet photos";
  - Photo library — "to pick a vet paper or a pet photo";
  - Microphone and Speech recognition — "so you can tell Boo what happened";
  - Notifications — asked only after "Remind you…? → Yes".
- **Privacy policy** on a public page (with the web version), linked from Settings and App Store Connect. The App Privacy label says honestly: records stay on the phone; photos and text go to the AI service only to be read, are not stored, not linked to the person and not used for tracking.
- **Ready for review:** no placeholders or dead buttons; Boo's server is running; review notes explain how to try Boo, with a sample vet paper.
- **Path to the store:** TestFlight for internal testers needs no review (course release, Nov 25); external testers need a short beta review; the full App Store review comes when SmartBoo goes public.

## Name and bundle ID

- Name: **SmartBoo**; the assistant is **Boo**.
- Bundle ID: **`com.hannagekker.smartboo`**
- UI language: English (US market).

## Open questions

- A set of 10–15 real vet documents (own and friends', personal data hidden) to test Boo.
- Red-flag list to be reviewed by a vet.
- Ongoing interviews: will people bring a paper in the first minute, will they talk to Boo?
- Monetization — to be decided (early signal: subscriptions are a hard sell; consider free + one-time purchase).

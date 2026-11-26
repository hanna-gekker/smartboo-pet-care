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

The first screen puts talking to Boo first. Most owners don't have a vet paper at hand, and talking or typing is the easiest start.

- **Tell me about your pet** — one field on Welcome. Type straight into it, or tap the mic to talk. Boo creates the pet from what it hears.
- **Snap a vet paper** — the camera button in the same field:
  1. Camera, photo library, or a PDF from Files.
  2. Boo reads it for 3–8 seconds ("Reading…").
  3. Review card: the pet (name, species, breed, date of birth — Boo creates the pet from the paper), document type, clinic, date, vaccines found with "given" and "due" dates, amount. Uncertain fields are highlighted and editable with a tap. Button: **Looks right**.
  4. "Remind you 2 weeks before each one?" → **Yes** → only now does iOS ask for notification permission.
  5. "Add a photo of Rocky?" [Take photo] [Later].
  6. Done: the pet's folder holds the paper and the vaccines; Today shows "Next: Bordetella in 5 months".
- **Add your pet** — a secondary button that opens a short step-by-step form, one question per screen (see "Add your pet" below). Papers can come later.

If a pet with the same name already exists, the paper goes into that pet's folder; when unsure, Boo asks "Is this the same Rocky?". If a paper covers several pets, Boo finds or creates each of them.

## Add your pet — step by step

One question per screen. A nav bar ("Add your pet", back), a step bar under it, the question, and at the bottom an optional "Skip", the main button and "Or just tell Boo" (opens the Boo sheet). The steps adapt to the species.

1. **"Who's joining the family?"** / "Pick one. You can add more pets later." — 17 species in a 4-column grid: dog, cat, rabbit, hamster, guinea pig, rat, chinchilla, ferret, hedgehog, bird, parrot, fish, turtle, lizard, snake, frog, other. Button "Next".
2. **"What's their name?"** — the species placeholder with an add-photo badge, "Add a photo" under it, the field "Name", then the frame colour swatches; the placeholder follows the chosen colour right away. "Next".
3. **"Do you know the breed?"** / "Optional. You can change it later." — a breed search ("Search breeds") and popular choices for the species (for fish: "What kind of fish?"), each list ending with "I'm not sure". Skip + "Next".
4. **"When was {Name} born?"** — "Date of birth", or "I don't know the exact date" ("If unsure, Boo asks for an approximate age instead."). "Next".
5. **"How much does {Name} weigh?"** / "Optional. Helps Boo track changes." — lb or kg for dogs, cats and other larger pets; g or oz for small mammals, birds and reptiles ("Optional. Small pets are weighed in grams."). Fish have no weight step: their flow has 4 steps and step 4 saves the pet. Skip + "Save pet".
6. **"{Name} is all set"** — the pet's card: photo or placeholder, name, species, then a row of what was filled in: "Breed", "Age", "Weight" (for fish "Type", "Age"); skipped answers are left out. For species that get vaccines, a Boo hint: "I don't know {Name}'s shots yet. Snap the last vet paper?" [Snap a vet paper] [Not now]. No back button. "Done".

A pet without a photo shows a drawing of its species in its frame colour, the same on every screen. A new pet gets a frame colour that no other pet of the same species uses; when all are taken, a small initial badge tells them apart.

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
- **Every record opens.** Tap it in a pet's History or in Schedule → Happened: a sheet with what it is, the pet and when, **What you said** (your words to Boo, word for word, "Told Boo · Oct 30, 8:41 AM"), **Boo asked** (the follow-up question and your answers, which you can change), **Details**, **From a vet paper** (opens the paper), and **Share** / **Delete** ("Deleted from Rocky’s history" + Undo).
- A symptom's follow-up answers are chips: **Once** · **More than once**, **Eating fine** · **Not eating**.
- If it's unclear which pet is meant, Boo doesn't guess — it asks: [Milo] [Cleo] [Both].

### Voice and rules

- English. Short and warm: "Got it — Cleo, 950 g. That's 30 g less than last week."
- Replies as text in the sheet + a light haptic on save. Spoken replies come later.
- Never makes things up: missing data stays empty or becomes a question.
- Medications are medicines only: tablets, liquids, drops, injections, flea / tick / heartworm products. Food and prescription diets are not medications, so they get no course and no reminders (decided Nov 25).
- No diagnoses, no medication or dose advice. For red-flag signs from a fixed list: "That sounds worth a call to your vet today" + a button to call the vet.
- Boo says plainly that it isn't a vet: on the first-use screen and in Settings → About ("Boo keeps your pet's records. It isn't a vet.").
- There is always a non-AI path: manual add and edit.

### When something goes wrong

Same sheet as a Boo answer: what you gave Boo (a small thumbnail of the paper, or "…" for voice), Boo's reply, and two buttons. Every case offers a way that doesn't need the AI.

| Case | Boo says | Buttons |
|---|---|---|
| Photo too blurry | "This photo is a bit blurry, so I can't read it well. Try again in good light?" | Retake photo · Choose another |
| Not a vet paper | "I couldn't find pet records on this one. Is it a vet paper?" | Try another · Add by hand |
| Camera access off | "Camera access is off. You can turn it on in Settings, or pick a photo instead." | Open Settings (the app's iOS settings) · Choose a photo |
| Offline | "You're offline. I'll read this paper as soon as you're back online." The photo waits on the phone and is read when the connection is back. | Got it · Add by hand |
| Didn't catch that (voice) | "Sorry, I didn't catch that. Want to try again?" | Talk again · Type instead |
| Microphone access off | "Microphone access is off. You can turn it on in Settings, or type instead." | Open Settings (the app's iOS settings) · Type instead |
| Boo's daily limit is used up | "That's all I can read today. I'll be back tomorrow — or add it by hand." | Add by hand · Got it |
| Boo's server didn't answer | "Something went wrong on my side. Try again in a minute?" | Try again · Add by hand |

## Screens in the first version

Tab bar: a floating capsule with **Today · Schedule · Pets**, and **Boo** to the right of it. Settings: icon in the top-right corner of Today.

1. **Welcome** — Boo on a calm glow; a white card "Everything about your pets, in one place." / "Just hand it to Boo."; one field "Tell me about your pet…" with camera and mic inside; a secondary "Add your pet"; at the bottom "Boo keeps your pet's records. It isn't a vet."
2. **Today** — what's due soon:
   - Boo card with a text field, mic and camera;
   - **Next up** — the single most urgent item with actions [Done] / [Book vet];
   - **Coming up** — the next few items (vaccines, med courses, lab rechecks, insurance deadlines), overdue on top, with "See schedule"; daily chores only if the owner set them up. Works like a checklist: a task done today stays in place, checked and crossed out;
   - **Your pack** — avatars with a dot when a pet has something due soon;
   - empty day: "All good. Next: Bordetella in 5 months." + one Boo hint about a gap ("I don't know Milo's shots yet. Snap his last vet paper?"); "Not now" hides it for a week.
3. **Schedule** — a calendar on top and the selected day below:
   - Week / Month switch; Week is a strip of day tiles, Month the same tiles in a 7-column grid. A tile shows the date and up to two pet photos of that day (or one photo and "+N"); today has the date in a blue circle;
   - the selected day's title, e.g. "Wednesday, Nov 4";
   - **To do** ("{done} of {total} done"): that day's tasks, overdue first, in rose, with just when they were due ("{Pet} · 8 AM", or "{Pet} · Tue 12 PM" on a past day), then open ones, then done ones (checked and crossed out). Tapping a task's circle checks it in place; tap again to undo;
   - **Happened**: what was logged that day (weight, a symptom, a note…), e.g. "Cleo weighs 950 g" · "9:20 AM · 30 g less than last week";
   - past days work the same — the answer to "did anyone give the pill yesterday?";
   - an empty day: one card with Boo, "All good." and "Next: {next item}.", e.g. "Next: Change water for Tank tomorrow."
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

Permission texts (iOS asks once, the first time; approved Nov 25):

| Access | Text |
|---|---|
| Camera | SmartBoo uses the camera so you can snap vet papers and photos of your pets. |
| Photos | SmartBoo opens your photos so you can add vet papers and pet photos. |
| Microphone | SmartBoo uses the microphone so you can tell Boo things by voice. |
| Speech recognition | SmartBoo turns what you say into text so Boo can file it. |

Notifications use the standard iOS prompt (no text of ours).

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
- Web version (Nov 25): https://smartboo-pet-care.pages.dev — Cloudflare Pages project `smartboo-pet-care`, built from `main` on every merge (`npm run build` → `dist`).
- Registered with Apple (Nov 25): App ID on developer.apple.com (no extra capabilities) and the app in App Store Connect: https://appstoreconnect.apple.com/apps/6839450986 (iOS, English (U.S.), SKU = bundle ID).
- UI language: English (US market).

## Open questions

- A set of 10–15 real vet documents (own and friends', personal data hidden) to test Boo.
- Red-flag list to be reviewed by a vet.
- Ongoing interviews: will people bring a paper in the first minute, will they talk to Boo?
- Monetization — to be decided (early signal: subscriptions are a hard sell; consider free + one-time purchase).

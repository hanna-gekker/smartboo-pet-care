# SmartBoo · Components

Inventory of what repeats across the screens, as of Nov 12, 2026. It compares the Figma page "Design system" (sections Core components and Patterns) with the code in `src/components/` and `src/screens/`. Names follow Figma.

States used below:
- **pressed**: the look under the finger. Phones have no hover.
- **focus**: a visible outline for the keyboard and VoiceOver.
- **disabled**: can't be tapped, and the text stays readable.
- **loading**: a spinner, and a second tap does nothing.
- **error**: an outline plus a message under the field, not only a color.

Touch targets are at least 44×44 pt, even when the shape is smaller.

## 1. Base components (session 3, P8)

| Component (Figma) | Screens | Variants | States | Props in plain words | In code now |
|---|---|---|---|---|---|
| **Button** | Welcome, Today, Boo sheet, Pet folder, Add your pet, Edit profile, Share | Primary, Secondary, Ghost · size Medium, Large | pressed, focus, disabled, loading | label; variant; size; icon (optional); full width; disabled; loading; what happens on tap | `Button` in `ui.tsx` has four variants: primary, secondary, ghost and **dark**. Dark isn't in Figma. It has one size, 48 px. There is no loading state and no pressed look from Figma, only a generic shrink. |
| **Icon button** | Today, Schedule, Boo sheet, Pets, Pet folder, Share, Add your pet, Settings | Primary, Secondary, Soft · size 40, 56 | pressed, focus, disabled | icon; label for VoiceOver; style; size | `IconButton` in `ui.tsx` comes in one style only. The mic and camera on Today, Send in the Boo sheet and the vet's phone circle are drawn by hand. |
| **Card** | Today, Schedule, Pets, Pet folder, Settings, Share, Boo sheet | Plain, Tappable | pressed (when tappable), focus | content; padding (normal or none, for lists); what happens on tap | `Card` in `ui.tsx`. Figma has no standalone Card component: cards exist only inside Next up card, Attention card and Key fact tile. |
| **Form field** (TextField) | Add your pet, Edit profile, Boo review card, Your profile | Text, Date, Choice (select) | focus, disabled, **needs check** (Figma), **error** | label; value; type; placeholder; hint under the field; error message; needs check; trailing icon | `Field` and `inputClass` in `ui.tsx`. It has a "needs check" state but no error state, and no `aria-invalid` or `aria-describedby`. The search field in Pet folder is drawn by hand. |
| **Tab bar** + **Tab item** | Today, Schedule, Pets, Pet folder, Settings, Boo sheet | Active tab: Today, Schedule or Pets | pressed, focus, active (`aria-current`) | active tab (read from the address); what the Boo button does | `TabBar.tsx`. Frosted glass capsule; the active tab is a pill in the `nav/active-*` tokens with the filled icon (see section 14). |

## 2. SmartBoo's own components (session 3, P9 candidates)

| Component (Figma) | Screens | Variants | States | Props in plain words | In code now |
|---|---|---|---|---|---|
| **Task row** (with **Checkbox** and **Status pill**) | Today, Schedule, Boo sheet, Share · Pick pets | Default, Done, Waiting (overdue) | pressed (checkbox), focus | title; detail (dose); pet; time or date line; state; what happens on tick | `TaskRow.tsx`. It works out "overdue" and builds the time text itself; that logic should come in as props. Status pill doesn't exist in code yet. |
| **Pet avatar** | Today (Your pack), Pets, Pet folder, Boo sheet, Share | Color: lavender, mint, pink, butter, ocean, slate or none · Status: Normal, Waiting · size S, M, L | — (decoration) | pet (photo or first letter); color; size; due-soon dot; name under it | `PetAvatar` in `ui.tsx`. It always uses the accent color (no pet colors) and takes any size in px (28–112). |
| **List row** / **Summary row** | Pets, Pet folder, Settings, Share · Pick a set, Boo answer, Vaccines | Leading: icon, photo or none · Trailing: chevron or action ("Call") | pressed, focus | title; subtitle; value; leading icon or photo; trailing chevron or action | No component yet. It's drawn by hand five times, each differently: the pet card on Pets, the Profile rows and the vet card in Pet folder, the vet rows in Settings, and the set cards in Share. |
| **Section header** | Today, Schedule, Pet folder, Settings, Boo sheet | With or without an action link | pressed, focus (link) | title; action text and what it does | `SectionTitle` and `TextLink` in `ui.tsx`. Schedule draws its own uppercase heading. |
| **Ask Boo input** | Today, Boo sheet | Idle, Typing | pressed, focus, disabled (Send) | placeholder; text; what happens on send, mic and camera | No component yet. The Boo card on Today and the text field in the Boo sheet are drawn separately. |
| **Next up card** | Today | With or without a second action (Book vet) | pressed (buttons) | task; pet; main action; second action | No component yet. It's put together by hand on Today: a Card, a Task row and two buttons. "Book vet" is a link styled like a button by hand. |
| **Key fact tile** / **Attention card** | Pet folder, Today (gap hint) | Tone: Default, Attention | — (pressed, if tappable) | icon; label; value; extra line | `Tile` lives inside `PetFolder.tsx`. The gap hint on Today ("I don't know … shots yet") is drawn by hand. |
| **Filter chip** | Pet folder (History) | Selected, Default | pressed, focus, selected | label; selected; what happens on tap | `Chip` in `ui.tsx`. The suggestion chips in the Boo sheet and the "Which pet?" chips are drawn by hand. |
| **Timeline item** | Pet folder | By record type (icon) | — | icon; title; date; detail; source document | `HistoryItem` lives inside `PetFolder.tsx`. |
| **Nav bar** / **Screen title** | Nav bar: every inner screen · Screen title: Pets, Today, Schedule | Nav bar with or without a right action | pressed, focus (back, action) | title; right action | `StackScreen` in `ui.tsx` covers the nav bar. Large titles on Today, Schedule and Pets are drawn by hand three times. |
| **Boo / Character** | Welcome, Today, Boo sheet, tab bar | Idle, Listening | — (animation) | state; size | `BooFace` in `TabBar.tsx` is one static drawing. |
| **Bottom sheet** (Figma: **Sheet header**) | Boo sheet | — | open, being dragged | title; content; what happens on close | `BottomSheet.tsx`. |
| **Segmented control** | Schedule (Week / Month) | Week, Month | pressed, focus, selected | options; selected | Not in code. Schedule has a week view only. |
| **Pet hero** | Pet folder, Edit profile | Pet colors | — | pet; color | Drawn by hand in `PetFolder.tsx`. |
| **Colour swatch** | Edit profile | Colour, None · Default, Selected | pressed, focus, selected | color; selected | Not in code. The pet color can't be picked yet. |
| **Toast** ("Saved · Undo") | Every screen, after Boo saves something | With or without Undo | pressed (Undo) | text; Undo action | `Toast.tsx`. **Not in Figma.** |

These are in Figma but not used on any screen or in code: Progress ring, Stat tile, Timeline step, and Chip (Core components; it differs from Filter chip).

## 3. Built by hand in several places, each differently (first to fix)

1. **Rows with a leading icon or photo and a trailing chevron or action.** Pets list, Pet folder (vet card, Profile), Settings (vets), Share (sets, Pick pets). These become List row / Summary row.
2. **Round icon buttons.** They come in three sizes (44, 48, 40 px) drawn by hand: Today (mic, camera), Boo sheet (Send), Pet folder (vet phone). These become Icon button.
3. **Checkbox circle.** It's drawn twice, differently: in Task row (28 px circle, `border-control` ring) and in Share · Pick pets (`surface-subtle` ring). These become Checkbox.
4. **Buttons made from links or plain `button`s.** "Book vet" on Today, the two test buttons in Settings, "Snap it / Not now" on Today, "Explore with sample pets" on Welcome. These become Button (and a Ghost size).
5. **Text fields.** `Field` (forms), the search in Pet folder, the Boo text field, the Ask Boo pill on Today. These become Form field and Ask Boo input.
6. **Large screen titles.** Today, Schedule and Pets each repeat the same `h1` classes. This becomes Screen title.
7. **Pill-shaped choices.** `Chip` (Pet folder), Boo suggestions, "Which pet?" and the answer chips in the Boo sheet. These become Filter chip and Chip.

## 4. Decisions (Nov 12, 2026)

1. **Button "dark".** Dropped. Next up uses Primary ("Done") and Secondary ("Book vet"), as in Figma.
2. **Error state for Form field.** Added in Figma: a `status/error-border` outline plus an icon and a message in `status/error-text` under the field.
3. **Card.** Added in Figma: Plain (padding 16), List (no padding, `border/control` outline), Tappable (pressed: `surface/subtle`). No shadow.
4. **Toast.** Added in Figma: a `surface/nav` capsule, 56 high, with a check, the text and a Ghost "Undo" button.
5. **Sizes.** Button Medium is 44 (`size/control-44`) and Large is 56. Checkbox is 32 (`size/control-32`). Pet avatars use the new `size/avatar-40/48/72/80/128`. The room under the tab bar has no token yet.

## 5. Built (session 3, P8)

Base components in `src/components/`, each state set by props. They are shown on the dev-only page `/components` in light and dark.

| Component | File | Props |
|---|---|---|
| Button | `Button.tsx` | `variant` (primary, secondary, ghost) · `size` (medium, large) · `icon` · `full` · `disabled` · `loading` · `onClick` (if it returns a promise, the button loads by itself and ignores more taps) |
| Icon button | `IconButton.tsx` | `icon` · `label` (for VoiceOver, required) · `variant` (primary, secondary, soft) · `size` (40, 56; 40 sits in a 44 tap area) · `disabled` |
| Card | `Card.tsx` | `variant` (plain, list) · `onClick` (makes it Tappable) |
| Form field | `TextField.tsx` | `label` · `hint` · `error` · `needsCheck` · `trailingIcon` · `options` (turns it into a choice list) · plus the usual input props |
| Tab bar | `TabBar.tsx` | `active` (today, schedule, pets or none) · `overdue` (dot on Schedule) · `onBoo` · `docked` |

## 6. Built (session 3, P9)

SmartBoo's own components, also on `/components`.

| Component | File | Props |
|---|---|---|
| Boo (Figma Boo / Character) | `BooCharacter.tsx` | `state` (idle: slow breathing; listening: faster pulse) · `look` (full: with glow, halo and shadow; mini: the flower alone, as in the tab bar) · `size` · `animated`. Colors are `ai/*` tokens; motion stops when the phone asks for less |
| Checkbox | `Checkbox.tsx` | `checked` · `label` (read by VoiceOver) · `onChange` · `tone` (default, waiting) · 32 circle in a 44 tap area |
| Task row | `TaskRow.tsx` | `title` · `detail` · `meta` (the grey line) · `state` (default, done, waiting) · `pet` · `onToggle` · `flush` (no side padding, inside Next up) |

- **Task row "waiting"** (decided Nov 12, 2026): a third state not drawn in Figma yet. An overdue task's line and circle take `status/waiting-text`, so it stands out in Coming up.
- What the line says and whether a task is overdue is worked out in `src/lib/tasks.ts` (`taskState`, `taskMeta`), not inside the row.
- The tab bar's Boo button now shows the mini Boo from Figma. Other screens still show the old ghost (`BooFace`) until P10.

## 7. Screens on components (session 3, P10)

Every screen is built from `src/components/`; the old Button, IconButton, Card, Field and the ghost `BooFace` are gone.

| Component | File | Props |
|---|---|---|
| List row (Figma List row + Summary row) | `ListRow.tsx` | `title` · `subtitle` · `label` (small text above, like Summary row) · `value` · leading `icon` / `pet` / `emoji` · `trailing` (chevron or an action pill like "Call") · `href` or `onClick` (the whole row is the tap target) |
| Pet avatar | `PetAvatar.tsx` | `pet` · `size` (sm 40, md 48, lg 72, xl 80, hero 128 — the size/avatar-* tokens) · `dueSoon` |

Still hand-built, for later: Key fact tile and Timeline item (Pet folder), Filter chip (`Chip` in `ui.tsx`), Ask Boo input (Today, Boo sheet), Status pill, Pet avatar petals, Nav bar and Screen title, the Boo sheet's big actions.
Values without a token left in classes: `pb-[144px]` (room for the tab bar), `max-w-[320px]`, `max-w-[420px]`, `max-w-[560px]`, `max-h-[88dvh]`, `h-[6px]` (sheet handle).

## 8. Today as in Figma (Nov 12, 2026)

Today follows the Figma screen "1 · Today": header with the logo, Next up, the Boo card, Coming up, Your pack, Done today, each a card 16 apart.

| Component | File | Props |
|---|---|---|
| Logo (Figma Logo · Horizontal) | `Logo.tsx` | — (colors are tokens: ai/petal-*, brand/logo-core, text/primary) |
| Status pill | `StatusPill.tsx` | `status` (waiting, upcoming, done) · `label` |
| Next up card | `NextUpCard.tsx` | `pet` · `title` · `meta` · `status` (pill) · `onDone` · `onBookVet` (only with a vet). Waiting sits on `status/waiting-bg` |
| Ask Boo input | `AskBooInput.tsx` | `placeholder` · `onType` · `onSnap` · `onTalk` |
| Pet avatar with petals | `PetAvatar.tsx` | `petals` (ocean, lavender, butter, mint, pink, slate) · `dueSoon`; plus `outlined` for the white ring on Next up |

Decisions (Nov 12, 2026):
- **No name in the greeting.** There are no accounts, so it's "Good morning" until the app asks for a name.
- **Share is gone from the Today header.** It stays in Pet folder.
- **The gap hint ("I don't know Milo's shots yet…") is gone from Today.** It isn't in Figma.
- **No "Add" in Your pack.** Pets are added from the Pets tab.
- **Pet colors are given by order** (`src/lib/petColors.ts`) until a color picker exists in the profile.
- **Next up texts:** the pill and the line come from `src/lib/tasks.ts` (`taskPill`, `nextUpMeta`).
- **Icons are the Figma set** (`Icon.tsx`, 31 icons from "Icon / …"), with the Figma names (`sun`, `calendar`, `paw`, `settings`, `chevron-left`…). The line stays 1.5px at any size. `search` and `more` aren't in Figma yet and are drawn in the same style.
- **Icon button "Plain"**: the icon alone, no circle — Settings on Today (Figma turns off the fill and stroke there).
- **Checkbox ring:** 1.5px, as in Figma (`ring-[1.5px]`; no stroke token).

Forced looks for the board and Storybook: `data-state="pressed"` or `data-state="focus"`.

The screens still use the older versions in `ui.tsx` (Button, IconButton, Card, Field). They move to these components in P10, and the old ones are deleted then.

## 9. Welcome as in Figma (Nov 12, 2026)

Welcome follows the Figma screen "Welcome" (and "Welcome · Dark"): Boo on top with "Tap Boo to talk", a glass Reminder card as an example, the title in the middle, two buttons and two notes at the bottom.

| Component | File | Props |
|---|---|---|
| Glass card (Figma "Glass card") | `GlassCard.tsx` | `pet` (photo, 40) · `title` · `caption`. Frosted glass: a see-through fill, blur behind it and an `ai/*` gradient edge. Glass is used here (the Reminder card) and on the tab bar |
| Tap hint (Figma "Tap hint") | `TapHint.tsx` | `label` · `onClick`. A small mic and a caption that opens Boo for voice |
| Note (Figma "Note") | `Note.tsx` | `icon` · `children`. A 16 icon and a grey caption, centred |

Decisions (Nov 12, 2026):
- **Welcome background** is the `.bg-welcome` class in `base.css`: the `ai/backdrop-*` gradient with an `ai/sheen` wash, plus soft `ai/aura-*` glows (dark only) and `ai/boo-backdrop` behind Boo (light only).
- **"No papers right now" is gone.** Tapping Boo or "Tap Boo to talk" opens Boo, as in the Figma prototype.
- **"Explore with sample pets" is gone for now.** It isn't in Figma. Sample pets stay in Settings → "Load sample pets" (reachable once there is a pet).
- **The Reminder card is an example**, always Rocky from the sample photos, not a real task.
- **Icon lines scale with the size** (Figma rule since Nov 12): 24 → 1.5, 20 → 1.25, 16 → 1. This replaces "the line stays 1.5px" in section 8.
- **Room for the tab bar** is now the Figma token `size/tab-bar-room` (128), and the max widths are `size/max-width-*`.

## 10. Pets as in Figma (Nov 13, 2026)

Pets follows the Figma screen "11 · Pets": "Your pack" with a caption and a + button, the pet list, then an "Add a pet" row. No new components.

Decisions (Nov 13, 2026):
- **List cards have no outline**, as in Figma: a white card, rows split by a 1px `surface/subtle` line.
- **The status on the right of a pet row** comes from `petStatus()` in `src/lib/tasks.ts`: "2 overdue" or the task name when overdue (red), "… today", the next task with its date, or "All good". Daily chores don't count.
- **Age in the list is short**: "7 y", "5 mo" (`ageShort()`).
- **A ListRow value takes at most 40% of the row**, so a long status never squeezes the pet's name.

## 11. Schedule as in Figma (Nov 13, 2026)

Schedule follows the Figma screen "5 · Schedule": the Today header (logo, settings) with the month over the title, the week strip in a card, then a card per section ("Today · 2 of 6 done", "Tomorrow · Thu, Nov 5 · 3 tasks", "Later this week · 2 tasks"). No new components.

Decisions (Nov 13, 2026):
- **Done tasks stay inside their day**, crossed out at the end of the list. There is no separate "Done today" section here.
- **Week strip dots:** coral when something on that day is overdue, violet when something is planned (`status/waiting-dot`, `status/due-dot`).
- **No week arrows** (not in Figma). Other weeks are reached through Month (section 12).
- **The empty state** ("Boo hint" in Figma) is not built yet; the old grey line stays until then.

## 12. Schedule · Month (Nov 13, 2026)

Figma "5b · Schedule · Month": a Week / Month switch under the title; Month shows the whole month in a card instead of the week strip. The cards below stay the same.

| Component | File | Props |
|---|---|---|
| Segmented control (Figma "Segmented control") | `SegmentedControl.tsx` | `options` ({ value, label }[]) · `value` · `onChange` · `label` (for VoiceOver). A grey capsule (`surface/subtle`), the chosen segment is a white capsule (`surface/card`) with a medium label. 44 high, each segment a real button (`role="radio"`) |
| Month calendar (Figma "Month") | `MonthCalendar.tsx` | `month` (any day in it) · `selected` · `today` · `dots` (day → overdue, due, done) · `onSelect` · `onPrev` · `onNext`. Month name with ‹ › arrows, weekday row, day cells 40×44 (tap area 44), the selected day a blue capsule, one dot under a day, legend "Overdue · Due · Done" |

Decisions (approved Nov 13, 2026):
- **The switch remembers nothing**: Schedule always opens on Week.
- **One dot per day**, the most urgent wins: overdue (coral) → due (violet) → done (green, `status/done-dot`, when everything on that day is done).
- **Past days** have grey numbers, as in Figma.
- **Tapping a day** in Month shows that day's card below, like in Week. ‹ › move by a month.

## 13. Boo sheet as in Figma (Nov 13, 2026)

The Boo sheet menu follows Figma "8 · Boo sheet", and typing follows "8a · Typing". No new components: the tiles and the header are parts of `BooSheet.tsx`.

Decisions (Nov 13, 2026):
- **"What's up?" without a name.** There are no accounts (same as the Today greeting).
- **Three tiles: Talk, Snap, Type.** Talk is highlighted. Type opens a step with the text field and Send; the field is gone from the menu.
- **No suggestion chips.** A grey "Try: …" line shows two examples instead.
- **All sheets have 24px side padding and a 5px handle in `border/control`**, as in Figma.
- The other Boo steps (consent, snap, reading, review, remind, photo, answers) keep their current look for now; they have their own Figma frames (6a–6g, 8b–8d, 9, 10).

## 14. Glass tab bar and surfaces (Nov 14, 2026)

The tab bar and the card surfaces follow the new Figma "Tab bar" + "Tab item" (Patterns). Tokens came in with a full Variables export.

| Component | File | What changed |
|---|---|---|
| Tab bar | `TabBar.tsx` | Frosted glass capsule (`surface/glass` at 85%, a soft top sheen, 24 background blur, 1px `border/glass-rim-*` rim inside), no shadow. 62 high with 4 inside, tabs 54 high, 21 from the screen edges (348 wide on a 390 phone). Selected tab: a `nav/active-fill` pill with a soft `nav/active-shadow`, the filled icon in `nav/active-icon`, the label in `nav/active-content`. Other tabs: outline icon and label in `text/secondary`. Icons 20, labels SB/Tab label (11/14 Medium, `text-tab-label`). Boo is the mini flower at 62, breathing, with no circle. No fade under the bar: content scrolls under the glass |
| Due dot | `TabBar.tsx` | `overdue`: an 8px `status/waiting-dot` on Schedule's icon (tab centre + 3, 8 from the top) with a 2px ring outside: `nav/dot-ring`, or `nav/dot-ring-active` on the selected tab. VoiceOver reads "Schedule, overdue" |
| Icon | `Icon.tsx` | `sun-fill`, `calendar-fill`, `paw-fill` (Figma Icon / …-fill) for the selected tab |
| Card, screen cards | `Card.tsx`, Today, Schedule, Month, Pet folder | On `surface/panel` with a 1px `border/card` hairline inside (a ring, so it takes no room). Next up and the Boo card keep their tint and get the hairline too. Rows inside cards have no hairline |
| Logo | `Logo.tsx` | Petals use `brand/logo-petal-*` (one step deeper in light); Boo keeps `ai/petal-*` |

Surfaces, back to front:
- `surface/canvas` — the screen (light: iOS grey #F2F2F7).
- `surface/panel` — cards and sections (white in light, `gray/900` in dark), with the `border/card` hairline.
- `surface/card` — controls and sheets: buttons, fields, checkboxes, the segmented thumb, bottom sheets.
- `surface/glass` — the tab bar.

Also from the export: overdue and form errors are rose (`status/waiting-*`, `status/error-*`).

## 15. New visual design (Nov 19, 2026)

Everything follows the current Figma "★ Screens" and the Design system page; tokens came in with a full Variables export (`npm run tokens`).

| Component | File | What changed |
|---|---|---|
| Screen background | `base.css` (`body::after`) | Light: plain `surface/canvas`. Dark: `surface/canvas-top → mid → bottom` with a `surface/haze` and three `surface/glow-*` radials in the top-right corner. Pinned to the screen, not to the page. The solid band under the clock is gone (a light blur instead); the fade behind the tab bar is gone |
| Card, section cards | `Card.tsx`, all screens | `surface/panel` + 1px `border/card` + `.shadow-card` (0 8 28 `glass/shadow`, a 1px `glass/highlight` inside). No background blur on cards. Rows inside have no fill and no dividers; the header has no strip of its own |
| Tab bar | `TabBar.tsx` | Frosted-glass capsule (Nov 20: Anna asked for the glass back; Figma draws it solid): see-through `surface/glass` over a 24 blur with more saturation, so what scrolls under it shows through, softened; `border/card` hairline, `glass/highlight` on top, soft shadow. Below and around it a bottom scroll edge (`.tab-bar-edge`, as in iOS 26): content fades into the screen background with a soft blur, so nothing shows sharp between the capsule and the bottom of the screen. Selected tab: a `nav/active-fill` pill (indigo in light) with `nav/active-icon` / `nav/active-content`, no shadow |
| Icon button | `IconButton.tsx` | Secondary = glass (`surface/panel`, `border/card`, 30 blur, card shadow): back and settings. Soft = `accent/primary-subtle` with an accent icon |
| Button | `Button.tsx` | Secondary = soft accent pill (`accent/primary-subtle`, `accent/on-subtle` label). New **Outline**: white with a 1px accent outline (Welcome "Add your pet") |
| Checkbox | `Checkbox.tsx` | 24 circle (was 32), check icon 14; the tap area stays 44 |
| Task row | `TaskRow.tsx` | Checkbox on the left, before the pet photo, gap 12. Done = checked + crossed out in `text/secondary`; the photo isn't faded |
| Ask Boo input | `AskBooInput.tsx` | `variant="row"` (Today): a white pill with the placeholder and the Soft camera, then a separate 56 Primary mic. `variant="field"` (Welcome): one pill on `surface/canvas` with a `border/card` hairline, camera (white, `border/card`) and mic (`accent/primary`) both 40 inside |
| Segmented control | `SegmentedControl.tsx` | White capsule (`surface/card`, `border/card`, card shadow); the chosen segment is a `nav/active-fill` pill with a medium `nav/active-content` label |
| Next up, Attention, Key fact tile | `NextUpCard.tsx`, Pet folder | Honey attention: `status/waiting-bg`; the Attention tile adds `status/attention-border` |
| Icon chips | `ListRow.tsx`, Pet folder history (`.chip-category`, `.chip-status` in `base.css`) | 40 circles with a diagonal `icon/category-chip-*` (or `icon/status-chip-*`) gradient, a 1px border inside and a white icon. Only for meaning icons; actions stay neutral |
| Boo card (Today) | `Today.tsx` | `ai/card-*` gradient with a white wash from the top left, `border/ai-card` hairline |
| Filter chip | `ui.tsx` (`Chip`) | Selected = `accent/primary` with `text/on-accent`; default = white with a `border/control` outline |
| BooFlower (new) | `BooFlower.tsx` | Boo's "jelly flower" drawing (Figma "Boo · Jelly flower", face G8): eight glossy petals, a soft core, round eyes with two glints, a smile and blush. Used by BooCharacter and the Logo mark. Its colours are the Figma Variables `boo/*` (light and dark) |
| Boo / Character | `BooCharacter.tsx` | Idle: the petals sway ±8° and the eye glints look the same way (~6 s loop), a blink at a random moment every 3–5 s (sometimes twice). No breathing. Reduced motion: only the blink. Listening unchanged. Glow and halos from `ai/glow`, `ai/halo` |
| Logo | `Logo.tsx` | The mark is the jelly flower (still) |
| Welcome | `Welcome.tsx` | Talk-first: Boo on a calm glow with sparkles, a white card with the title, "Just hand it to Boo.", the Ask Boo field and "Add your pet" (Outline); the "isn't a vet" note at the bottom. The Reminder glass card, "Tap Boo to talk", "Snap a vet paper" and the "stays on this phone" note are gone |
| Today | `Today.tsx` | Coming up is a checklist: tasks done today stay in place, checked and crossed out. No "Done today" section |

Decisions (Nov 19, 2026):
- **Text on soft accent fills uses `accent/on-subtle`** (the Call pill, the selected day in Week and Month): `accent/primary` on `accent/primary-subtle` is 4.1:1, below 4.5.
- **Section titles stay SB/Title (24 Medium).** Figma frames show 21 Semibold, but there is no text style or Variable for it yet.
- **No 20px padding token**, so cards keep 24 where Figma has 20.
- `GlassCard` and `TapHint` are no longer used on screens; they stay in Storybook for now.
- Pet folder keeps its current layout with the new look. The Figma layout (Attention card, Health list, "Share records" under the name) is a separate step.

## 16. Pet photo placeholders and step-by-step Add your pet (built, Nov 19, 2026)

Figma: page "✏️ Drafts" → "Pet avatars · final" (557:135773, section "Pet placeholders") and page "★ Screens" → section "Add your pet · step by step" (A1–A6 dog, A3h/A5h/A6h hamster, A3f/A6f fish). Screen: `AddPet.tsx` at `/pets/new`; `PetForm.tsx` now only edits a profile.

| Component | Status | Variants and states | Props | Notes |
|---|---|---|---|---|
| **Pet avatar · placeholder** | **built** (`PetAvatar.tsx`, `PetPlaceholder.tsx`, drawings in `petAnimals.ts`); new size `tiny` (20) | 17 species (`other` = paw) · large (flower frame) and ≤24 (plain circle) · Pet hero with an "add photo" badge | `pet` (no photo → placeholder by `pet.species`), `size`, `petals`; hero: `onAddPhoto` | Large: the flower in the pet's frame colour; inner circle = the pet colour with a deeper shade and a soft white top light at 75%; the animal in `pet/animal` (white; off-white in dark) with eyes, nose and smile in `pet/animal-eye`, ≈117% of the circle, clipped. ≤24: plain circle with a 1.5px `surface/card` ring, white silhouette without a face. Hero badge: 32, `surface/card` + `border/card` + card shadow, camera 18, at 45° bottom right with its centre 0.45 × the avatar size from the avatar centre along the diagonal (Figma: 58 on a 128 flower), tap area ≥44. All frame colours of one species taken → a 22 initial badge (`surface/card`, `text/primary`, `border/card`). The drawing is decorative (`aria-hidden`); alone it reads "<Name>, no photo". The 17 drawings come from the Figma SVG export, as paths in `src/components/petAnimals.ts` |
| **Species tile** | **built**, `SpeciesTile.tsx` | default · selected · pressed · focus | `species`, `label`, `selected`, `onSelect` | `surface/card`, 1px `border/card`, radius 16, ~84 high: the placeholder flower 48 and the label (SB/Caption, `text/secondary`). Selected: `accent/primary-subtle` fill + 1px `accent/primary` edge, label `text/primary`. A radio in a radio group ("Species"), tap area ≥44 |
| **Step bar** | **built**, `StepBar.tsx` | — | `steps`, `current` | One segment per step, 4 high, round ends, gap 8 (Figma 6, no token); done and current = `accent/primary`, the rest `border/card`. VoiceOver reads "Step 2 of 5" |
| **Colour swatch** | **built**, `ColorSwatches.tsx` | default · selected · pressed · focus | `label`, `value`, `onChange` | The six `pet/*` colours as 32 circles in a radio group (44 tap area each); the chosen one has a 2px `accent/primary` ring with a gap. Figma's "no colour" swatch is left out: every pet has a frame colour |
| **Boo hint** | **built**, `BooHint.tsx` | with or without actions | `children` (the text), `actions` | A Card with the mini Boo (44), the question (SB/Body) and up to two buttons under it (Primary + Ghost) |

Also used: Nav bar (`StackScreen`, new props `onBack` for a step back inside a flow, `back={false}`, and `footer` for buttons pinned to the bottom), Form field (`TextField`), Filter chip (`Chip`, new `role="radio"` for one answer: breed, unit), Checkbox, Button, Pet avatar (the flower now takes any size: 48 in the Species tile, 128 on step 2 with the add-photo badge, 112 on the "all set" card).

Gaps in Figma: popular breed lists exist only for dogs, hamsters and fish. Other species get the breed field and "I'm not sure" until Figma has their lists. Links on the grey canvas ("Add a photo", "Skip", "Or just tell Boo") use `accent/on-subtle`: `accent/primary` on `surface/canvas` is 4.4:1.

Data (built): weight units are `lb` / `kg` / `g` / `oz` (`src/lib/weight.ts`). `Species` is the 17 species above (stored `reptile` → `lizard`, `small mammal` → `hamster`). Each pet stores its frame colour (`color`); older pets get the colour they already showed. A new pet gets its species' Figma colour if no pet of that species has it, else a free one (`pickPetColor`). Weight units: lb / kg for larger pets, g / oz for small mammals, birds and reptiles; fish have none.

Colours: the placeholder's deeper inner circle uses the role tokens `pet/<colour>-deep` (ocean, lavender, pink, mint, slate) and `pet/butter-deep → pet/butter-deep-end` (a gradient for butter); in dark all `pet/*` colours are muted (photo frame petals too, on purpose).

## 17. Unified Schedule (built, Nov 19, 2026)

Figma: ★ Screens → section "Schedule · unified" (S1 Week, S2 Month, S3 Past day, S4 Empty day, S5 Dark). Built with the audit values in §18.

| Component | Status | Variants and states | Props | Notes |
|---|---|---|---|---|
| **Day tile** | **built**, `DayTile.tsx` | default · today · selected · today + selected · pressed · focus · with 0, 1, 2 or more pets | `day`, `label`, `today`, `selected`, `pets`, `onSelect` | 46 × 58 (stretches to its column), radius 16. Default: `surface/card`, 1px `border/card` inside; the number on top (Caption Strong, `text/primary`) in a 22 slot. Today: the number in a 22 `accent/primary` circle, `text/on-accent`. Selected: `accent/primary-subtle` fill + 1px `accent/primary` edge. Under the number up to two 20 pet photos with a 2px ring in the tile's own fill; more than two → one photo + a 20 "+N" badge (`text/secondary` fill, Tab label in `surface/card`, N = pets − 1). A real button with an aria-label like "Wednesday, November 4, today, 3 tasks"; the tap area is the whole tile |
| **Calendar** | **built**, `Calendar.tsx` (replaces `MonthCalendar.tsx`) | week · month | `view`, `anchor`, `selected`, `today`, `petsByDay`, `countByDay`, `onSelect`, `onPrev`, `onNext` | The month title ("November" + the year in `text/tertiary`, SB/Title), the weekday row (the selected day's column in `text/primary`, Caption Strong) and Day tiles: one row in Week, a 7-column grid in Month. Days and rows are the same 6 apart (`space/6`, added to Figma for this, Nov 19), as in Figma; the 12 is only between the weekday row and the tiles. Tiles keep their tall 46 × 58 shape (aspect 46:58) and the grid fills the width like the cards: 46 × 58 on 390, about 42 × 53 on 360, 48 × 60 on 402 (iPhone 17 Pro), 52 × 65 on 430. ‹ › move by a week or a month: not in Figma, kept so another month can be reached. The old dots and legend are gone |

The day under the calendar is built from existing parts: the day's title (SB/Title), **To do** (Task rows, "{done} of {total} done"; overdue first, then open, then done; on a past day "Cleo · waiting since Tue 12 PM"), **Happened** (List rows with the pet photo: "Cleo weighs 3.9 kg" · "9:20 AM · −0.3 kg since Nov 10", other records with their own title and detail; records now keep the time they were logged), and on an empty day a Boo hint with a title (`BooHint title="All good."`, "Next: {task} for {pet} {when}."). "Today", "Tomorrow" and "Later this week" sections are gone. Happened has no count (the Figma "2 of 5 done" there is a copy of To do's).

Settled by the audit (§18): no Semibold, radius 16, Month rows 12 apart. Not built: the small rose dot on Nov 1 in the Month mockup (its meaning isn't specified).

## 18. Design system audit (Nov 19, 2026)

| Component | File | What changes |
|---|---|---|
| Button · Secondary | `Button.tsx` | Adds a 1px `accent/primary` edge inside, in every size and state (still the soft `accent/primary-subtle` fill with an `accent/on-subtle` label) |
| Ask Boo input | `AskBooInput.tsx` | One layout, two surfaces (`surface` prop): `card` = a white `surface/card` field (on the Boo card, Today); `canvas` = a grey `surface/canvas` field (on a white card, Welcome). Both: a 1px `border/card` edge, 8 inside on the top, right and bottom; the placeholder takes the free width; the camera is a Soft 40 inside (`accent/primary-subtle`, accent icon, no edge); the mic is a Primary 56 outside on the right, gap 8, centred. Replaces `variant="row" \| "field"`. Figma's 20 on the left becomes 24 (no 20 token) |
| Welcome card | `Welcome.tsx` | Radius 24, padding 24 on every side |
| Boo colours | `BooFlower.tsx` | The jelly flower uses the Figma Variables `boo/*` (light and dark); the raw `--boo-*` values in `base.css` are gone. In dark the white glow around the face is hidden, as in the Figma dark variant |
| Day tile (§17) | `DayTile.tsx` | Radius 16 (not 12); Month rows 12 apart. No Semibold anywhere: today and the selected day are marked by their fill, not by weight. Labels use Caption Strong (Medium 13), "+N" uses the Tab label (Medium 11). Empty day: Body Strong / Body S. This settles the deviations listed in §17 |

## 19. States (Nov 19, 2026)

Figma: Design system → section "States" ("States · interactive components", "States · Dark"). No hover on phones.

| State | Rule | Where |
|---|---|---|
| Pressed | One step deeper fill. Primary → `accent/on-subtle` (in dark, where it equals `accent/primary`, a darker accent instead: `.pressable-primary` in `base.css`); Secondary and selected tiles → `accent/primary-soft`; Ghost, Outline, Secondary icon button, chips, segments, tabs, list and task rows, tappable cards, day and species tiles → `surface/subtle`. The small shrink (`.press`) stays | `Button`, `IconButton`, `Chip`, `SegmentedControl`, `TabBar`, `TaskRow`, `ListRow`, `Card`, `DayTile`, `SpeciesTile` |
| Focus | A 2px `accent/primary` ring with a 2px gap; inside the row (radius 24) for rows in a card (`focus-inset`); on the pill's own edge for tab bar items and Week / Month segments (`focus-inside`, with a thin `surface/card` line inside so it shows on a chosen pill too). Fields: their own 2px `accent/primary` border (TextField; the whole Ask Boo field) | everything tappable (§ rule in CLAUDE.md, `scripts/check-focus.mjs`) |
| Disabled | 40% opacity | all controls |
| Loading | An 18 spinner in the label colour instead of the label; the button keeps its width and ignores taps | `Button` |
| Error | The Form field Error variant (rose border, icon, message) | `TextField` |

Task row: the whole row is one checkbox now (a tap anywhere checks it; VoiceOver reads "Clean litter box, Cleo · 12:00 PM, checkbox"); the circle is only the picture.

Shown everywhere: every component in the list above has a story per state in Storybook (Pressed, Focus, Disabled, Loading, Error, Selected / Checked / Waiting / Today where they apply; `Button` and `IconButton` also have an **AllStates** table like the Figma board) and a row on `/components`, light and dark. For `/components`, components take an optional `data-state` ("pressed" / "focus") that only forces the look; screens never pass it. New `disabled` on `Chip`, `ColorSwatches`, `SpeciesTile` and `AskBooInput` (the whole input at 40%, inert).


## 20. Boo errors and first-launch sheets (Nov 19, 2026)

Figma: ★ Screens → "Boo" (8e Photo too blurry, 8f Couldn't read, 8g Camera access off, 8h Offline, 8i Didn't catch that) and the first-launch sheets 6a–6g. Copy: PRODUCT.md "When something goes wrong".

| Component | Status | Variants and states | Props | Notes |
|---|---|---|---|---|
| **Boo error** | new, `BooError.tsx` | paper (a small paper thumbnail) · voice ("…") · text (what was typed) | `input`, `message`, `primary`, `secondary` | On the right, what you gave Boo in a `surface/subtle` bubble (radius 16, padding 8; the paper thumb 44 × 56, radius 8, `surface/card` with `border/card` and grey lines). Under it the mini Boo (40) and Boo's words (SB/Body L). Two Large buttons side by side, Primary then Secondary. The second button is always a way without the AI |
| **Sheet header** | new, `SheetHeader` in `BooSheet.tsx` | idle · listening (Reading) | `title`, `listening` | Figma "Header": the mini Boo (56) and the title (SB/Title), 12 apart; content 16 below it |
| **Source row** | Card (tappable) | default · pressed · focus | — | Figma 6a "Sources": three cards (radius 16, `surface/card`, `border/card`, padding 16): a 40 `accent/primary-subtle` circle with the accent icon, the label (Body Strong), a chevron. Camera · Photo library · PDF from Files |
| **Reading** | in `BooSheet.tsx` | moving · still (reduced motion) | — | Figma 6c: a 112 × 140 paper (radius 8, grey lines, an accent title bar and circle) with an accent scan line moving down and up; under it a review-card skeleton (`surface/panel`, radius 24, grey bars) with a soft shimmer |

When each error shows up today (Boo is still faked): **Offline** when you pick a paper with no connection (the paper waits and is read as soon as you're back online); **Didn't catch that** when Talk hears nothing. **Photo too blurry**, **Couldn't read** and **Camera access off** come from the real Boo and the iPhone camera later; their place is ready (`readPaper` can fail with them) and they are in Storybook and on `/components`.

## 21. Plush Boo and the paw logo (Nov 25, 2026)

Figma: Design system → "Boo / Character" (15 states × Light / Dark), Logo page → "Logo" and "Logo / App icon".

| Component | File | What changes |
|---|---|---|
| **Boo / Character** | `BooCharacter.tsx`, images in `src/assets/boo/` | Boo is now a plush lavender paw with a face: a picture, not a drawing. Nine poses (the Figma states share these pictures): **idle** (Idle, Sway, Rest, Blink), **listening**, **wave**, **reading**, **writing**, **happy**, **oops**, **sleeping**, **bell**. Each pose has a dark version exported with Figma's dark image filters (exposure −0.15, contrast +0.15, highlights −0.2, saturation +0.1), so Boo doesn't glow on the dark screen. `look="full"` (176 × 192): the picture over a soft oval shadow (`ai/float-shadow`, 70%, blur 6), as in Figma; `look="mini"`: the picture alone (tab bar). Motion: idle = a slow gentle sway and float (about 6 s); listening = a soft pulse; reduced motion = still. No blink (there is no closed-eyes picture). `BooFlower.tsx` is removed |
| Where each pose goes (Figma ★ Screens) | screens | Welcome and the Boo card: **wave** · sheet headers, Boo sheet, tab bar: **idle** · Talk: **listening** · Reading…: **reading** · Remind you…: **bell** · Boo errors and "Notifications are off": **oops** · empty day: **sleeping** · "{Name} is all set": **happy** |
| **Boo hint** | `BooHint.tsx` | New `pose` prop (default **wave**) |
| **Logo** | `Logo.tsx` | The word "SmartBoo" alone (Figma "Logo", Type=Wordmark, Color=Blue — the app header): "Smart" in `text/primary`, "Boo" in `accent/primary`; in dark "Smart" is light and "Boo" lavender. Two sharp 3× pictures exported in the Light and Dark modes (the Figma letters are a traced shape, ~240 KB) |
| App icon | `ios/App/App/Assets.xcassets/AppIcon.appiconset`, `public/` | From Figma "Logo / App icon" |
| Cards | `Card.tsx`, section cards | A soft top-to-bottom gradient `surface/panel` → `surface/panel-end` and a light `border/panel-edge` hairline (new Figma Variables); the screen background `surface/canvas` changed in both themes |

## 22. Settings and Your profile (built, Nov 25, 2026)

Figma: ★ Screens → "18 · Settings", "18a · Your profile", "18b · Settings · Dark".

| Component | File | What changes |
|---|---|---|
| **List row** | `ListRow.tsx` | New `iconTone`: **soft** (a pale accent circle with an outline icon — every Settings row in Figma) or **accent** (the filled chip; the primary vet). Settings action rows stay neutral, as the icon-chip rule says |
| **Picker row** *(new)* | `PickerRow.tsx` | A List row whose value opens the iPhone's own picker: a list ("Vaccines & rechecks · 2 weeks before": 3 days, 1 week, 2 weeks, 1 month) or a time wheel ("Daily tasks · 8:00 AM", with Off). Under the row sits an invisible native `select` / time field with the row's label, so VoiceOver and Switch Control work as with any field. No new sheet to design |
| **Switch** *(new)* | `Switch.tsx` | The iOS-style on/off toggle for "AI consent" (today a checkbox). States: on, off, pressed, focus, disabled. Track `accent/primary` when on, `surface/subtle` when off; thumb `surface/card` |
| **Photo pick** *(new)* | `PhotoPick.tsx` | Figma 18a: a 110 circle on `surface/card` with a camera icon and "Add a photo" under it; with a photo, the photo and "Change photo". Takes over the same picker in `PetForm` and `AddPet` later (not in this change) |
| **Segmented control** | `SegmentedControl.tsx` | Used with three options for Appearance: System · Light · Dark |

Appearance is saved with the data and sets `<html data-theme>`; on the iPhone the status bar follows it (`@capacitor/status-bar`).

Screens built from these: **Settings** (profile row, Vets, Reminders, Appearance, About, For testing), **Your profile** (Name, Phone, Email optional, photo, Save), **Add a vet** (Name, Clinic, Phone, Save), **Privacy** and **AI consent** (a text and the Switch).

## 23. Pets, Pet folder and Vaccines (built, Nov 25, 2026)

Figma: ★ Screens → "Pets & Share": "11 · Pets", "12 · Pet folder · Rocky", "13 · Vaccines · Rocky", "14 · Edit profile".

| Component | File | What changes |
|---|---|---|
| **Attention card** | `AttentionCard.tsx` | Moves out of the Pet folder into its own file (it was the Key fact tile's Attention tone). Honey `status/waiting-bg`. With an icon: a status chip, the title, a rose line and up to two buttons (Pet folder: "Rabies & DHPP are overdue" — Book vet / Mark done). Without an icon: a one-line banner with the rose dot (Vaccines: "2 vaccines are overdue. Book a visit with Dr. Lee?") |
| **Key fact tile** | — | Removed: the Pet folder shows key facts as one **Health** list (List rows with a label, a rose overdue line, a weight sparkline as the value) |
| **List row** | `ListRow.tsx` | The value on the right may take up to 3/5 of the row (was 2/5), so "985 141 000 123 456" fits in the Profile list |
| **Sheet header** | `BooSheet.tsx` | Exported, for the vaccine source sheet on the Vaccines screen |

Screens: **Pets** (no "Add a pet" card; the + button adds), **Pet folder** (photo in its flower, facts line with the weight, Share records, Attention card, Health, History with a Search link, Profile with an Edit link), **Vaccines** (new; tapping a vaccine opens the vet paper it came from), **Edit {name}** (Frame colour card, the Vet picked from your vets). A vaccine reminder now opens Vaccines.

## 24. Tell Boo about your pet (built, Nov 25, 2026)

Figma: ★ Screens → "Main flow · tell Boo": 6i Tell Boo, 6j AI consent, 6k Review card · from words, 6l Add a photo, 6m Today · told Boo.

| Component | File | What changes |
|---|---|---|
| **Ask Boo input** | `AskBooInput.tsx` | New: typing in place (`value`, `onChange`, `onSend`), used on Welcome. The field is a real text input; once it has text, the mic becomes a Send arrow (Primary 56) and Return sends |
| **Boo sheet** | `BooSheet.tsx` | AI consent is the short Figma 6j version (mini Boo, one sentence, Continue / Not now). New step "Here's what I found" (6k): the pet Boo heard about as a List row, **Looks right** / **Edit details** (Name, Species, Breed, Date of birth in place), then "Add a photo of {name}?" (6l) |
| **Boo hint** | `BooHint.tsx` | Used on Today (6m) in place of the Boo card while a pet's shots are unknown: "I don't know {name}'s shots yet. Snap the last vet paper?" — Snap a vet paper / Not now (quiet for a week) |

Today's greeting adds the owner's name from Your profile: "Good morning, Anna".

## 25. Empty states (built, Nov 25, 2026)

Figma: ★ Screens → "Welcome & empty states". Each empty screen says what comes next and offers one way forward.

| Component | File | What it is |
|---|---|---|
| **Boo bubble** *(new)* | `BooBubble.tsx` | Boo (96, in a pose) with a speech bubble under him: `surface/card`, card shadow, radius 24, a small tail pointing up at Boo, centred Body text. Props: `pose`, the text, and an optional action under the bubble. Used on the empty Schedule (sleeping) and for a search with no results (reading) |

Where: **Schedule** with no tasks at all ("Nothing planned yet. Reminders show up here once I read a vet paper." — Snap a vet paper); **a new pet's folder** (Health: Boo hint "I don't know {name}'s shots yet. Snap the last vet paper?"; History: "Papers, weights and notes will show up here by date."; Profile: empty values are an **Add** link to Edit); **History search** with no results ("I couldn't find "{query}" in {name}'s records." — Clear search). The camera-off sheet waits for the camera plugin.

## 26. Tab bar: soft selected tab, solid capsule (built, Nov 25, 2026)

Figma: Design system → "Tab bar" (Active × Theme) and the tab bars on the Dark mode screens.

| Component | File | What changes |
|---|---|---|
| **Tab bar** | `TabBar.tsx`, `.tab-capsule` / `.tab-on` in `base.css` | The capsule is solid `surface/card` with the `border/card` hairline and the soft shadow; no background blur. In Figma the dark capsule is the primitive `lavender/900`; the app uses `surface/card` until Figma binds it to a colour role. The selected tab is a soft pill with the filled icon: light `accent/primary-subtle` with `accent/on-subtle`, dark `accent/primary-soft` with `text/primary`. The due dot's ring takes the pill's colour on the selected tab |

The `nav/active-*` variables stay in the tokens: the Segmented control (Week / Month, Appearance) still uses them for its chosen segment.

## 27. Boo replies as a conversation (built, Nov 25, 2026)

Figma: ★ Screens → "Boo": 8 Boo sheet, 8b Which pet, 8c Red flag, 8d Call the vet, 10 Boo answer, 3 Logged.

| Part | File | What it is |
|---|---|---|
| **You said** | `BooSheet.tsx` | Your phrase on the right: a `surface/subtle` bubble (radius 24), Body S, up to 80% wide |
| **Boo says** | `BooSheet.tsx` | The mini Boo (40) and Boo's reply in Body, on the left |
| **Source card** | `BooSheet.tsx` (a List row in a Card) | Where an answer comes from: a soft file icon, "Source: vaccine certificate", "Paws & Claws · Nov 1, 2023", a chevron to the pet's Vaccines (or folder) |
| **Pet tile** | `BooSheet.tsx` | Which pet is this for? A card-like button with the pet's photo (56) and name, three in a row; "Both" shows two photos overlapping |

Every result in the Boo sheet starts with **You said** and **Boo says**. The answer adds the Source card and Book vet / Remind me (a vaccine that is due); the red flag adds **Call {vet}** and **I'll watch {name} — save it**. The sheet title adds the owner's name ("What's up, Anna?"); a saved note reads "Saved to {name}'s notes".

## 28. Share records (built, Nov 25, 2026)

Figma: ★ Screens → "Pets & Share": 15 Pick a set, 16 Pick pets, 17 PDF preview, 17a iOS share sheet.

| Component | File | What changes |
|---|---|---|
| **List row** | `ListRow.tsx` | New `selected`: the row is a radio in a group, tinted `accent/primary-subtle` with a checked circle (Checkbox picture) when chosen, an empty circle when not (Share → "Who is it for?") |
| **Attention card** | `AttentionCard.tsx` | Used on Pick pets: "Rocky's rabies is overdue — the boarding may ask for proof." |

Screens: **Who is it for?** (three sets with soft icons, Next · pick pets), **Which pets?** (the set's name above; each pet with its vaccine status; Make PDF · N pets), **Preview** (the SmartBoo wordmark and date, "{Set} record", a block per pet, "Vet & owner"; Share PDF opens the iOS share sheet). One builder (`lib/shareRecord.ts`) makes both the preview and the PDF (`lib/pdf.ts`, jsPDF + `@capacitor/share`).

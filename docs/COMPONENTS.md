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
| **Tab bar** + **Tab item** | Today, Schedule, Pets, Pet folder, Settings, Boo sheet | Active tab: Today, Schedule or Pets | pressed, focus, active (`aria-current`) | active tab (read from the address); what the Boo button does | `TabBar.tsx`. The active tab is shown only by brighter text (55% opacity on the others). It doesn't use the `nav-active-*` tokens yet. |

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
| Tab bar | `TabBar.tsx` | `active` (today, schedule, pets or none) · `onBoo` · `docked` |

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
| Glass card (Figma "Glass card") | `GlassCard.tsx` | `pet` (photo, 40) · `title` · `caption`. Frosted glass: a see-through fill, blur behind it and an `ai/*` gradient edge. Only on Welcome for now |
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

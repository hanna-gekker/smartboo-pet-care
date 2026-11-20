# Feature brief: Reminders (local notifications)

Plugin: `@capacitor/local-notifications`. Branch: `feat/reminders`.

## 1. Why

Owners forget vaccines, meds and rechecks because the dates live on paper; SmartBoo should tap them on the shoulder at the right moment, even when the app is closed.

## 2. Scenario

1. Anna snaps Rocky's vaccine certificate. Boo shows the review card → **Looks right**.
2. Boo asks: "Remind you 2 weeks before each one?" → **Yes**.
3. Only now iOS asks: "SmartBoo Would Like to Send You Notifications" → **Allow**.
4. SmartBoo schedules a reminder for every open task that matters (vaccines, meds, lab and vet rechecks, insurance deadlines; not daily chores like feeding):
   - **Before** — at 9:00 AM, as many days before as set in Settings → Reminders (2 weeks by default), for dated items: vaccines, lab and vet rechecks, insurance.
   - **On the day** — at 9:00 AM for items without a time; at the dose time for meds and visits that have one (e.g. ear drops at 8:00 AM and 8:00 PM).
5. A toast confirms: "3 reminders set".
6. Two weeks later, the lock screen shows the reminder. Anna taps it → SmartBoo opens **Schedule** on that day, with the task in **To do**, so she can check it off or see what else is due.
7. When a task is checked off, moved or deleted, its reminders are updated; when it's done, they're gone.

Notification copy:

| When | Title | Body |
|---|---|---|
| Before (vaccine, lab, vet, insurance) | Rocky's rabies booster is in 2 weeks | Due Wed, Dec 9. Book the vet or snap the new certificate. |
| On the day, no time | Today: Rocky's rabies booster | Due today. Tap to see Rocky's day. |
| On the day, a med with a time | Time for Rocky's ear drops | Otomax · 4 drops |
| On the day, a visit with a time | Today at 10:30 AM: Rocky's ear recheck | Bayside Animal Clinic |
| Insurance, before | Submit the ear-visit claim · in 2 weeks | For Rocky · due Wed, Dec 9. |

"2 weeks" follows the Settings value ("in 3 days", "in 1 week", "in 1 month"). The title uses the task title; the body adds the detail when there is one.

## 3. States

| State | What the person sees |
|---|---|
| First launch | Nothing is asked. Permission comes only after "Remind you…? → Yes" (never on app start). |
| Permission given | Reminders are scheduled; toast "3 reminders set". Settings → Reminders: "Notifications · On". |
| Permission denied | The tasks are still saved in Schedule. The sheet says: "Notifications are off, so I can't remind you. You can turn them on in Settings." [Open Settings] [Not now]. Settings → Reminders: "Notifications · Off" with [Open Settings]. |
| Error (scheduling fails) | Toast "Couldn't set reminders. They're still in your Schedule." Nothing else breaks. |
| Empty | Nothing to remind about (no open tasks): no notifications, Settings shows "Notifications · On" and "No reminders yet". |
| Web / Storybook | No notifications in the browser: the same flow, the toast says how many reminders would be set, nothing crashes. |

## 4. Permission text

iOS asks for notification permission with its own system alert; it has no custom usage string in Info.plist (unlike camera or microphone). Our explanation is the moment of asking: the pre-prompt "Remind you 2 weeks before each one?" right before the system alert, and the "Notifications are off" message when denied (both above).

## 5. Done when (I check by hand)

- [ ] After Looks right → Yes → Allow, a reminder set for a minute ahead (test button in Settings → For testing) shows on the simulator lock screen with the right title and body.
- [ ] Tapping the notification opens Schedule on that task's day.
- [ ] Checking off a task removes its pending reminders; adding a new paper adds new ones (count in Settings changes).
- [ ] Don't Allow → the sheet explains and offers Open Settings; Settings → Reminders shows Off with Open Settings; the app keeps working.
- [ ] After closing and reopening the app, reminders are still scheduled and Settings shows the right state.
- [ ] Light and dark themes, Larger Text: the sheet and Settings rows read well.

## 6. Not now

- Choosing the reminder time (fixed 9:00 AM).
- Snooze and "Mark done" buttons on the notification.
- Push notifications from a server, household sharing.
- Badges on the app icon.
- Android.

## 7. Plugin and components

- `@capacitor/local-notifications` (iOS via Swift Package Manager, `npx cap sync ios`). A small module `src/lib/reminders.ts` wraps it: ask permission, check permission, schedule for tasks, cancel, open settings; in the browser it does nothing and reports what it would do.
- Components (docs/COMPONENTS.md): BooSheet remind step (Sheet header, Button; "Notifications are off" uses the same header, a line of text and two buttons), `Toast`, Settings `Card` + `ListRow` (status row with an action pill "Open Settings"), Schedule `Calendar` (opens on the day).

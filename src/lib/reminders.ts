// Reminders as iOS local notifications (docs/features/reminders.md).
// Which tasks get reminders and what they say is worked out here, in plain code (planReminders); the plugin only
// shows them. The whole list is rebuilt whenever tasks, pets or settings change, so a task that is done, moved or
// deleted never leaves a stale reminder. In the browser there are no notifications: nothing is scheduled and
// nothing breaks.

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import type { Pet, Settings, Task, TaskKind } from '../data/types'
import { addDays, formatDay, formatTime, fromDay, toDay } from './dates'

export type Permission = 'granted' | 'denied' | 'prompt'

/** The settings reminders depend on (Settings → Reminders). */
export type ReminderSettings = Pick<Settings, 'remindDaysBefore' | 'dailyTime'>

export type PlannedReminder = {
  /** iOS needs a number; ids are given in time order. */
  id: number
  title: string
  body: string
  at: Date
  /** The task's day. */
  day: string
  /** Where tapping it goes: the pet's Vaccines for a vaccine (Figma "Push from Boo"), else Schedule on that day. */
  path: string
}

/** Dated things get a reminder some days before; meds only on the day, at their time. Chores get none. */
const BEFORE: TaskKind[] = ['vaccine', 'lab', 'vet', 'insurance']
const MORNING = '09:00'
/** iOS keeps at most 64 pending local notifications per app; the soonest ones win. */
const LIMIT = 60
const TEST_ID = 9999
/** Daily tasks summary (Settings → Reminders → Daily tasks): on by default at 8:00 AM, for the next week. */
export const DAILY_DEFAULT = '08:00'
const DAILY_DAYS = 7
/** How many task names the daily summary lists before "+N more". */
const DAILY_NAMES = 2

export const isNative = () => Capacitor.isNativePlatform()

/** "in 3 days", "in 1 week", "in 2 weeks", "in 1 month" (Settings → Reminders). */
export function spanLabel(days: number): string {
  if (days === 30) return 'in 1 month'
  if (days % 7 === 0) return `in ${days / 7} week${days === 7 ? '' : 's'}`
  return `in ${days} day${days === 1 ? '' : 's'}`
}

const at = (day: string, time: string) => {
  const d = fromDay(day)
  const [h, m] = time.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}
/** "Rabies booster" → "rabies booster" after a name; a product name like "Revolution Plus" keeps its capitals. */
const lower = (s: string) => (/[A-Z]/.test(s.slice(1)) ? s : s[0].toLowerCase() + s.slice(1))

/** The daily summary's time: HH:mm, or undefined when it is off. */
export const dailyTimeOf = (s: ReminderSettings) => (s.dailyTime === 'off' ? undefined : (s.dailyTime ?? DAILY_DEFAULT))

/** Every reminder the open tasks should have right now, soonest first. */
export function planReminders(tasks: Task[], pets: Pet[], settings: ReminderSettings, now = new Date()): PlannedReminder[] {
  const daysBefore = settings.remindDaysBefore
  const out: Omit<PlannedReminder, 'id'>[] = []

  // Daily tasks summary: one push a day at the chosen time, only on days with something to do (chores too).
  // "SmartBoo · Today: Rocky's ear drops, Milo's walk +2 more." Tap opens Today.
  const daily = dailyTimeOf(settings)
  if (daily) {
    const first = toDay(now)
    for (let i = 0; i < DAILY_DAYS; i++) {
      const day = addDays(first, i)
      // Two doses of the same med are one line: "Rocky's ear drops"
      const names = [...new Set(tasks
        .filter((t) => !t.doneAt && t.date === day)
        .sort((a, b) => (a.time ?? '99').localeCompare(b.time ?? '99'))
        .flatMap((t) => {
          const pet = pets.find((p) => p.id === t.petId)
          return pet ? [t.kind === 'insurance' ? t.title : `${pet.name}'s ${lower(t.title)}`] : []
        }))]
      if (!names.length) continue
      const more = names.length - DAILY_NAMES
      const body = `Today: ${names.slice(0, DAILY_NAMES).join(', ')}${more > 0 ? ` +${more} more` : ''}.`
      out.push({ title: 'SmartBoo', body, at: at(day, daily), day, path: '/' })
    }
  }

  for (const t of tasks) {
    if (t.doneAt || t.kind === 'chore') continue
    const pet = pets.find((p) => p.id === t.petId)
    if (!pet) continue
    const what = t.kind === 'insurance' ? t.title : `${pet.name}'s ${lower(t.title)}`
    const due = formatDay(t.date, { weekday: 'short', month: 'short', day: 'numeric' })

    const path = t.kind === 'vaccine' ? `/pets/${pet.id}/vaccines` : `/schedule?day=${t.date}`

    if (BEFORE.includes(t.kind)) {
      out.push(
        t.kind === 'vaccine'
          ? // Figma "0 · Push from Boo": SmartBoo, "Rocky's rabies is due in 2 weeks." — tap opens his Vaccines
            { title: 'SmartBoo', body: `${what} is due ${spanLabel(daysBefore)}.`, at: at(addDays(t.date, -daysBefore), MORNING), day: t.date, path }
          : {
              title: t.kind === 'insurance' ? `${t.title} · ${spanLabel(daysBefore)}` : `${what} is ${spanLabel(daysBefore)}`,
              body: t.kind === 'insurance' ? `For ${pet.name} · due ${due}.` : `Due ${due}. Tap to see ${pet.name}'s day.`,
              at: at(addDays(t.date, -daysBefore), MORNING),
              day: t.date,
              path,
            },
      )
    }

    if (t.time && t.kind === 'med') {
      out.push({ title: `Time for ${pet.name}'s ${lower(t.title)}`, body: t.detail ?? `Tap to see ${pet.name}'s day.`, at: at(t.date, t.time), day: t.date, path })
    } else if (t.time) {
      out.push({ title: `Today at ${formatTime(t.time)}: ${what}`, body: t.detail ?? `Tap to see ${pet.name}'s day.`, at: at(t.date, t.time), day: t.date, path })
    } else if (t.kind === 'vaccine') {
      out.push({ title: 'SmartBoo', body: `${what} is due today.`, at: at(t.date, MORNING), day: t.date, path })
    } else {
      out.push({ title: `Today: ${what}`, body: `Due today. Tap to see ${pet.name}'s day.`, at: at(t.date, MORNING), day: t.date, path })
    }
  }
  return out
    .filter((r) => r.at > now)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, LIMIT)
    .map((r, i) => ({ ...r, id: i + 1 }))
}

/** Asks nothing: what the person already chose. Always 'granted' in the browser, so the flow can be tried there. */
export async function checkPermission(): Promise<Permission> {
  if (!isNative()) return 'granted'
  const { display } = await LocalNotifications.checkPermissions()
  return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt'
}

/** Shows the iOS permission alert (only the first time; after that iOS answers with the saved choice). */
export async function askPermission(): Promise<Permission> {
  if (!isNative()) return 'granted'
  const { display } = await LocalNotifications.requestPermissions()
  return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt'
}

/** Replaces all pending reminders with the plan. Never asks for permission: without it, schedules nothing.
 *  Returns how many reminders are set (in the browser: how many would be). */
export async function syncReminders(tasks: Task[], pets: Pet[], settings: ReminderSettings): Promise<number> {
  const plan = planReminders(tasks, pets, settings)
  if (!isNative()) return plan.length
  if ((await checkPermission()) !== 'granted') return 0
  const { notifications } = await LocalNotifications.getPending()
  // The test reminder (Settings → For testing) is left alone
  const old = notifications.filter((n) => n.id !== TEST_ID)
  if (old.length) await LocalNotifications.cancel({ notifications: old.map((n) => ({ id: n.id })) })
  if (plan.length) {
    await LocalNotifications.schedule({
      notifications: plan.map((r) => ({ id: r.id, title: r.title, body: r.body, schedule: { at: r.at, allowWhileIdle: true }, extra: { day: r.day, path: r.path } })),
    })
  }
  return plan.length
}

/** How many reminders iOS is holding right now. */
export async function pendingCount(): Promise<number> {
  if (!isNative()) return 0
  return (await LocalNotifications.getPending()).notifications.length
}

/** Opens SmartBoo's own page in the iPhone Settings app (where notifications can be turned back on). */
export function openAppSettings() {
  if (isNative()) window.location.href = 'app-settings:'
}

/** Calls back with where to go when a reminder is tapped (also when the tap opened the app). Returns a remover. */
export function onReminderTap(open: (path: string) => void): () => void {
  if (!isNative()) return () => {}
  const handle = LocalNotifications.addListener('localNotificationActionPerformed', (a) => {
    const extra = a.notification.extra as { day?: string; path?: string } | undefined
    if (extra?.path) open(extra.path)
    else if (extra?.day) open(`/schedule?day=${extra.day}`)
  })
  return () => void handle.then((h) => h.remove())
}

/** Settings → For testing: one reminder in a minute, for the soonest open task (so tapping it opens a real day).
 *  Asks for permission if it was never asked. */
export async function sendTestReminder(tasks: Task[], pets: Pet[], settings: ReminderSettings): Promise<Permission> {
  let permission = await checkPermission()
  if (permission === 'prompt') permission = await askPermission()
  if (permission !== 'granted' || !isNative()) return permission
  // The test shows the Figma push (a vaccine) when there is one, else the next reminder
  const plan = planReminders(tasks, pets, settings)
  const next = plan.find((r) => r.path.endsWith('/vaccines')) ?? plan[0]
  await LocalNotifications.schedule({
    notifications: [
      {
        id: TEST_ID,
        title: next?.title ?? 'Reminders are on',
        body: next?.body ?? 'This is how SmartBoo will remind you.',
        schedule: { at: new Date(Date.now() + 60_000), allowWhileIdle: true },
        extra: { day: next?.day, path: next?.path },
      },
    ],
  })
  return permission
}

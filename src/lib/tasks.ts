// What a task row shows: its state and the grey line under the title.
// Kept out of TaskRow, so the component only draws what it is given.

import type { Task } from '../data/types'
import { formatDay, formatTime, today } from './dates'

export type TaskState = 'default' | 'done' | 'waiting'

const clock = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

/** done — crossed out; waiting — not done and its day or time has passed; default — everything else. */
export function taskState(task: Task, now = new Date()): TaskState {
  if (task.doneAt) return 'done'
  const t = today()
  if (task.date < t || (task.date === t && task.time !== undefined && task.time < clock(now))) return 'waiting'
  return 'default'
}

/** "Rocky · 8 AM", "Rocky · Thu, Nov 19 · 8 AM", "Rocky · waiting since 8 AM", "Rocky · overdue since Nov 6" */
export function taskMeta(task: Task, petName: string | undefined, { showDate = false, now = new Date() } = {}): string {
  let when = showDate ? formatDay(task.date, { weekday: 'short', month: 'short', day: 'numeric' }) : ''
  if (task.time) when = [when, formatTime(task.time)].filter(Boolean).join(' · ')
  if (taskState(task, now) === 'waiting') {
    when = task.date === today() ? `waiting since ${formatTime(task.time)}` : `overdue since ${formatDay(task.date)}`
  }
  return [petName, when].filter(Boolean).join(' · ')
}

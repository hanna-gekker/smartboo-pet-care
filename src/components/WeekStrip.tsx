// Week strip — Figma "Empty · Schedule" → "Week strip": the week as one soft card of 7 pills (44 × 72): the short
// weekday, the date and up to 3 dots (overdue = status/waiting-dot, due = status/due-dot). The chosen day is the
// whole pill on accent/primary-subtle with a 1.5px accent/primary edge, its text accent/primary. Each pill is a
// button that picks the day; VoiceOver reads the full date and how many tasks it has.

import { formatDay, fromDay } from '../lib/dates'

type WeekStripProps = {
  /** The 7 days, Monday first, "YYYY-MM-DD". */
  days: string[]
  selected: string
  today: string
  /** Dots per day, overdue first. */
  dotsByDay?: Record<string, ('waiting' | 'due')[]>
  onSelect: (day: string) => void
}

export function WeekStrip({ days, selected, today, dotsByDay = {}, onSelect }: WeekStripProps) {
  return (
    <div role="group" aria-label="Days of the week" className="panel-card grid grid-cols-7 rounded-24 p-12">
      {days.map((d) => {
        const on = d === selected
        const dots = (dotsByDay[d] ?? []).slice(0, 3)
        return (
          <button
            key={d}
            type="button"
            aria-pressed={on}
            aria-label={`${formatDay(d, { weekday: 'long', month: 'long', day: 'numeric' })}${d === today ? ', today' : ''}${dots.length ? `, ${dots.length} task${dots.length === 1 ? '' : 's'}` : ''}`}
            onClick={() => onSelect(d)}
            className={`press focus-inside mx-auto flex h-[72px] w-full max-w-[44px] flex-col items-center justify-center gap-4 rounded-full ${
              on ? 'bg-accent-primary-subtle text-accent-primary ring-[1.5px] ring-inset ring-accent-primary' : 'active:bg-surface-subtle'
            }`}
          >
            <span className={`text-caption ${on ? '' : 'text-text-secondary'}`}>{formatDay(d, { weekday: 'short' })}</span>
            <span className={`text-body font-medium ${on ? '' : 'text-text-primary'}`}>{fromDay(d).getDate()}</span>
            <span aria-hidden="true" className="flex h-[4px] gap-2">
              {dots.map((k, i) => (
                <span key={i} className={`size-[4px] rounded-full ${k === 'waiting' ? 'bg-status-waiting-dot' : 'bg-status-due-dot'}`} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}

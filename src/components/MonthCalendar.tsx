// Month calendar — Figma "Month" in "5b · Schedule · Month".
// Month name with ‹ › arrows, a weekday row, day cells (40×44), one dot under a day, and a legend.
// The selected day is a blue capsule. Past days have grey numbers. Data comes in as props.

import { addDays, formatDay, fromDay, weekOf } from '../lib/dates'
import { IconButton } from './IconButton'

export type DayDot = 'overdue' | 'due' | 'done'

type MonthCalendarProps = {
  /** Any day in the month to show, "2026-11-04". */
  month: string
  selected: string
  today: string
  /** The dot under each day that has one. */
  dots: Record<string, DayDot>
  onSelect: (day: string) => void
  onPrev: () => void
  onNext: () => void
}

const dotColor: Record<DayDot, string> = {
  overdue: 'bg-status-waiting-dot',
  due: 'bg-status-due-dot',
  done: 'bg-status-done-dot',
}

const legend: { dot: DayDot; label: string }[] = [
  { dot: 'overdue', label: 'Overdue' },
  { dot: 'due', label: 'Due' },
  { dot: 'done', label: 'Done' },
]

/** All weeks that touch the month, Monday first; days outside the month are null. */
function monthWeeks(month: string): (string | null)[][] {
  const first = month.slice(0, 8) + '01'
  const m = first.slice(0, 7)
  const weeks: (string | null)[][] = []
  for (let start = weekOf(first)[0]; start.slice(0, 7) <= m; start = addDays(start, 7)) {
    weeks.push(weekOf(start).map((d) => (d.slice(0, 7) === m ? d : null)))
  }
  return weeks
}

export function MonthCalendar({ month, selected, today, dots, onSelect, onPrev, onNext }: MonthCalendarProps) {
  const weeks = monthWeeks(month)
  return (
    <div className="flex flex-col gap-12 rounded-24 bg-surface-card p-16">
      <div className="flex items-center gap-8">
        <p className="flex-1 text-body font-medium">{fromDay(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div className="-my-12 -mr-12 flex">
          <IconButton variant="plain" icon="chevron-left" label="Previous month" onClick={onPrev} />
          <IconButton variant="plain" icon="chevron-right" label="Next month" onClick={onNext} />
        </div>
      </div>

      <div className="grid grid-cols-7" aria-hidden="true">
        {weekOf(month).map((d) => (
          <span key={d} className="text-center text-caption text-text-secondary">
            {formatDay(d, { weekday: 'short' })}
          </span>
        ))}
      </div>

      <div role="grid" aria-label="Days" className="flex flex-col gap-12">
        {weeks.map((week, i) => (
          <div key={i} role="row" className="grid grid-cols-7">
            {week.map((day, j) => {
              if (!day) return <span key={j} role="gridcell" />
              const active = day === selected
              const dot = dots[day]
              return (
                <span key={day} role="gridcell" className="flex justify-center">
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-label={`${formatDay(day, { weekday: 'long', month: 'long', day: 'numeric' })}${dot ? `, ${dot}` : ''}`}
                    onClick={() => onSelect(day)}
                    className={`press flex h-control-44 w-full max-w-control-44 flex-col items-center justify-center gap-2 rounded-full ${
                      active ? 'bg-accent-primary-subtle ring-[1.5px] ring-accent-primary ring-inset' : ''
                    }`}
                  >
                    <span
                      className={
                        active || day === today
                          ? 'text-body font-medium text-accent-primary'
                          : `text-body-s ${day < today ? 'text-text-secondary' : 'text-text-primary'}`
                      }
                    >
                      {fromDay(day).getDate()}
                    </span>
                    <span className={`size-4 rounded-full ${dot ? dotColor[dot] : ''}`} aria-hidden="true" />
                  </button>
                </span>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-16 pt-8" aria-hidden="true">
        {legend.map((l) => (
          <span key={l.dot} className="flex items-center gap-[6px] text-caption text-text-secondary">
            <span className={`size-8 rounded-full ${dotColor[l.dot]}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}

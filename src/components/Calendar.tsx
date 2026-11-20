// Calendar — Figma "Schedule · unified": the month title ("November" + the year in text/tertiary, SB/Title), the
// weekday row and Day tiles. Week: one row of 7 tiles. Month: the same tiles in a 7-column grid. Days and rows are the
// same 6 apart (space/6), as in Figma; tiles keep their tall 46 × 58 shape (aspect) and fill the width like the cards below (46 × 58 on a 390 phone).
// The selected day's weekday is text/primary, Caption Strong. ‹ › move by a week or a month (not in Figma: without
// them another month can't be reached). Data comes in as props.

import type { Pet } from '../data/types'
import { addDays, formatDay, fromDay, weekOf } from '../lib/dates'
import { DayTile } from './DayTile'
import { IconButton } from './IconButton'

type CalendarProps = {
  view: 'week' | 'month'
  /** Week view: the selected week; month view: any day in the month to show. */
  anchor: string
  selected: string
  today: string
  /** Pets with something on each day, "2026-11-04" → pets. */
  petsByDay: Record<string, Pet[]>
  /** Task count per day, read by VoiceOver. */
  countByDay: Record<string, number>
  onSelect: (day: string) => void
  onPrev: () => void
  onNext: () => void
}

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

export function Calendar({ view, anchor, selected, today, petsByDay, countByDay, onSelect, onPrev, onNext }: CalendarProps) {
  const weeks = view === 'month' ? monthWeeks(anchor) : [weekOf(anchor)]
  // The title follows the month the user is looking at: the shown month, or the selected day's month in Week
  const titleDay = view === 'month' ? anchor : selected
  const unit = view === 'month' ? 'month' : 'week'
  const selectedColumn = weekOf(selected).indexOf(selected)

  const tile = (day: string) => {
    const n = countByDay[day] ?? 0
    return (
      <DayTile
        day={fromDay(day).getDate()}
        label={`${formatDay(day, { weekday: 'long', month: 'long', day: 'numeric' })}${day === today ? ', today' : ''}${n ? `, ${n} task${n === 1 ? '' : 's'}` : ''}`}
        today={day === today}
        selected={day === selected}
        pets={petsByDay[day]}
        onSelect={() => onSelect(day)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-8 pl-4">
        <h2 className="flex-1 font-display text-title font-medium">
          {fromDay(titleDay).toLocaleDateString('en-US', { month: 'long' })} <span className="text-text-tertiary">{fromDay(titleDay).getFullYear()}</span>
        </h2>
        <div className="-my-12 -mr-12 flex">
          <IconButton variant="plain" icon="chevron-left" label={`Previous ${unit}`} onClick={onPrev} />
          <IconButton variant="plain" icon="chevron-right" label={`Next ${unit}`} onClick={onNext} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-6" aria-hidden="true">
        {weekOf(anchor).map((d, i) => (
          <span key={d} className={`text-center text-caption ${i === selectedColumn ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
            {formatDay(d, { weekday: 'short' })}
          </span>
        ))}
      </div>

      <div role="group" aria-label={view === 'month' ? 'Days of the month' : 'Days of the week'} className="grid grid-cols-7 gap-6">
        {weeks.map((week, i) => (
          <div key={i} className="contents">
            {week.map((day, j) => (day ? <div key={day}>{tile(day)}</div> : <span key={j} />))}
          </div>
        ))}
      </div>
    </div>
  )
}

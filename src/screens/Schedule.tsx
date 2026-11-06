import { useState } from 'react'
import { Icon } from '../components/Icon'
import { TaskRow } from '../components/TaskRow'
import { Card, IconButton } from '../components/ui'
import { petById, useApp } from '../data/useApp'
import type { Task } from '../data/types'
import { addDays, formatDay, fromDay, today, weekOf } from '../lib/dates'

const byTime = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))

export function Schedule() {
  const { pets, tasks, toggleTask } = useApp()
  const t = today()
  const [selected, setSelected] = useState(t)
  const week = weekOf(selected)
  const hasTasks = (day: string) => tasks.some((x) => x.date === day && !x.doneAt)

  const onDay = tasks.filter((x) => x.date === selected).sort(byTime)
  const due = onDay.filter((x) => !x.doneAt)
  const done = onDay.filter((x) => x.doneAt)
  const isToday = selected === t
  const isPast = selected < t
  const tomorrow = isToday ? tasks.filter((x) => x.date === addDays(t, 1) && !x.doneAt).sort(byTime) : []
  const later = isToday ? tasks.filter((x) => x.date > addDays(t, 1) && x.date <= week[6] && !x.doneAt).sort(byTime) : []

  const section = (title: string, list: Task[], showDate = false) =>
    list.length > 0 && (
      <section className="mt-6">
        <h2 className="mb-2 text-[13px] font-semibold tracking-wide text-ink-2 uppercase">{title}</h2>
        <Card className="!py-1">
          {list.map((x) => (
            <TaskRow key={x.id} task={x} pet={petById(pets, x.petId)} onToggle={() => toggleTask(x.id)} showDate={showDate} />
          ))}
        </Card>
      </section>
    )

  return (
    <div className="pt-safe min-h-dvh px-gutter pb-36">
      <header className="flex min-h-12 items-center justify-between">
        <h1 className="font-display text-[28px] font-bold">Schedule</h1>
        {!isToday && (
          <button type="button" onClick={() => setSelected(t)} className="press min-h-11 rounded-full px-3 text-[15px] font-medium text-accent">
            Today
          </button>
        )}
      </header>

      {/* Week strip */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[15px] font-medium">{fromDay(week[0]).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div className="-mr-2 flex">
          <IconButton icon="back" label="Previous week" onClick={() => setSelected(addDays(selected, -7))} />
          <IconButton icon="chevron" label="Next week" onClick={() => setSelected(addDays(selected, 7))} />
        </div>
      </div>
      <div role="tablist" aria-label="Days" className="mt-1 grid grid-cols-7">
        {week.map((day) => {
          const active = day === selected
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(day)}
              className={`press flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-sm ${active ? 'bg-bar text-on-bar' : day === t ? 'text-accent' : ''}`}
            >
              <span className={`text-[11px] font-medium ${active ? '' : 'text-ink-2'}`}>{formatDay(day, { weekday: 'narrow' })}</span>
              <span className="font-display text-[17px] font-semibold">{fromDay(day).getDate()}</span>
              <span className={`size-1.5 rounded-full ${hasTasks(day) ? (active ? 'bg-on-bar' : 'bg-warn') : 'bg-transparent'}`} />
            </button>
          )
        })}
      </div>

      {!isToday && <p className="mt-6 font-display text-[20px] font-semibold">{formatDay(selected, { weekday: 'long', month: 'long', day: 'numeric' })}</p>}

      {section(isToday ? 'Due today' : isPast ? 'Not done' : 'Due', due)}
      {section(isToday ? 'Done today' : 'Done', done)}
      {section('Tomorrow', tomorrow)}
      {section('Later this week', later, true)}

      {onDay.length === 0 && tomorrow.length === 0 && later.length === 0 && (
        <div className="mt-12 flex flex-col items-center text-center text-ink-2">
          <Icon name="schedule" size={32} />
          <p className="mt-2 text-[15px]">{isPast ? 'Nothing was logged that day.' : 'Nothing planned for this day.'}</p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/IconButton'
import { TaskRow } from '../components/TaskRow'
import { petById, useApp } from '../data/useApp'
import type { Task } from '../data/types'
import { addDays, formatDay, fromDay, today, weekOf } from '../lib/dates'
import { taskMeta, taskState } from '../lib/tasks'

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
      <section className="mt-24">
        <h2 className="mb-8 text-body-s font-medium text-text-secondary uppercase">{title}</h2>
        <Card variant="list">
          {list.map((x) => (
            <TaskRow key={x.id} title={x.title} detail={x.detail} meta={taskMeta(x, petById(pets, x.petId)?.name, { showDate })} state={taskState(x)} pet={petById(pets, x.petId)} onToggle={() => toggleTask(x.id)} />
          ))}
        </Card>
      </section>
    )

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      <header className="flex min-h-control-56 items-center justify-between">
        <h1 className="font-display text-display font-medium">Schedule</h1>
        {!isToday && (
          <Button variant="ghost" onClick={() => setSelected(t)} className="-mr-16 !text-accent-primary">
            Today
          </Button>
        )}
      </header>

      {/* Week strip */}
      <div className="mt-12 flex items-center justify-between">
        <p className="text-body font-medium">{fromDay(week[0]).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div className="-mr-2 flex">
          <IconButton icon="chevron-left" label="Previous week" onClick={() => setSelected(addDays(selected, -7))} />
          <IconButton icon="chevron-right" label="Next week" onClick={() => setSelected(addDays(selected, 7))} />
        </div>
      </div>
      <div role="tablist" aria-label="Days" className="mt-4 grid grid-cols-7">
        {week.map((day) => {
          const active = day === selected
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(day)}
              className={`press flex min-h-control-64 flex-col items-center justify-center gap-2 rounded-16 ${active ? 'bg-surface-nav text-text-on-dark' : day === t ? 'text-accent-primary' : ''}`}
            >
              <span className={`text-caption font-medium ${active ? '' : 'text-text-secondary'}`}>{formatDay(day, { weekday: 'narrow' })}</span>
              <span className="font-display text-body-l font-medium">{fromDay(day).getDate()}</span>
              <span className={`size-8 rounded-full ${hasTasks(day) ? (active ? 'bg-text-on-dark' : 'bg-status-waiting-dot') : 'bg-transparent'}`} />
            </button>
          )
        })}
      </div>

      {!isToday && <p className="mt-24 font-display text-title font-medium">{formatDay(selected, { weekday: 'long', month: 'long', day: 'numeric' })}</p>}

      {section(isToday ? 'Due today' : isPast ? 'Not done' : 'Due', due)}
      {section(isToday ? 'Done today' : 'Done', done)}
      {section('Tomorrow', tomorrow)}
      {section('Later this week', later, true)}

      {onDay.length === 0 && tomorrow.length === 0 && later.length === 0 && (
        <div className="mt-48 flex flex-col items-center text-center text-text-secondary">
          <Icon name="calendar" size={24} />
          <p className="mt-8 text-body">{isPast ? 'Nothing was logged that day.' : 'Nothing planned for this day.'}</p>
        </div>
      )}
    </div>
  )
}

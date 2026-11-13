import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/IconButton'
import { Logo } from '../components/Logo'
import { MonthCalendar, type DayDot } from '../components/MonthCalendar'
import { SegmentedControl } from '../components/SegmentedControl'
import { TaskRow } from '../components/TaskRow'
import { petById, useApp } from '../data/useApp'
import type { Task } from '../data/types'
import { addDays, addMonths, formatDay, fromDay, today, weekOf } from '../lib/dates'
import { taskMeta, taskState } from '../lib/tasks'

const byTime = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))
// Inside a day: overdue first, then the rest by time, done at the end (Figma "5 · Schedule")
const rank = (x: Task) => (x.doneAt ? 2 : taskState(x) === 'waiting' ? 0 : 1)
const byDay = (a: Task, b: Task) => rank(a) - rank(b) || byTime(a, b)
const count = (n: number) => `${n} task${n === 1 ? '' : 's'}`

/** Figma "5 · Schedule": header like Today, the week in a card, then a card per section. */
export function Schedule() {
  const navigate = useNavigate()
  const { pets, tasks, toggleTask } = useApp()
  const t = today()
  const [selected, setSelected] = useState(t)
  const [view, setView] = useState<'week' | 'month'>('week')
  const [month, setMonth] = useState(t)
  const week = weekOf(selected)
  const isToday = selected === t

  const open = (day: string) => tasks.filter((x) => x.date === day && !x.doneAt)
  // One dot per day for Month, the most urgent wins: overdue → due → done
  const dots: Record<string, DayDot> = {}
  for (const x of tasks) {
    const dot: DayDot = x.doneAt ? 'done' : taskState(x) === 'waiting' ? 'overdue' : 'due'
    const had = dots[x.date]
    if (!had || (had === 'done' && dot !== 'done') || (had === 'due' && dot === 'overdue')) dots[x.date] = dot
  }
  // From the 1st, so Jan 31 + 1 month is February, not March
  const shiftMonth = (n: number) => setMonth(addMonths(month.slice(0, 8) + '01', n))
  const onDay = tasks.filter((x) => x.date === selected).sort(byDay)
  const doneCount = onDay.filter((x) => x.doneAt).length
  const tomorrowDay = addDays(t, 1)
  const tomorrow = isToday ? open(tomorrowDay).sort(byTime) : []
  const later = isToday ? tasks.filter((x) => x.date > tomorrowDay && x.date <= week[6] && !x.doneAt).sort(byTime) : []

  const section = (title: string, trailing: string, list: Task[], showDate = false) =>
    list.length > 0 && (
      <section aria-label={title} className="overflow-hidden rounded-24 bg-surface-card">
        {/* Figma "Section header": title and a grey count on one baseline */}
        <div className="flex items-baseline justify-between gap-16 px-24 pt-24 pb-16">
          <h2 className="min-w-0 font-display text-title font-medium">{title}</h2>
          <p className="shrink-0 text-caption text-text-secondary">{trailing}</p>
        </div>
        {list.map((x) => {
          const pet = petById(pets, x.petId)
          return <TaskRow key={x.id} title={x.title} detail={x.detail} meta={taskMeta(x, pet?.name, { showDate })} state={taskState(x)} pet={pet} onToggle={() => toggleTask(x.id)} />
        })}
      </section>
    )

  const dayTitle = isToday ? 'Today' : formatDay(selected, { weekday: 'short', month: 'short', day: 'numeric' })
  const empty = onDay.length === 0 && tomorrow.length === 0 && later.length === 0

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      {/* Header: the same as Today, with the month over the title */}
      <header>
        <div className="flex h-control-44 items-center justify-between">
          <Logo />
          <IconButton variant="plain" icon="settings" label="Settings" onClick={() => navigate('/settings')} className="-mr-2" />
        </div>
        <div className="flex flex-col gap-8 pt-24 pb-16">
          <p className="text-body-s text-text-secondary">
            {fromDay(selected).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h1 className="font-display text-display font-medium">Schedule</h1>
        </div>
      </header>

      <div className="flex flex-col gap-16">
        <SegmentedControl
          label="View"
          options={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
          value={view}
          onChange={(v) => {
            setView(v)
            setMonth(selected)
          }}
        />

        {/* Month: the whole month in a card. Week: the strip, the selected day is a blue capsule;
            dots show overdue (coral) and planned (violet) */}
        {view === 'month' ? (
          <MonthCalendar month={month} selected={selected} today={t} dots={dots} onSelect={setSelected} onPrev={() => shiftMonth(-1)} onNext={() => shiftMonth(1)} />
        ) : (
          <div role="tablist" aria-label="Days" className="grid grid-cols-7 rounded-24 bg-surface-card p-12">
            {week.map((day) => {
              const active = day === selected
              const left = open(day)
              const late = left.some((x) => taskState(x) === 'waiting')
              const planned = left.some((x) => taskState(x) !== 'waiting')
              return (
                <button
                  key={day}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={formatDay(day, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  onClick={() => setSelected(day)}
                  className={`press mx-auto flex h-[72px] w-full max-w-control-44 flex-col items-center justify-center gap-4 rounded-full ${
                    active ? 'bg-accent-primary-subtle text-accent-primary ring-[1.5px] ring-accent-primary ring-inset' : ''
                  }`}
                >
                  <span className={`text-caption ${active || day === t ? 'text-accent-primary' : 'text-text-secondary'}`}>{formatDay(day, { weekday: 'short' })}</span>
                  <span className={`text-body font-medium ${active || day === t ? 'text-accent-primary' : 'text-text-primary'}`}>{fromDay(day).getDate()}</span>
                  <span className="flex h-4 gap-2" aria-hidden="true">
                    {late && <span className="size-4 rounded-full bg-status-waiting-dot" />}
                    {planned && <span className="size-4 rounded-full bg-status-due-dot" />}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {section(dayTitle, `${doneCount} of ${onDay.length} done`, onDay)}
        {section(`Tomorrow · ${formatDay(tomorrowDay, { weekday: 'short', month: 'short', day: 'numeric' })}`, count(tomorrow.length), tomorrow)}
        {section('Later this week', count(later.length), later, true)}

        {empty && (
          <div className="mt-32 flex flex-col items-center text-center text-text-secondary">
            <Icon name="calendar" size={24} />
            <p className="mt-8 text-body">{selected < t ? 'Nothing was logged that day.' : 'Nothing planned for this day.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

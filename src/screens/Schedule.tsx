import { useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BooBubble } from '../components/BooBubble'
import { BooHint } from '../components/BooHint'
import { Button } from '../components/Button'
import { Calendar } from '../components/Calendar'
import { IconButton } from '../components/IconButton'
import { ListRow } from '../components/ListRow'
import { Logo } from '../components/Logo'
import { SegmentedControl } from '../components/SegmentedControl'
import { TaskRow } from '../components/TaskRow'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Pet, PetRecord, Task } from '../data/types'
import { addDays, addMonths, formatDay, formatTime, fromDay, relative, today } from '../lib/dates'
import { taskMeta, taskState } from '../lib/tasks'

const byTime = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))
// Inside a day: overdue first, then open ones by time, done ones at the end (Figma "Schedule · unified")
const rank = (x: Task) => (x.doneAt ? 2 : taskState(x) === 'waiting' ? 0 : 1)
const byDay = (a: Task, b: Task) => rank(a) - rank(b) || byTime(a, b)

/** Figma "Schedule · unified" (S1–S5): header like Today, Week / Month, the calendar of Day tiles, then the selected day. */
export function Schedule() {
  const navigate = useNavigate()
  const { pets, tasks, records, toggleTask } = useApp()
  const openBoo = useUi((s) => s.openBoo)
  const t = today()
  // ?day=2026-12-09 (a tapped reminder) opens on that day
  const [params] = useSearchParams()
  const asked = params.get('day')
  const start = asked && /^\d{4}-\d{2}-\d{2}$/.test(asked) ? asked : t
  const [selected, setSelected] = useState(start)
  const [view, setView] = useState<'week' | 'month'>('week')
  const [month, setMonth] = useState(start)
  // Another reminder tapped while Schedule is already open: follow the new day (adjusting state during render)
  const [seen, setSeen] = useState(asked)
  if (asked !== seen) {
    setSeen(asked)
    if (asked && asked === start) {
      setSelected(asked)
      setMonth(asked)
    }
  }

  // Each day: its pets (in the order of the pack) and how many tasks it has
  const petsByDay: Record<string, Pet[]> = {}
  const countByDay: Record<string, number> = {}
  for (const x of tasks) {
    countByDay[x.date] = (countByDay[x.date] ?? 0) + 1
    const list = (petsByDay[x.date] ??= [])
    const pet = petById(pets, x.petId)
    if (pet && !list.includes(pet)) list.push(pet)
  }
  for (const day in petsByDay) petsByDay[day].sort((a, b) => pets.indexOf(a) - pets.indexOf(b))

  // ‹ › : a week in Week (the same weekday), a month in Month (from the 1st, so Jan 31 + 1 is February)
  const shift = (n: number) => (view === 'week' ? setSelected((d) => addDays(d, 7 * n)) : setMonth((m) => addMonths(m.slice(0, 8) + '01', n)))

  const toDo = tasks.filter((x) => x.date === selected).sort(byDay)
  const doneCount = toDo.filter((x) => x.doneAt).length
  const happened = records.filter((r) => r.date === selected).sort((a, b) => (a.time ?? '99').localeCompare(b.time ?? '99'))
  const next = tasks.filter((x) => !x.doneAt && x.date > selected && x.date >= t).sort(byTime)[0]
  const nextPet = next && petById(pets, next.petId)

  /** "Cleo weighs 3.9 kg" · "9:20 AM · −0.3 kg since Nov 10" for weight; the record's own title and detail otherwise. */
  const recordText = (r: PetRecord, pet?: Pet) => {
    const time = r.time ? formatTime(r.time) : ''
    if (r.type === 'weight' && pet && r.value !== undefined) {
      const prev = records.filter((x) => x.petId === r.petId && x.type === 'weight' && x.date < r.date).sort((a, b) => b.date.localeCompare(a.date))[0]
      const diff = prev?.value !== undefined ? Math.round((r.value - prev.value) * 10) / 10 : undefined
      const change = diff === undefined ? '' : diff === 0 ? 'same as last time' : `${diff > 0 ? '+' : '−'}${Math.abs(diff)} ${pet.weightUnit} since ${formatDay(prev.date)}`
      return { title: `${pet.name} weighs ${r.value} ${pet.weightUnit}`, subtitle: [time, change].filter(Boolean).join(' · ') }
    }
    return { title: r.title, subtitle: [time, r.detail].filter(Boolean).join(' · ') }
  }

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      {/* Header: the same as Today (the month over the title only when Schedule is empty) */}
      <header>
        <div className="flex h-control-44 items-center justify-between">
          <Logo />
          <IconButton variant="secondary" icon="settings" label="Settings" onClick={() => navigate('/settings')} className="-mr-2" />
        </div>
        <div className="flex flex-col gap-8 pt-24 pb-16">
          {/* Empty Schedule: the quiet month line carries ‹ › (Anna's pick, "B"); the calendar shows no month row */}
          {tasks.length === 0 && (
            <div className="flex items-center gap-8">
              <p className="flex-1 text-body-s text-text-secondary">{fromDay(selected).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <div className="-my-12 -mr-12 flex">
                <IconButton variant="plain" icon="chevron-left" label={view === 'month' ? 'Previous month' : 'Previous week'} onClick={() => shift(-1)} />
                <IconButton variant="plain" icon="chevron-right" label={view === 'month' ? 'Next month' : 'Next week'} onClick={() => shift(1)} />
              </div>
            </div>
          )}
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

        <Calendar
          view={view}
          anchor={view === 'month' ? month : selected}
          selected={selected}
          today={t}
          petsByDay={petsByDay}
          countByDay={countByDay}
          onSelect={setSelected}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          look={tasks.length === 0 ? 'strip' : 'tiles'}
          monthRow={tasks.length === 0 ? 'none' : 'title'}
        />

        {/* The day's heading; an empty Schedule has none (Figma) */}
        {tasks.length > 0 && <h2 className="mt-8 pl-4 font-display text-title font-medium">{formatDay(selected, { weekday: 'long', month: 'short', day: 'numeric' })}</h2>}

        {toDo.length > 0 && (
          <Section title="To do" trailing={`${doneCount} of ${toDo.length} done`}>
            {toDo.map((x) => {
              const pet = petById(pets, x.petId)
              return <TaskRow key={x.id} title={x.title} detail={x.detail} meta={taskMeta(x, pet?.name, { weekday: true })} state={taskState(x)} pet={pet} onToggle={() => toggleTask(x.id)} />
            })}
          </Section>
        )}

        {happened.length > 0 && (
          <Section title="Happened">
            {happened.map((r) => {
              const pet = petById(pets, r.petId)
              const text = recordText(r, pet)
              return <ListRow key={r.id} pet={pet} title={text.title} subtitle={text.subtitle || undefined} />
            })}
          </Section>
        )}

        {/* Nothing planned at all (Figma "Empty · Schedule"): Boo says where reminders come from */}
        {tasks.length === 0 && happened.length === 0 && (
          <BooBubble
            compact
            pose="sleeping"
            action={
              <Button full size="large" icon="camera" onClick={() => openBoo('snap')}>
                Snap a vet paper
              </Button>
            }
          >
            Nothing planned yet. Reminders show up here once I read a vet paper.
          </BooBubble>
        )}
        {tasks.length > 0 && toDo.length === 0 && happened.length === 0 && (
          <BooHint title="All good." pose="sleeping">{next ? `Next: ${next.title} for ${nextPet?.name} ${relative(next.date)}.` : 'Nothing due soon.'}</BooHint>
        )}
      </div>
    </div>
  )
}

/** Figma "Section header" in a card: the title and a grey count on one baseline, then the rows. */
function Section({ title, trailing, children }: { title: string; trailing?: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="panel-card overflow-hidden rounded-24 pb-8">
      <div className="flex items-baseline justify-between gap-16 px-24 pt-24 pb-8">
        <h3 className="min-w-0 font-display text-title font-medium">{title}</h3>
        {trailing && <p className="shrink-0 text-caption text-text-secondary">{trailing}</p>}
      </div>
      {children}
    </section>
  )
}

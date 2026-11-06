import { useNavigate } from 'react-router'
import { Icon } from '../components/Icon'
import { BooFace } from '../components/TabBar'
import { TaskRow } from '../components/TaskRow'
import { Button, Card, IconButton, PetAvatar, SectionTitle, TextLink } from '../components/ui'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Task } from '../data/types'
import { addDays, formatDay, greeting, relative, today } from '../lib/dates'

const byUrgency = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))

export function Today() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const { pets, tasks, vaccines, settings, toggleTask, updateSettings } = useApp()
  const t = today()

  const open = tasks.filter((x) => !x.doneAt).sort(byUrgency)
  const overdue = open.filter((x) => x.date < t || (x.date === t && x.time && x.time < nowTime()))
  // Important items (not daily chores), overdue first
  const important = open.filter((x) => x.kind !== 'chore' && x.date <= addDays(t, 60))
  const nextUp = overdue[0] ?? open.find((x) => x.date === t) ?? important[0]
  const comingUp = [...overdue, ...open.filter((x) => !overdue.includes(x))].filter((x) => x !== nextUp && (x.date <= addDays(t, 1) || (x.kind !== 'chore' && x.date <= addDays(t, 60)))).slice(0, 4)
  const doneToday = tasks.filter((x) => x.doneAt?.startsWith(t))
  const dueSoon = new Set(open.filter((x) => x.date <= addDays(t, 7)).map((x) => x.petId))

  // Gap hint: a cat or dog with no vaccines on file
  const gapPet = pets.find((p) => (p.species === 'dog' || p.species === 'cat') && !vaccines.some((v) => v.petId === p.id))
  const showGap = gapPet && (!settings.gapHintHiddenUntil || settings.gapHintHiddenUntil < t)
  const nextBig = important.find((x) => x.date > t)

  return (
    <div className="pt-safe min-h-dvh px-gutter pb-36">
      <header className="flex min-h-12 items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-ink-2">{formatDay(t, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="font-display text-[28px] font-bold">{greeting()}</h1>
        </div>
        <div className="-mr-2 flex">
          <IconButton icon="share" label="Share records" onClick={() => navigate('/share')} />
          <IconButton icon="gear" label="Settings" onClick={() => navigate('/settings')} />
        </div>
      </header>

      {/* Boo card */}
      <div className="mt-4 rounded-lg bg-accent-soft p-4">
        <div className="flex items-center gap-2 text-accent">
          <BooFace size={22} />
          <p className="text-[14px] font-semibold">Tell Boo what happened</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" onClick={() => openBoo('type')} className="press min-h-12 flex-1 rounded-full bg-surface px-4 text-left text-[15px] text-ink-3">
            “Rocky threw up”
          </button>
          <button type="button" aria-label="Talk to Boo" onClick={() => openBoo('talk')} className="press flex size-12 items-center justify-center rounded-full bg-accent text-on-accent">
            <Icon name="mic" size={22} />
          </button>
          <button type="button" aria-label="Snap a vet paper" onClick={() => openBoo('snap')} className="press flex size-12 items-center justify-center rounded-full bg-surface text-accent">
            <Icon name="camera" size={22} />
          </button>
        </div>
      </div>

      {nextUp ? (
        <>
          <SectionTitle>Next up</SectionTitle>
          <Card>
            <TaskRow task={nextUp} pet={petById(pets, nextUp.petId)} onToggle={() => toggleTask(nextUp.id)} showDate={nextUp.date !== t} />
            <div className="mt-2 flex gap-2">
              <Button variant="dark" icon="check" onClick={() => toggleTask(nextUp.id)} className="flex-1">
                Done
              </Button>
              {petById(pets, nextUp.petId)?.vet && (
                <a href={`tel:${petById(pets, nextUp.petId)!.vet!.phone}`} className="press inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent-soft text-[15px] font-semibold text-accent">
                  <Icon name="phone" size={20} />
                  Book vet
                </a>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card className="mt-7">
          <p className="font-display text-[20px] font-semibold">All good.</p>
          <p className="mt-1 text-[15px] text-ink-2">{nextBig ? `Next: ${petById(pets, nextBig.petId)?.name}'s ${nextBig.title.toLowerCase()} ${relative(nextBig.date)}.` : 'Nothing due soon.'}</p>
        </Card>
      )}

      {showGap && gapPet && (
        <div className="mt-3 flex items-start gap-3 rounded-md bg-surface p-4 ring-1 ring-line">
          <PetAvatar pet={gapPet} size={36} />
          <div className="flex-1">
            <p className="text-[14px]">I don’t know {gapPet.name}’s shots yet. Snap the last vet paper?</p>
            <div className="mt-1 -ml-2 flex">
              <button type="button" onClick={() => openBoo('snap')} className="press min-h-11 px-2 text-[14px] font-semibold text-accent">
                Snap it
              </button>
              <button type="button" onClick={() => updateSettings({ gapHintHiddenUntil: addDays(t, 7) })} className="press min-h-11 px-2 text-[14px] text-ink-2">
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {comingUp.length > 0 && (
        <>
          <SectionTitle action={<TextLink onClick={() => navigate('/schedule')}>See schedule</TextLink>}>Coming up</SectionTitle>
          <Card className="!py-1">
            {comingUp.map((x) => (
              <TaskRow key={x.id} task={x} pet={petById(pets, x.petId)} onToggle={() => toggleTask(x.id)} showDate={x.date !== t} />
            ))}
          </Card>
        </>
      )}

      <SectionTitle action={<TextLink onClick={() => navigate('/pets')}>All pets</TextLink>}>Your pack</SectionTitle>
      <div className="swipe-row -mx-gutter flex gap-4 px-gutter pb-1">
        {pets.map((p) => (
          <button key={p.id} type="button" onClick={() => navigate(`/pets/${p.id}`)} className="press flex w-16 shrink-0 flex-col items-center gap-1.5">
            <PetAvatar pet={p} size={64} dot={dueSoon.has(p.id)} />
            <span className="w-full truncate text-center text-[13px] font-medium">{p.name}</span>
          </button>
        ))}
        <button type="button" onClick={() => navigate('/pets/new')} className="press flex w-16 shrink-0 flex-col items-center gap-1.5">
          <span className="flex size-16 items-center justify-center rounded-full text-ink-2 ring-1 ring-line">
            <Icon name="plus" />
          </span>
          <span className="text-[13px] text-ink-2">Add</span>
        </button>
      </div>

      {doneToday.length > 0 && (
        <details className="mt-7">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink-2">
            Done today · {doneToday.length}
            <Icon name="chevron" size={18} />
          </summary>
          <Card className="!py-1">
            {doneToday.map((x) => (
              <TaskRow key={x.id} task={x} pet={petById(pets, x.petId)} onToggle={() => toggleTask(x.id)} />
            ))}
          </Card>
        </details>
      )}
    </div>
  )
}

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

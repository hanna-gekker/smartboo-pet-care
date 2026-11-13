import { useNavigate } from 'react-router'
import { BooCharacter } from '../components/BooCharacter'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/IconButton'
import { PetAvatar } from '../components/PetAvatar'
import { TaskRow } from '../components/TaskRow'
import { SectionTitle, TextLink } from '../components/ui'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Task } from '../data/types'
import { addDays, formatDay, greeting, relative, today } from '../lib/dates'
import { taskMeta, taskState } from '../lib/tasks'

const byUrgency = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))

export function Today() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const { pets, tasks, vaccines, settings, toggleTask, updateSettings } = useApp()
  const t = today()

  const open = tasks.filter((x) => !x.doneAt).sort(byUrgency)
  const overdue = open.filter((x) => taskState(x) === 'waiting')
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
  const nextUpPet = nextUp && petById(pets, nextUp.petId)

  const row = (x: Task, showDate = x.date !== t) => {
    const pet = petById(pets, x.petId)
    return <TaskRow key={x.id} title={x.title} detail={x.detail} meta={taskMeta(x, pet?.name, { showDate })} state={taskState(x)} pet={pet} onToggle={() => toggleTask(x.id)} />
  }

  return (
    <div className="pt-safe min-h-dvh px-16 pb-[144px]">
      <header className="flex min-h-control-56 items-center justify-between">
        <div>
          <p className="text-body-s font-medium text-text-secondary">{formatDay(t, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="font-display text-display font-medium">{greeting()}</h1>
        </div>
        <div className="-mr-2 flex">
          <IconButton icon="share" label="Share records" onClick={() => navigate('/share')} />
          <IconButton icon="gear" label="Settings" onClick={() => navigate('/settings')} />
        </div>
      </header>

      {/* Boo card */}
      <div className="mt-16 rounded-24 bg-accent-primary-subtle p-16">
        <div className="flex items-center gap-12">
          <button type="button" aria-label="Talk to Boo" onClick={() => openBoo('talk')} className="press shrink-0 rounded-full">
            <BooCharacter size={72} />
          </button>
          <p className="text-body font-medium text-accent-primary">Tell Boo what happened</p>
        </div>
        <div className="mt-12 flex items-center gap-4 rounded-full bg-surface-card py-4 pr-4 pl-16">
          <button type="button" onClick={() => openBoo('type')} className="press min-h-control-44 min-w-0 flex-1 truncate text-left text-body text-text-tertiary">
            “Rocky threw up”
          </button>
          <IconButton variant="primary" icon="mic" label="Talk to Boo" onClick={() => openBoo('talk')} />
          <IconButton variant="soft" icon="camera" label="Snap a vet paper" onClick={() => openBoo('snap')} />
        </div>
      </div>

      {nextUp ? (
        <>
          <SectionTitle>Next up</SectionTitle>
          <Card>
            <TaskRow
              title={nextUp.title}
              detail={nextUp.detail}
              meta={taskMeta(nextUp, nextUpPet?.name, { showDate: nextUp.date !== t })}
              state={taskState(nextUp)}
              pet={nextUpPet}
              onToggle={() => toggleTask(nextUp.id)}
              flush
            />
            <div className="mt-8 flex gap-8">
              <Button icon="check" onClick={() => toggleTask(nextUp.id)} className="flex-1">
                Done
              </Button>
              {nextUpPet?.vet && (
                <Button variant="secondary" icon="phone" onClick={() => {
                    window.location.href = `tel:${nextUpPet.vet!.phone}`
                  }} className="flex-1">
                  Book vet
                </Button>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card className="mt-24">
          <p className="font-display text-title font-medium">All good.</p>
          <p className="mt-4 text-body text-text-secondary">{nextBig ? `Next: ${petById(pets, nextBig.petId)?.name}'s ${nextBig.title.toLowerCase()} ${relative(nextBig.date)}.` : 'Nothing due soon.'}</p>
        </Card>
      )}

      {showGap && gapPet && (
        <Card className="mt-12 flex items-start gap-12">
          <PetAvatar pet={gapPet} size="sm" />
          <div className="flex-1">
            <p className="text-body-s">I don’t know {gapPet.name}’s shots yet. Snap the last vet paper?</p>
            <div className="mt-4 -ml-24 flex">
              <Button variant="ghost" onClick={() => openBoo('snap')} className="!text-accent-primary">
                Snap it
              </Button>
              <Button variant="ghost" onClick={() => updateSettings({ gapHintHiddenUntil: addDays(t, 7) })} className="!font-regular !text-text-secondary">
                Not now
              </Button>
            </div>
          </div>
        </Card>
      )}

      {comingUp.length > 0 && (
        <>
          <SectionTitle action={<TextLink onClick={() => navigate('/schedule')}>See schedule</TextLink>}>Coming up</SectionTitle>
          <Card variant="list">{comingUp.map((x) => row(x))}</Card>
        </>
      )}

      <SectionTitle action={<TextLink onClick={() => navigate('/pets')}>All pets</TextLink>}>Your pack</SectionTitle>
      <div className="swipe-row -mx-16 flex gap-16 px-16 pb-4">
        {pets.map((p) => (
          <button key={p.id} type="button" onClick={() => navigate(`/pets/${p.id}`)} className="press flex w-avatar-72 shrink-0 flex-col items-center gap-4">
            <PetAvatar pet={p} size="lg" dueSoon={dueSoon.has(p.id)} />
            <span className="w-full truncate text-center text-body-s font-medium">{p.name}</span>
          </button>
        ))}
        <button type="button" onClick={() => navigate('/pets/new')} className="press flex w-avatar-72 shrink-0 flex-col items-center gap-4">
          <span className="flex size-avatar-72 items-center justify-center rounded-full text-text-secondary ring-1 ring-inset ring-border-control">
            <Icon name="plus" />
          </span>
          <span className="text-body-s text-text-secondary">Add</span>
        </button>
      </div>

      {doneToday.length > 0 && (
        <details className="mt-24">
          <summary className="flex min-h-control-44 cursor-pointer list-none items-center justify-between text-body font-medium text-text-secondary">
            Done today · {doneToday.length}
            <Icon name="chevron" size={20} />
          </summary>
          <Card variant="list">{doneToday.map((x) => row(x, false))}</Card>
        </details>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router'
import { AskBooInput } from '../components/AskBooInput'
import { BooCharacter } from '../components/BooCharacter'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/IconButton'
import { Logo } from '../components/Logo'
import { NextUpCard } from '../components/NextUpCard'
import { PetAvatar } from '../components/PetAvatar'
import { TaskRow } from '../components/TaskRow'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Task } from '../data/types'
import { addDays, formatDay, greeting, relative, today } from '../lib/dates'
import { petColorAt } from '../lib/petColors'
import { nextUpMeta, taskMeta, taskPill, taskState } from '../lib/tasks'

const byUrgency = (a: Task, b: Task) => (a.date + (a.time ?? '99')).localeCompare(b.date + (b.time ?? '99'))

/** Figma "1 · Today": header, Next up, Boo card, Coming up, Your pack, Done today. */
export function Today() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const { pets, tasks, toggleTask } = useApp()
  const t = today()

  const open = tasks.filter((x) => !x.doneAt).sort(byUrgency)
  const overdue = open.filter((x) => taskState(x) === 'waiting')
  // Important items (not daily chores), overdue first
  const important = open.filter((x) => x.kind !== 'chore' && x.date <= addDays(t, 60))
  const nextUp = overdue[0] ?? open.find((x) => x.date === t) ?? important[0]
  const comingUp = [...overdue, ...open.filter((x) => !overdue.includes(x))].filter((x) => x !== nextUp && (x.date <= addDays(t, 1) || (x.kind !== 'chore' && x.date <= addDays(t, 60)))).slice(0, 5)
  const doneToday = tasks.filter((x) => x.doneAt?.startsWith(t))
  const dueSoon = new Set(open.filter((x) => x.date <= addDays(t, 7)).map((x) => x.petId))
  const nextBig = important.find((x) => x.date > t)
  const nextUpPet = nextUp && petById(pets, nextUp.petId)

  const row = (x: Task, showDate = x.date !== t) => {
    const pet = petById(pets, x.petId)
    return <TaskRow key={x.id} title={x.title} detail={x.detail} meta={taskMeta(x, pet?.name, { showDate })} state={taskState(x)} pet={pet} onToggle={() => toggleTask(x.id)} />
  }

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      {/* Header: logo and settings, then the date and the greeting */}
      <header>
        <div className="flex h-control-44 items-center justify-between">
          <Logo />
          <IconButton variant="plain" icon="settings" label="Settings" onClick={() => navigate('/settings')} className="-mr-2" />
        </div>
        <div className="flex flex-col gap-8 pt-24 pb-16">
          <p className="text-body-s text-text-secondary">{formatDay(t, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h1 className="font-display text-display font-medium">{greeting()}</h1>
        </div>
      </header>

      <div className="flex flex-col gap-16">
        {nextUp ? (
          <NextUpCard
            pet={nextUpPet}
            title={nextUp.title}
            meta={nextUpMeta(nextUp, nextUpPet?.name, nextUpPet?.vet?.name)}
            status={taskPill(nextUp)}
            onDone={() => toggleTask(nextUp.id)}
            onBookVet={
              nextUpPet?.vet
                ? () => {
                    window.location.href = `tel:${nextUpPet.vet!.phone}`
                  }
                : undefined
            }
          />
        ) : (
          <Card className="p-24">
            <p className="font-display text-title font-medium">All good.</p>
            <p className="mt-4 text-body text-text-secondary">{nextBig ? `Next: ${petById(pets, nextBig.petId)?.name}'s ${nextBig.title.toLowerCase()} ${relative(nextBig.date)}.` : 'Nothing due soon.'}</p>
          </Card>
        )}

        {/* Boo card */}
        <section aria-label="Boo" className="flex flex-col gap-16 rounded-24 bg-ai-card p-24">
          <div className="flex items-center gap-16">
            <button type="button" aria-label="Talk to Boo" onClick={() => openBoo('talk')} className="press shrink-0 rounded-full">
              <BooCharacter size={72} />
            </button>
            <div className="flex min-w-0 flex-col gap-4">
              <p className="flex items-center gap-4 text-caption text-text-primary">
                <Icon name="sparkle-ai" size={16} className="shrink-0" />
                Boo · your pet assistant
              </p>
              <p className="text-body font-medium text-text-primary">Snap a vet paper or just tell me — I’ll file it.</p>
            </div>
          </div>
          <AskBooInput placeholder="Tell Boo anything…" onType={() => openBoo('type')} onSnap={() => openBoo('snap')} onTalk={() => openBoo('talk')} />
        </section>

        {comingUp.length > 0 && (
          <section aria-label="Coming up" className="overflow-hidden rounded-24 bg-surface-card">
            <div className="flex items-center justify-between gap-16 px-24 pt-24 pb-16">
              <h2 className="font-display text-title font-medium">Coming up</h2>
              <button type="button" onClick={() => navigate('/schedule')} className="press -my-12 -mr-8 min-h-control-44 px-8 text-caption text-accent-primary">
                See schedule
              </button>
            </div>
            {comingUp.map((x) => row(x))}
          </section>
        )}

        <section aria-label="Your pack" className="flex flex-col gap-16 rounded-24 bg-surface-card py-24">
          <div className="flex items-center justify-between gap-16 px-24">
            <h2 className="font-display text-title font-medium">Your pack</h2>
            {dueSoon.size > 0 && (
              <p className="text-caption text-text-secondary">
                {dueSoon.size} {dueSoon.size === 1 ? 'has' : 'have'} something due
              </p>
            )}
          </div>
          <div className="swipe-row flex gap-16 px-24">
            {pets.map((p, i) => (
              <button key={p.id} type="button" onClick={() => navigate(`/pets/${p.id}`)} className="press flex w-avatar-80 shrink-0 flex-col items-center gap-8">
                <PetAvatar pet={p} petals={petColorAt(i)} dueSoon={dueSoon.has(p.id)} />
                <span className="w-full truncate text-center text-body">{p.name}</span>
              </button>
            ))}
          </div>
        </section>

        {doneToday.length > 0 && (
          <details className="group">
            <summary className="press flex min-h-control-56 cursor-pointer list-none items-center gap-12 rounded-24 bg-surface-card px-24 py-16">
              <span className="flex size-icon-24 shrink-0 items-center justify-center rounded-full bg-accent-primary text-text-on-accent">
                <Icon name="check" size={16} />
              </span>
              <span className="flex-1 text-body font-medium">Done today · {doneToday.length}</span>
              <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-8 overflow-hidden rounded-24 bg-surface-card">{doneToday.map((x) => row(x, false))}</div>
          </details>
        )}
      </div>
    </div>
  )
}


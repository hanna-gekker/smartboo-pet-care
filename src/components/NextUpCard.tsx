// Next up card — Figma "Next up card" (Patterns): the one thing to do next.
// Pet photo (72, white ring), a status pill, the title (Body L), a grey line, and Done / Book vet.
// Overdue or late tasks sit on the waiting tint, like in Figma; others on a white card.

import type { Pet } from '../data/types'
import { Button } from './Button'
import { PetAvatar } from './PetAvatar'
import { StatusPill, type PillStatus } from './StatusPill'

type NextUpCardProps = {
  pet?: Pet
  title: string
  /** The grey line: "Rocky · was due Nov 1 · Dr. Lee". */
  meta: string
  status: { kind: PillStatus; label: string }
  onDone: () => void
  /** Shown only when the pet has a vet. */
  onBookVet?: () => void
}

export function NextUpCard({ pet, title, meta, status, onDone, onBookVet }: NextUpCardProps) {
  const tint = status.kind === 'waiting' ? 'bg-status-waiting-bg' : 'bg-surface-card'
  return (
    <section aria-label="Next up" className={`flex flex-col gap-16 rounded-24 p-24 ${tint}`}>
      <div className="flex items-center gap-16">
        <PetAvatar pet={pet} size="lg" outlined />
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <StatusPill status={status.kind} label={status.label} />
          <div className="flex flex-col gap-2">
            <p className="truncate text-body-l text-text-primary">{title}</p>
            <p className="truncate text-body-s text-text-secondary">{meta}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <Button onClick={onDone} className="flex-1">
          Done
        </Button>
        {onBookVet && (
          <Button variant="secondary" onClick={onBookVet} className="flex-1">
            Book vet
          </Button>
        )}
      </div>
    </section>
  )
}

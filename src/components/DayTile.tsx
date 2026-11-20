// Day tile — Figma "Day tile" (Schedule · unified): one day in the Week strip and the Month grid.
// 46 × 58 (stretches to its column), radius 16. Default: surface/card with a 1px border/card edge inside.
// The number on top (SB/Caption Strong, text/primary) in a 22 slot; today: the slot is an accent/primary circle with
// text/on-accent. Selected: accent/primary-subtle fill with a 1px accent/primary edge (marked by fill, not by weight).
// Under the number up to two 20 pet photos with a 2px ring in the tile's own fill; more than two: one photo and a
// "+N" badge (text/secondary fill, surface/card number, SB/Tab label). A real button; the whole tile is the tap area.

import type { Pet } from '../data/types'
import { PetAvatar } from './PetAvatar'

type DayTileProps = {
  /** The day number, "4". */
  day: number
  /** What VoiceOver reads, e.g. "Wednesday, November 4, 3 tasks". */
  label: string
  today?: boolean
  selected?: boolean
  /** Pets with something on that day. */
  pets?: Pet[]
  onSelect: () => void
}

export function DayTile({ day, label, today = false, selected = false, pets = [], onSelect }: DayTileProps) {
  const ring = selected ? 'ring-accent-primary-subtle' : 'ring-surface-card'
  const shown = pets.length > 2 ? pets.slice(0, 1) : pets
  const more = pets.length > 2 ? pets.length - 1 : 0
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onSelect}
      className={`press flex h-[58px] w-full flex-col items-center justify-between rounded-16 pt-4 pb-4 ring-1 ring-inset ${
        selected ? 'bg-accent-primary-subtle ring-accent-primary' : 'bg-surface-card ring-border-card'
      }`}
    >
      <span className={`flex size-[22px] items-center justify-center rounded-full text-caption font-medium ${today ? 'bg-accent-primary text-text-on-accent' : 'text-text-primary'}`}>
        {day}
      </span>
      <span className="flex h-icon-20 items-center" aria-hidden="true">
        {shown.map((p, i) => (
          <span key={p.id} className={`rounded-full ring-2 ${ring} ${i > 0 ? '-ml-8' : ''}`}>
            <PetAvatar pet={p} size="tiny" />
          </span>
        ))}
        {more > 0 && (
          <span className={`-ml-8 flex size-icon-20 items-center justify-center rounded-full bg-text-secondary text-tab-label font-medium text-surface-card ring-2 ${ring}`}>
            +{more}
          </span>
        )}
      </span>
    </button>
  )
}

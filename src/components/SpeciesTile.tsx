// Species tile — Figma "Species tile" (Add your pet, step 1).
// surface/card with a 1px border/card edge, radius 16: the species placeholder in a 48 flower and the label (SB/Caption).
// Selected: accent/primary-subtle fill + a 1px accent/primary edge, label text/primary. A radio in a "Species" radio group.

import type { PetColor, Species } from '../data/types'
import { PetAvatar } from './PetAvatar'

type SpeciesTileProps = {
  species: Species
  label: string
  /** The species' own frame colour. */
  color: PetColor
  selected?: boolean
  onSelect: () => void
}

export function SpeciesTile({ species, label, color, selected = false, onSelect }: SpeciesTileProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`press flex min-h-control-44 w-full flex-col items-center gap-4 rounded-16 px-4 pt-12 pb-8 ring-1 ring-inset ${
        selected ? 'bg-accent-primary-subtle ring-accent-primary' : 'bg-surface-card ring-border-card'
      }`}
    >
      <PetAvatar pet={{ id: `species-${species}`, name: label, species, weightUnit: 'kg', allergies: [] }} size="md" petals={color} />
      <span className={`w-full truncate text-caption ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>{label}</span>
    </button>
  )
}

// Species tile — Figma "Species tile" (Add your pet, step 1).
// surface/card with a 1px border/card edge, radius 16: the species placeholder in a 48 flower and the label (SB/Caption).
// Selected: accent/primary-subtle fill + a 1px accent/primary edge, label text/primary. A radio in a "Species" radio group.

import type { PetColor, Species } from '../data/types'
import { PetAvatar } from './PetAvatar'
import type { ShowState } from './showState'

type SpeciesTileProps = {
  species: Species
  label: string
  /** The species' own frame colour. */
  color: PetColor
  selected?: boolean
  onSelect: () => void
  disabled?: boolean
  'data-state'?: ShowState
}

export function SpeciesTile({ species, label, color, selected = false, onSelect, disabled, 'data-state': state }: SpeciesTileProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      disabled={disabled}
      data-state={state}
      className={`press flex min-h-control-44 disabled:opacity-40 aspect-square w-full flex-col items-center justify-center gap-4 rounded-16 px-4 ring-1 ring-inset ${
        selected
          ? 'bg-accent-primary-subtle ring-accent-primary active:bg-accent-primary-soft data-[state=pressed]:bg-accent-primary-soft'
          : 'bg-surface-card ring-border-card active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle'
      }`}
    >
      <PetAvatar pet={{ id: `species-${species}`, name: label, species, weightUnit: 'kg', allergies: [] }} size="md" petals={color} />
      <span className={`w-full truncate text-caption ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>{label}</span>
    </button>
  )
}

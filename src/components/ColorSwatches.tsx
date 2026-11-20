// Colour swatch — Figma "Frame colour" (Add your pet, step 2): the six pet/* frame colours as 32 circles.
// The chosen one has a 2px accent/primary ring with a gap. A radio group; each circle has a 44 tap area.

import type { PetColor } from '../data/types'

const COLORS: { value: PetColor; label: string; fill: string }[] = [
  { value: 'ocean', label: 'Ocean', fill: 'bg-pet-ocean' },
  { value: 'slate', label: 'Slate', fill: 'bg-pet-slate' },
  { value: 'mint', label: 'Mint', fill: 'bg-pet-mint' },
  { value: 'butter', label: 'Butter', fill: 'bg-pet-butter' },
  { value: 'pink', label: 'Pink', fill: 'bg-pet-pink' },
  { value: 'lavender', label: 'Lavender', fill: 'bg-pet-lavender' },
]

type ColorSwatchesProps = {
  /** The group's name, read by VoiceOver ("Frame colour"). */
  label: string
  value: PetColor
  onChange: (color: PetColor) => void
}

export function ColorSwatches({ label, value, onChange }: ColorSwatchesProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap">
      {COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          role="radio"
          aria-checked={c.value === value}
          aria-label={c.label}
          onClick={() => onChange(c.value)}
          className="press flex size-control-44 items-center justify-center rounded-full"
        >
          <span className={`size-control-32 rounded-full ${c.fill} ${c.value === value ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-surface-card' : ''}`} />
        </button>
      ))}
    </div>
  )
}

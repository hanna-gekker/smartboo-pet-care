// Colour swatch — Figma "Frame colour" (Add your pet, step 2): the six pet/* frame colours as 32 circles.
// The chosen one has a 2px accent/primary ring with a gap. A radio group; each circle has a 44 tap area.
// With `allowNone`, a 7th circle "No frame" (Figma 14): an empty surface/card circle with a border/control edge
// and a diagonal line.

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
  value: PetColor | 'none'
  onChange: (color: PetColor | 'none') => void
  /** Adds the "No frame" circle. */
  allowNone?: boolean
  disabled?: boolean
  /** /components only: show this state on the chosen swatch. */
  'data-state'?: 'pressed' | 'focus'
}

export function ColorSwatches({ label, value, onChange, allowNone, disabled, 'data-state': state }: ColorSwatchesProps) {
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
          disabled={disabled}
          data-state={c.value === value ? state : undefined}
          className="press flex size-control-44 items-center justify-center rounded-full disabled:opacity-40"
        >
          <span className={`size-control-32 rounded-full ${c.fill} ${c.value === value ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-surface-card' : ''}`} />
        </button>
      ))}
      {allowNone && (
        <button
          type="button"
          role="radio"
          aria-checked={value === 'none'}
          aria-label="No frame"
          onClick={() => onChange('none')}
          disabled={disabled}
          className="press flex size-control-44 items-center justify-center rounded-full disabled:opacity-40"
        >
          <span
            className={`flex size-control-32 items-center justify-center rounded-full bg-surface-card text-text-secondary ring-1 ring-inset ring-border-control ${
              value === 'none' ? 'outline-2 outline-offset-2 outline-accent-primary outline' : ''
            }`}
          >
            <svg viewBox="0 0 32 32" className="size-full" aria-hidden="true">
              <line x1="9" y1="23" x2="23" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}

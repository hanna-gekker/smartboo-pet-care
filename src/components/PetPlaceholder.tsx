// Pet photo placeholder — Figma "Pet avatars · final" (✏️ Drafts): when a pet has no photo, a drawing of its species.
// The circle is the pet's frame colour (pet/<colour>) with a deeper shade (pet/<colour>-deep, butter: a gradient)
// and a soft top light, both at 75%. The animal (pet/animal, its face pet/animal-eye) is 117% of the circle, clipped.
// Small sizes (24 and less) draw the animal without its face.
// Drawn in a 100 box, so it fills whatever box it is placed in. Decoration only: the name is read elsewhere.

import { useId } from 'react'
import type { PetColor, Species } from '../data/types'
import { animals } from './petAnimals'

type PetPlaceholderProps = {
  species: Species
  color: PetColor
  /** Draw the eyes, nose and smile (off for 24 and less). */
  face?: boolean
}

export function PetPlaceholder({ species, color, face = true }: PetPlaceholderProps) {
  const id = useId().replace(/:/g, '')
  const butter = color === 'butter'
  return (
    <svg viewBox="0 0 100 100" className="block size-full" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-c`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0" y2="1">
          <stop style={{ stopColor: 'var(--pet-animal)', stopOpacity: 0.22 }} />
          <stop offset="0.55" style={{ stopColor: 'var(--pet-animal)', stopOpacity: 0 }} />
        </linearGradient>
        {butter && (
          <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
            <stop style={{ stopColor: 'var(--pet-butter-deep)' }} />
            <stop offset="1" style={{ stopColor: 'var(--pet-butter-deep-end)' }} />
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        <rect width="100" height="100" style={{ fill: `var(--pet-${color})` }} />
        <rect width="100" height="100" opacity="0.75" style={{ fill: butter ? `url(#${id}-deep)` : `var(--pet-${color}-deep)` }} />
        <rect width="100" height="100" opacity="0.75" fill={`url(#${id}-light)`} />
        <g transform="translate(50 50) scale(1.17) translate(-50 -50)">
          {animals[species]
            .filter((p) => face || !p.face)
            .map((p, i) => {
              const color = p.face ? 'var(--pet-animal-eye)' : 'var(--pet-animal)'
              return (
                <path
                  key={i}
                  d={p.d}
                  strokeWidth={p.stroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ fill: p.line ? 'none' : color, stroke: p.stroke ? color : 'none' }}
                />
              )
            })}
        </g>
      </g>
    </svg>
  )
}

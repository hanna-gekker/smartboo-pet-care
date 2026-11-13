// Pet avatar — the pet's photo, or the first letter of its name on a soft accent circle.
// Sizes come from the Figma size/avatar-* tokens.
// With petals it is the Figma "Pet avatar" (80): the photo inside a flower in the pet's color, with a due-soon dot.

import type { Pet } from '../data/types'
import type { PetColor } from '../lib/petColors'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero'

const sizes: Record<AvatarSize, { box: string; letter: string }> = {
  sm: { box: 'size-avatar-40', letter: 'text-body-l' }, // Task row, Boo cards
  md: { box: 'size-avatar-48', letter: 'text-title' }, // List row (Pets list)
  lg: { box: 'size-avatar-72', letter: 'text-display' }, // Next up
  xl: { box: 'size-avatar-80', letter: 'text-display' }, // Your pack
  hero: { box: 'size-avatar-128', letter: 'text-display' }, // Pet folder, Edit profile
}

const petals: Record<PetColor, string> = {
  ocean: 'var(--pet-ocean)',
  lavender: 'var(--pet-lavender)',
  butter: 'var(--pet-butter)',
  mint: 'var(--pet-mint)',
  pink: 'var(--pet-pink)',
  slate: 'var(--pet-slate)',
}


type PetAvatarProps = {
  pet?: Pet
  size?: AvatarSize
  /** A small dot: something is due soon for this pet. */
  dueSoon?: boolean
  /** A white ring around the photo (Next up). */
  outlined?: boolean
  /** The Figma flower around the photo, in this color (80 only). */
  petals?: PetColor
}

// Figma petals, 78 × 78; drawn at (1, 1) in the 80 box.
const PETALS =
  'M39 5.47161C42.9498 -4.04382 57.0995 -0.251113 55.7642 9.96001C63.9443 3.69869 74.3013 14.0557 68.04 22.2358C78.2511 20.9005 82.0438 35.0502 72.5284 39C82.0438 42.9498 78.2511 57.0995 68.04 55.7642C74.3013 63.9443 63.9443 74.3013 55.7642 68.04C57.0995 78.2511 42.9498 82.0438 39 72.5284C35.0502 82.0438 20.9005 78.2511 22.2358 68.04C14.0557 74.3013 3.69869 63.9443 9.96001 55.7642C-0.251113 57.0995 -4.04382 42.9498 5.47161 39C-4.04382 35.0502 -0.251113 20.9005 9.96001 22.2358C3.69869 14.0557 14.0557 3.69869 22.2358 9.96001C20.9005 -0.251113 35.0502 -4.04382 39 5.47161Z'

function Photo({ pet, letter }: { pet?: Pet; letter: string }) {
  return pet?.photo ? (
    <img src={pet.photo} alt="" className="size-full rounded-full object-cover" draggable={false} />
  ) : (
    <span className={`flex size-full items-center justify-center rounded-full bg-accent-primary-subtle font-display font-medium text-accent-primary ${letter}`}>
      {pet?.name[0] ?? '?'}
    </span>
  )
}

export function PetAvatar({ pet, size = 'sm', dueSoon, outlined, petals: color }: PetAvatarProps) {
  if (color) {
    // Figma: petals at (1,1), photo 58 at (11,11) with a 2px white ring, due dot 14 at (60,6) — all in one 80 box.
    const clip = `petals-${pet?.id ?? 'none'}`
    return (
      <svg viewBox="0 0 80 80" className="size-avatar-80 shrink-0" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <circle cx="40" cy="40" r="29" />
          </clipPath>
        </defs>
        <path d={PETALS} transform="translate(1 1)" style={{ fill: petals[color] }} />
        {pet?.photo ? (
          <image href={pet.photo} x="11" y="11" width="58" height="58" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
        ) : (
          <>
            <circle cx="40" cy="40" r="29" style={{ fill: 'var(--accent-primary-subtle)' }} />
            <text x="40" y="40" dominantBaseline="central" textAnchor="middle" className="font-display text-title font-medium" style={{ fill: 'var(--accent-primary)' }}>
              {pet?.name[0] ?? '?'}
            </text>
          </>
        )}
        <circle cx="40" cy="40" r="29" fill="none" strokeWidth="2" style={{ stroke: 'var(--surface-card)' }} />
        {dueSoon && <circle cx="67" cy="13" r="7" strokeWidth="2.5" style={{ fill: 'var(--status-waiting-dot)', stroke: 'var(--surface-card)' }} />}
      </svg>
    )
  }
  const s = sizes[size]
  return (
    <span className={`relative inline-block shrink-0 rounded-full ${s.box} ${outlined ? 'ring-2 ring-surface-card' : ''}`}>
      <Photo pet={pet} letter={s.letter} />
      {dueSoon && <span className="absolute top-0 right-0 size-12 rounded-full border-2 border-surface-card bg-status-waiting-dot" />}
    </span>
  )
}

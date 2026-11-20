// Pet avatar — the pet's photo or, without one, a drawing of its species (PetPlaceholder) in the pet's frame colour.
// Sizes come from the Figma size/avatar-* tokens; `tiny` (20) is for calendar day tiles: no face on the drawing.
// With petals it is the Figma "Pet avatar" (80): the photo inside a flower in the pet's colour, with a due-soon dot.
// The hero can carry an "add photo" badge (onAddPhoto); `initial` puts the first letter in a small badge, to tell
// apart two pets of one species that share a colour. The picture is decorative: the pet's name is always next to it,
// except where `label` is given (then it reads "<Name>, no photo" or the name).

import type { Pet } from '../data/types'
import { petColorAt, type PetColor } from '../lib/petColors'
import { Icon } from './Icon'
import { PetPlaceholder } from './PetPlaceholder'

export type AvatarSize = 'tiny' | 'sm' | 'md' | 'lg' | 'xl' | 'hero'

const sizes: Record<AvatarSize, { box: string; letter: string }> = {
  tiny: { box: 'size-icon-20', letter: 'text-tab-label' }, // Calendar day tiles
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
  /** The pet's frame colour, for the placeholder (defaults to the petals colour, then the pet's own). */
  color?: PetColor
  /** Hero only: an "add photo" badge at the bottom right. */
  onAddPhoto?: () => void
  /** Show the first letter in a small badge (two pets of one species share a colour). */
  initial?: boolean
  /** Read by VoiceOver when the avatar stands alone (no name next to it). */
  label?: boolean
}

// Figma petals, 78 × 78; drawn at (1, 1) in the 80 box.
const PETALS =
  'M39 5.47161C42.9498 -4.04382 57.0995 -0.251113 55.7642 9.96001C63.9443 3.69869 74.3013 14.0557 68.04 22.2358C78.2511 20.9005 82.0438 35.0502 72.5284 39C82.0438 42.9498 78.2511 57.0995 68.04 55.7642C74.3013 63.9443 63.9443 74.3013 55.7642 68.04C57.0995 78.2511 42.9498 82.0438 39 72.5284C35.0502 82.0438 20.9005 78.2511 22.2358 68.04C14.0557 74.3013 3.69869 63.9443 9.96001 55.7642C-0.251113 57.0995 -4.04382 42.9498 5.47161 39C-4.04382 35.0502 -0.251113 20.9005 9.96001 22.2358C3.69869 14.0557 14.0557 3.69869 22.2358 9.96001C20.9005 -0.251113 35.0502 -4.04382 39 5.47161Z'

function Photo({ pet, color, small }: { pet?: Pet; color: PetColor; small?: boolean }) {
  if (pet?.photo) return <img src={pet.photo} alt="" className="size-full rounded-full object-cover" draggable={false} />
  return (
    <span className="block size-full overflow-hidden rounded-full">
      <PetPlaceholder species={pet?.species ?? 'other'} color={color} face={!small} />
    </span>
  )
}

/** A small round badge with the pet's first letter (Figma 22: surface/card, border/card, text/primary). */
function Initial({ pet }: { pet?: Pet }) {
  return (
    <span aria-hidden="true" className="absolute -right-2 -bottom-2 flex size-[22px] items-center justify-center rounded-full bg-surface-card text-caption font-medium text-text-primary ring-1 ring-border-card ring-inset">
      {pet?.name[0]?.toUpperCase()}
    </span>
  )
}

export function PetAvatar({ pet, size = 'sm', dueSoon, outlined, petals: flower, color, onAddPhoto, initial, label }: PetAvatarProps) {
  const c = color ?? flower ?? pet?.color ?? petColorAt(0)
  const a11y = label && pet ? { role: 'img', 'aria-label': pet.photo ? pet.name : `${pet.name}, no photo` } : { 'aria-hidden': true as const }
  if (flower) {
    // Figma: petals at (1,1), photo 58 at (11,11) with a 2px white ring, due dot 14 at (60,6) — all in one 80 box.
    const clip = `petals-${pet?.id ?? 'none'}`
    return (
      <span className="relative inline-block size-avatar-80 shrink-0" {...a11y}>
        <svg viewBox="0 0 80 80" className="size-full">
          <defs>
            <clipPath id={clip}>
              <circle cx="40" cy="40" r="29" />
            </clipPath>
          </defs>
          <path d={PETALS} transform="translate(1 1)" style={{ fill: petals[flower] }} />
          {pet?.photo ? (
            <image href={pet.photo} x="11" y="11" width="58" height="58" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
          ) : (
            <foreignObject x="11" y="11" width="58" height="58">
              <PetPlaceholder species={pet?.species ?? 'other'} color={c} />
            </foreignObject>
          )}
          <circle cx="40" cy="40" r="29" fill="none" strokeWidth="2" style={{ stroke: 'var(--surface-card)' }} />
          {dueSoon && <circle cx="67" cy="13" r="7" strokeWidth="2.5" style={{ fill: 'var(--status-waiting-dot)', stroke: 'var(--surface-card)' }} />}
        </svg>
        {initial && <Initial pet={pet} />}
      </span>
    )
  }
  const s = sizes[size]
  const small = size === 'tiny'
  return (
    <span
      className={`relative inline-block shrink-0 rounded-full ${s.box} ${outlined ? 'ring-2 ring-surface-card' : ''} ${small && !pet?.photo ? 'ring-[1.5px] ring-surface-card' : ''}`}
      {...a11y}
    >
      <Photo pet={pet} color={c} small={small} />
      {dueSoon && <span className="absolute top-0 right-0 size-12 rounded-full border-2 border-surface-card bg-status-waiting-dot" />}
      {initial && <Initial pet={pet} />}
      {onAddPhoto && (
        // Figma: a 32 badge at the bottom right, outside the photo circle; the tap area is 44
        <button
          type="button"
          aria-label={`Add a photo of ${pet?.name ?? 'your pet'}`}
          onClick={onAddPhoto}
          className="press absolute -right-8 -bottom-8 flex size-control-44 items-center justify-center rounded-full"
        >
          <span className="shadow-card flex size-control-32 items-center justify-center rounded-full bg-surface-card text-text-primary ring-1 ring-border-card ring-inset">
            <Icon name="camera" size={18} />
          </span>
        </button>
      )}
    </span>
  )
}

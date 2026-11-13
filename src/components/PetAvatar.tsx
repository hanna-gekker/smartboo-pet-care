// Pet avatar — the pet's photo, or the first letter of its name on a soft accent circle.
// Sizes come from the Figma size/avatar-* tokens. The petals and pet colors of the Figma
// "Pet avatar" come later; for now this is the round photo used in rows and headers.

import type { Pet } from '../data/types'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero'

const sizes: Record<AvatarSize, { box: string; letter: string }> = {
  sm: { box: 'size-avatar-40', letter: 'text-body-l' }, // Task row, Boo cards
  md: { box: 'size-avatar-48', letter: 'text-title' }, // List row (Pets list)
  lg: { box: 'size-avatar-72', letter: 'text-display' }, // Next up
  xl: { box: 'size-avatar-80', letter: 'text-display' }, // Your pack
  hero: { box: 'size-avatar-128', letter: 'text-display' }, // Pet folder, Edit profile
}

type PetAvatarProps = {
  pet?: Pet
  size?: AvatarSize
  /** A small dot: something is due soon for this pet. */
  dueSoon?: boolean
}

export function PetAvatar({ pet, size = 'sm', dueSoon }: PetAvatarProps) {
  const s = sizes[size]
  return (
    <span className={`relative inline-block shrink-0 ${s.box}`}>
      {pet?.photo ? (
        <img src={pet.photo} alt="" className="size-full rounded-full object-cover" draggable={false} />
      ) : (
        <span className={`flex size-full items-center justify-center rounded-full bg-accent-primary-subtle font-display font-medium text-accent-primary ${s.letter}`}>
          {pet?.name[0] ?? '?'}
        </span>
      )}
      {dueSoon && <span className="absolute top-0 right-0 size-12 rounded-full border-2 border-surface-canvas bg-status-waiting-dot" />}
    </span>
  )
}

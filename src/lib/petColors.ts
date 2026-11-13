// Pet colors from Figma (pet/*): the petals around a pet's photo.
// Until the owner can pick one in the profile, pets get a color by their place in the list.

export type PetColor = 'ocean' | 'lavender' | 'butter' | 'mint' | 'pink' | 'slate'

const ORDER: PetColor[] = ['ocean', 'lavender', 'butter', 'mint', 'pink', 'slate']

export const petColorAt = (index: number): PetColor => ORDER[index % ORDER.length]

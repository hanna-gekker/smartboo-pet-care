import type { Meta, StoryObj } from '@storybook/react-vite'
import { SPECIES, type Pet } from '../data/types'
import { petColorAt } from '../lib/petColors'
import { speciesLabel } from '../lib/species'
import { bella, rocky } from '../stories/fixtures'
import { PetAvatar, type AvatarSize } from './PetAvatar'

const meta = {
  title: 'Boo & Brand/PetAvatar',
  component: PetAvatar,
  args: { pet: rocky, size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md', 'lg', 'xl', 'hero'] },
    petals: { control: 'select', options: [undefined, 'ocean', 'lavender', 'butter', 'mint', 'pink', 'slate'] },
  },
} satisfies Meta<typeof PetAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Photo: Story = {}
/** No photo yet: a drawing of the pet's species in its frame colour. */
export const Placeholder: Story = { args: { pet: bella } }
const noPhoto = (species: Pet['species'], i: number): Pet => ({ id: species, name: speciesLabel(species), species, color: petColorAt(i), weightUnit: 'kg', allergies: [] })
/** All 17 species (Figma "Pet avatars · final"), with petals as in Your pack. */
export const AllSpecies: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-16">
      {SPECIES.map((sp, i) => (
        <div key={sp} className="flex flex-col items-center gap-4">
          <PetAvatar pet={noPhoto(sp, i)} size="xl" petals={petColorAt(i)} />
          <span className="text-caption text-text-secondary">{speciesLabel(sp)}</span>
        </div>
      ))}
    </div>
  ),
}
/** 20 and smaller (calendar day tiles): the animal without its face. */
export const Tiny: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {SPECIES.map((sp, i) => (
        <PetAvatar key={sp} pet={noPhoto(sp, i)} size="tiny" />
      ))}
    </div>
  ),
}
/** Pet folder: the hero with the "add photo" badge. */
export const HeroAddPhoto: Story = { args: { pet: bella, size: 'hero', onAddPhoto: () => {} } }
/** Two pets of one species with the same colour: the first letter tells them apart. */
export const Initial: Story = { args: { pet: bella, size: 'xl', petals: 'ocean', initial: true } }
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-12">
      {(['tiny', 'sm', 'md', 'lg', 'xl', 'hero'] as AvatarSize[]).map((s) => (
        <PetAvatar key={s} {...args} size={s} />
      ))}
    </div>
  ),
}
/** Your pack on Today: petals in each pet's color. */
export const Petals: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-12">
      {(['ocean', 'lavender', 'butter', 'mint', 'pink', 'slate'] as const).map((c) => (
        <PetAvatar key={c} {...args} size="xl" petals={c} />
      ))}
    </div>
  ),
}
export const DueSoon: Story = { args: { size: 'xl', petals: 'ocean', dueSoon: true } }
/** The white ring on Next up. */
export const Outlined: Story = { args: { size: 'lg', outlined: true } }
/** Add your pet, step 2: the 128 flower with the add-photo badge; and the 112 flower on the "all set" card. */
export const FlowerHero: Story = {
  render: (args) => (
    <div className="flex items-center gap-24">
      <PetAvatar {...args} pet={bella} size="hero" petals="pink" onAddPhoto={() => {}} />
      <PetAvatar {...args} pet={bella} size="card" petals="butter" />
    </div>
  ),
}

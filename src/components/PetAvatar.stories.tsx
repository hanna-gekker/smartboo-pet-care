import type { Meta, StoryObj } from '@storybook/react-vite'
import { bella, rocky } from '../stories/fixtures'
import { PetAvatar, type AvatarSize } from './PetAvatar'

const meta = {
  title: 'Boo & Brand/PetAvatar',
  component: PetAvatar,
  args: { pet: rocky, size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'hero'] },
    petals: { control: 'select', options: [undefined, 'ocean', 'lavender', 'butter', 'mint', 'pink', 'slate'] },
  },
} satisfies Meta<typeof PetAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Photo: Story = {}
/** No photo yet: the first letter of the name. */
export const Letter: Story = { args: { pet: bella } }
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-12">
      {(['sm', 'md', 'lg', 'xl', 'hero'] as AvatarSize[]).map((s) => (
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

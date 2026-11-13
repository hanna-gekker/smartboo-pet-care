import type { Meta, StoryObj } from '@storybook/react-vite'
import { BooCharacter } from './BooCharacter'

const meta = {
  title: 'Boo & Brand/BooCharacter',
  component: BooCharacter,
  args: { state: 'idle', look: 'full', size: 176, animated: true },
  argTypes: {
    state: { control: 'inline-radio', options: ['idle', 'listening'] },
    look: { control: 'inline-radio', options: ['full', 'mini'] },
    size: { control: { type: 'range', min: 40, max: 240, step: 8 } },
  },
} satisfies Meta<typeof BooCharacter>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}
export const Listening: Story = { args: { state: 'listening' } }
/** The small Boo in the tab bar. */
export const Mini: Story = { args: { look: 'mini', size: 60 } }
export const NotAnimated: Story = { args: { animated: false } }

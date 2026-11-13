import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

// First story, to check the setup. The full set of stories for every component comes in P12.
const meta = {
  title: 'Core/Button',
  component: Button,
  args: { children: 'Snap a vet paper', variant: 'primary', size: 'medium' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['medium', 'large'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { icon: 'camera' } }
export const Secondary: Story = { args: { variant: 'secondary', icon: 'plus', children: 'Add your pet' } }
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }

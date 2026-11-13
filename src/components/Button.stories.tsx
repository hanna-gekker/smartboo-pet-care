import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Core/Button',
  component: Button,
  args: { children: 'Snap a vet paper', variant: 'primary', size: 'medium', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['medium', 'large'] },
    icon: { control: 'select', options: [undefined, 'camera', 'plus', 'check', 'share', 'phone'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Add your pet', icon: 'plus' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Not now' } }
export const Large: Story = { args: { size: 'large', full: true } }
export const WithIcon: Story = { args: { icon: 'camera' } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const SecondaryPressed: Story = { args: { variant: 'secondary', children: 'Book vet' }, parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
export const Disabled: Story = { args: { disabled: true } }
export const SecondaryDisabled: Story = { args: { variant: 'secondary', children: 'Add your pet', icon: 'plus', disabled: true } }
export const Loading: Story = { args: { loading: true, children: 'Save' } }

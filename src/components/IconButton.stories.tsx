import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IconButton } from './IconButton'

const meta = {
  title: 'Core/IconButton',
  component: IconButton,
  args: { icon: 'plus', label: 'Add a pet', variant: 'primary', size: 40, onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'soft', 'plain'] },
    size: { control: 'inline-radio', options: [40, 56] },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', icon: 'chevron-left', label: 'Back' } }
export const Soft: Story = { args: { variant: 'soft', icon: 'camera', label: 'Snap a vet paper' } }
export const Plain: Story = { args: { variant: 'plain', icon: 'settings', label: 'Settings' } }
export const Size56: Story = { args: { size: 56, icon: 'mic', label: 'Talk to Boo' } }
export const Pressed: Story = { args: { variant: 'secondary', icon: 'chevron-left', label: 'Back' }, parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
export const Disabled: Story = { args: { icon: 'arrow-up', label: 'Send', disabled: true } }

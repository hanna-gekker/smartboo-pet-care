import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Chip } from './ui'

const meta = {
  title: 'Core/Chip',
  component: Chip,
  args: { children: 'All', onClick: fn() },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { active: true } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const SelectedPressed: Story = { args: { active: true }, parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['button'] } } }
/** One answer out of several (breed, weight unit) */
export const Radio: Story = { args: { role: 'radio', active: true, children: 'Beagle' } }
export const Disabled: Story = { args: { disabled: true } }

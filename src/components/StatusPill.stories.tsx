import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPill } from './StatusPill'

const meta = {
  title: 'Core/StatusPill',
  component: StatusPill,
  args: { status: 'waiting', label: 'Overdue · 3 days' },
  argTypes: { status: { control: 'inline-radio', options: ['waiting', 'upcoming', 'done'] } },
} satisfies Meta<typeof StatusPill>

export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {}
export const Upcoming: Story = { args: { status: 'upcoming', label: 'Tomorrow' } }
export const Done: Story = { args: { status: 'done', label: 'Done' } }

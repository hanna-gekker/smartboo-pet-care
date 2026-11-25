import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PickerRow } from './PickerRow'

const meta = {
  title: 'Patterns/PickerRow',
  component: PickerRow<string>,
  args: {
    icon: 'bell',
    title: 'Vaccines & rechecks',
    options: [3, 7, 14, 30].map((d) => ({ value: String(d), label: d === 14 ? '2 weeks before' : `${d} days before` })),
    value: '14',
    onChange: fn(),
  },
  decorators: [(Story) => <div className="panel-card overflow-hidden rounded-24"><Story /></div>],
} satisfies Meta<typeof PickerRow<string>>

export default meta
type Story = StoryObj<typeof meta>

/** Tap: the iPhone's own picker (in the browser, a menu). */
export const Default: Story = {}
export const DailyTasks: Story = { args: { icon: 'calendar', title: 'Daily tasks', options: [{ value: 'off', label: 'Off' }, { value: '08:00', label: '8:00 AM' }], value: '08:00' } }
export const Pressed: Story = { args: { 'data-state': 'pressed' } }
export const Focus: Story = { args: { 'data-state': 'focus' } }

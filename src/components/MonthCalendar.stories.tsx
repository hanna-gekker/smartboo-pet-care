import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { MonthCalendar } from './MonthCalendar'

const meta = {
  title: 'Patterns/MonthCalendar',
  component: MonthCalendar,
  args: {
    month: '2026-11-04',
    selected: '2026-11-04',
    today: '2026-11-04',
    dots: { '2026-11-01': 'done', '2026-11-02': 'overdue', '2026-11-03': 'done', '2026-11-04': 'overdue', '2026-11-05': 'due', '2026-11-06': 'due', '2026-11-08': 'due', '2026-11-12': 'due', '2026-11-20': 'due', '2026-11-27': 'due' },
    onSelect: fn(),
    onPrev: fn(),
    onNext: fn(),
  },
} satisfies Meta<typeof MonthCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const November: Story = {}
export const OtherDaySelected: Story = { args: { selected: '2026-11-12' } }
export const EmptyMonth: Story = { args: { month: '2026-12-01', dots: {} } }
/** Tap a day to select it. */
export const Interactive: Story = {
  render: function Interactive(args) {
    const [selected, setSelected] = useState(args.selected)
    return <MonthCalendar {...args} selected={selected} onSelect={setSelected} />
  },
}

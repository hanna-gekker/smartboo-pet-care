import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { bella, cleo, milo, rocky, tank } from '../stories/fixtures'
import { Calendar } from './Calendar'

const petsByDay = {
  '2026-11-02': [rocky],
  '2026-11-03': [cleo, milo],
  '2026-11-04': [cleo, bella, tank, rocky],
  '2026-11-05': [rocky, milo, cleo],
  '2026-11-06': [bella],
  '2026-11-08': [tank],
  '2026-11-20': [milo],
  '2026-11-27': [rocky],
}
const countByDay = Object.fromEntries(Object.entries(petsByDay).map(([d, p]) => [d, p.length]))

const meta = {
  title: 'Patterns/Calendar',
  component: Calendar,
  args: { view: 'week', anchor: '2026-11-04', selected: '2026-11-04', today: '2026-11-04', petsByDay, countByDay, onSelect: fn(), onPrev: fn(), onNext: fn() },
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Week: Story = {}
export const Month: Story = { args: { view: 'month' } }
/** Another day selected: today keeps its blue circle */
export const OtherDay: Story = { args: { selected: '2026-11-07' } }
/** Tap a day */
export const Interactive: Story = {
  args: { view: 'month' },
  render: function Interactive(args) {
    const [selected, setSelected] = useState(args.selected)
    return <Calendar {...args} selected={selected} onSelect={setSelected} />
  },
}

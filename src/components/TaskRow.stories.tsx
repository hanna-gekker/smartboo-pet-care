import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { cleo, rocky } from '../stories/fixtures'
import { TaskRow } from './TaskRow'

const meta = {
  title: 'Patterns/TaskRow',
  component: TaskRow,
  args: { title: 'Clean litter box', meta: 'Cleo · 12:00 PM', state: 'default', pet: cleo, onToggle: fn() },
  argTypes: { state: { control: 'inline-radio', options: ['default', 'done', 'waiting'] } },
  decorators: [(Story) => <div className="overflow-hidden rounded-24 bg-surface-card"><Story /></div>],
} satisfies Meta<typeof TaskRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Done: Story = { args: { state: 'done' } }
export const Waiting: Story = { args: { title: 'Ear drops', meta: 'Rocky · waiting since 8 AM', state: 'waiting', pet: rocky } }
export const WithDose: Story = { args: { title: 'Ear drops', detail: 'Otomax · 4 drops', meta: 'Rocky · 8 PM', pet: rocky } }
/** Tap the circle: done ⇄ not done. */
export const Interactive: Story = {
  render: function Interactive(args) {
    const [done, setDone] = useState(false)
    return <TaskRow {...args} state={done ? 'done' : 'default'} onToggle={() => setDone((d) => !d)} />
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const meta = {
  title: 'Core/SegmentedControl',
  component: SegmentedControl,
  args: { label: 'View', options, value: 'week', onChange: fn() },
  argTypes: { value: { control: 'inline-radio', options: ['week', 'month'] } },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Week: Story = {}
export const Month: Story = { args: { value: 'month' } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
/** Tap to switch. */
export const Interactive: Story = {
  render: function Interactive(args) {
    const [value, setValue] = useState('week')
    return <SegmentedControl {...args} value={value} onChange={setValue} />
  },
}

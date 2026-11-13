import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Core/Checkbox',
  component: Checkbox,
  args: { checked: false, label: 'Ear drops', tone: 'default', onChange: fn() },
  argTypes: { tone: { control: 'inline-radio', options: ['default', 'waiting'] } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const Checked: Story = { args: { checked: true } }
export const Waiting: Story = { args: { tone: 'waiting', label: 'Bloodwork recheck' } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
export const Disabled: Story = { args: { disabled: true } }
/** Tap it: done ⇄ not done. */
export const Interactive: Story = {
  render: function Interactive(args) {
    const [checked, setChecked] = useState(false)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

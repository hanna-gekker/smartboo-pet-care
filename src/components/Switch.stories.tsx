import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Switch } from './Switch'

const meta = {
  title: 'Core/Switch',
  component: Switch,
  args: { label: 'Let Boo read papers and phrases', hint: 'Sent to an AI service to be read, never kept.', checked: false, onChange: fn() },
  decorators: [(Story) => <div className="panel-card rounded-24 p-16"><Story /></div>],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {}
export const On: Story = { args: { checked: true } }
export const Disabled: Story = { args: { checked: true, disabled: true } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['button'] } } }

function Live() {
  const [on, setOn] = useState(false)
  return <Switch label="Let Boo read papers and phrases" checked={on} onChange={setOn} />
}
/** Tap to switch. */
export const Interactive: Story = { render: () => <Live /> }

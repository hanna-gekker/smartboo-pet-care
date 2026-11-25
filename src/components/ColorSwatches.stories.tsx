import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { PetColor } from '../data/types'
import { ColorSwatches } from './ColorSwatches'

const meta = {
  title: 'Patterns/ColorSwatches',
  component: ColorSwatches,
  args: { label: 'Frame colour', value: 'ocean', onChange: () => {} },
  decorators: [(Story) => <div className="rounded-24 bg-surface-panel p-16 ring-1 ring-inset ring-border-card"><Story /></div>],
} satisfies Meta<typeof ColorSwatches>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pink: Story = { args: { value: 'pink' } }
/** Edit and Add your pet: a 7th circle, No frame (Figma 14) */
export const WithNoFrame: Story = { args: { allowNone: true, value: 'none' } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['[aria-checked="true"]'] } } }
/** Tap a colour */
function Picker() {
  const [value, setValue] = useState<PetColor | 'none'>('ocean')
  return <ColorSwatches label="Frame colour" allowNone value={value} onChange={setValue} />
}
export const Interactive: Story = { render: () => <Picker /> }
export const Disabled: Story = { args: { disabled: true } }

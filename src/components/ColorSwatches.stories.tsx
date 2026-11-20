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
/** Tap a colour */
function Picker() {
  const [value, setValue] = useState<PetColor>('ocean')
  return <ColorSwatches label="Frame colour" value={value} onChange={setValue} />
}
export const Interactive: Story = { render: () => <Picker /> }

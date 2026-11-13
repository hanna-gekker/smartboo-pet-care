import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TapHint } from './TapHint'

const meta = {
  title: 'Boo & Brand/TapHint',
  component: TapHint,
  args: { label: 'Tap Boo to talk', onClick: fn() },
  decorators: [(Story) => <div className="py-16"><Story /></div>],
} satisfies Meta<typeof TapHint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }

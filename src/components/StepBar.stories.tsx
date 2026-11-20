import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepBar } from './StepBar'

const meta = {
  title: 'Patterns/StepBar',
  component: StepBar,
  args: { steps: 5, current: 2 },
} satisfies Meta<typeof StepBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const First: Story = { args: { current: 1 } }
export const Last: Story = { args: { current: 5 } }
/** Fish: four steps, no weight */
export const Fish: Story = { args: { steps: 4, current: 3 } }

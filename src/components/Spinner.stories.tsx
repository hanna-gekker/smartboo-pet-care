import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta = {
  title: 'Core/Spinner',
  component: Spinner,
  args: { size: 20 },
  argTypes: { size: { control: 'inline-radio', options: [20, 24] } },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Size20: Story = {}
export const Size24: Story = { args: { size: 24 } }

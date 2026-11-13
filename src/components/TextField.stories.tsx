import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'Patterns/TextField',
  component: TextField,
  args: { label: 'Name', placeholder: 'e.g. Rocky' },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Filled: Story = { args: { defaultValue: 'Rocky' } }
export const Focus: Story = { args: { defaultValue: 'Rocky', 'data-state': 'focus' } }
export const WithHint: Story = { args: { label: 'Microchip', placeholder: '15 digits', hint: 'On the vaccine certificate or the collar tag' } }
/** Boo read this value but isn't sure. */
export const NeedsCheck: Story = { args: { label: 'Born', type: 'date', defaultValue: '2019-03-12', needsCheck: true } }
export const Error: Story = { args: { defaultValue: '', error: 'Add your pet’s name' } }
export const Disabled: Story = { args: { label: 'Species', defaultValue: 'Dog', disabled: true } }
export const Select: Story = {
  args: {
    label: 'Species',
    defaultValue: 'dog',
    options: [
      { value: 'dog', label: 'Dog' },
      { value: 'cat', label: 'Cat' },
      { value: 'fish', label: 'Fish' },
    ],
  },
}

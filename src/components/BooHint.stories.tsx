import type { Meta, StoryObj } from '@storybook/react-vite'
import { BooHint } from './BooHint'
import { Button } from './Button'

const meta = {
  title: 'Boo & Brand/BooHint',
  component: BooHint,
  args: { children: 'I don’t know Rocky’s shots yet. Snap the last vet paper?' },
} satisfies Meta<typeof BooHint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actions: (
      <>
        <Button>Snap a vet paper</Button>
        <Button variant="ghost">Not now</Button>
      </>
    ),
  },
}
export const TextOnly: Story = {}

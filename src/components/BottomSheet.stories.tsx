import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'

const meta = {
  title: 'Patterns/BottomSheet',
  component: BottomSheet,
  args: {
    open: true,
    label: 'Remind you',
    onClose: fn(),
    children: (
      <div className="flex flex-col gap-8 pt-8 pb-16">
        <h2 className="font-display text-title font-medium">Remind you 2 weeks before each one?</h2>
        <p className="text-body text-text-secondary">I’ll nudge you before Rocky’s vaccines are due.</p>
        <Button full className="mt-16">Yes, remind me</Button>
        <Button full variant="ghost">Not now</Button>
      </div>
    ),
  },
} satisfies Meta<typeof BottomSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}

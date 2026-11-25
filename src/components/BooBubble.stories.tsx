import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { BooBubble } from './BooBubble'

const meta = {
  title: 'Boo & Brand/BooBubble',
  component: BooBubble,
  args: { pose: 'sleeping', children: 'Nothing planned yet. Reminders show up here once I read a vet paper.' },
} satisfies Meta<typeof BooBubble>

export default meta
type Story = StoryObj<typeof meta>

/** Empty Schedule */
export const EmptySchedule: Story = {
  args: {
    action: (
      <Button full size="large" icon="camera">
        Snap a vet paper
      </Button>
    ),
  },
}
/** History search with no results */
export const NoResults: Story = {
  args: {
    pose: 'reading',
    children: 'I couldn’t find “heartworm” in Rocky’s records.',
    action: (
      <Button full size="large" variant="secondary">
        Clear search
      </Button>
    ),
  },
}

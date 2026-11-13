import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlassCard } from './GlassCard'

const meta = {
  title: 'Boo & Brand/GlassCard',
  component: GlassCard,
  args: { image: '/pets/rocky.jpg', title: 'Rocky’s rabies is due in 2 weeks', caption: 'Reminder' },
  // Glass needs something behind it: the Welcome background
  decorators: [(Story) => <div className="bg-welcome -m-16 flex min-h-[240px] items-center justify-center p-24"><Story /></div>],
} satisfies Meta<typeof GlassCard>

export default meta
type Story = StoryObj<typeof meta>

export const Reminder: Story = {}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { BooCharacter, type BooPose } from './BooCharacter'

const POSES: BooPose[] = ['idle', 'listening', 'wave', 'reading', 'writing', 'happy', 'oops', 'sleeping', 'bell']

const meta = {
  title: 'Boo & Brand/BooCharacter',
  component: BooCharacter,
  args: { state: 'idle', look: 'full', size: 176, animated: true },
  argTypes: {
    pose: { control: 'select', options: POSES },
    state: { control: 'inline-radio', options: ['idle', 'listening'] },
    look: { control: 'inline-radio', options: ['full', 'mini'] },
    size: { control: { type: 'range', min: 40, max: 240, step: 8 } },
  },
} satisfies Meta<typeof BooCharacter>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}
export const Listening: Story = { args: { state: 'listening' } }
/** The small Boo in the tab bar. */
export const Mini: Story = { args: { look: 'mini', size: 60 } }
export const NotAnimated: Story = { args: { animated: false } }
export const Wave: Story = { args: { pose: 'wave' } }
/** All nine poses (Figma "Boo / Character" states share these pictures) */
export const AllPoses: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-16">
      {POSES.map((p) => (
        <div key={p} className="flex flex-col items-center gap-4 text-caption text-text-secondary">
          <BooCharacter {...args} pose={p} size={120} />
          {p}
        </div>
      ))}
    </div>
  ),
}

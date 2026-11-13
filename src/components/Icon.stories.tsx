import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from './Icon'

const names: IconName[] = [
  'sun', 'calendar', 'paw', 'settings', 'home', 'camera', 'mic', 'keyboard', 'plus', 'check', 'x', 'chevron-left', 'chevron-right',
  'arrow-up', 'share', 'phone', 'bell', 'search', 'more', 'user', 'thermometer', 'bag', 'heart-pulse', 'route', 'syringe', 'pill',
  'weight', 'shield-alert', 'alert-circle', 'stethoscope', 'file-text', 'image', 'sparkle-ai',
]

const meta = {
  title: 'Core/Icon',
  component: Icon,
  args: { name: 'paw', size: 24 },
  argTypes: { name: { control: 'select', options: names }, size: { control: 'inline-radio', options: [16, 20, 24] } },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}
/** The whole Figma set. The line scales with the size: 24 → 1.5, 20 → 1.25, 16 → 1. */
export const All: Story = {
  render: ({ size }) => (
    <div className="grid grid-cols-4 gap-16">
      {names.map((n) => (
        <div key={n} className="flex flex-col items-center gap-8 text-center">
          <Icon name={n} size={size} />
          <span className="text-caption text-text-secondary">{n}</span>
        </div>
      ))}
    </div>
  ),
}
export const Sizes: Story = {
  render: ({ name }) => (
    <div className="flex items-end gap-16">
      {[16, 20, 24].map((s) => (
        <Icon key={s} name={name} size={s} />
      ))}
    </div>
  ),
}

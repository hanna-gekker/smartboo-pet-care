import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Core/Button',
  component: Button,
  args: { children: 'Snap a vet paper', variant: 'primary', size: 'medium', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['medium', 'large'] },
    icon: { control: 'select', options: [undefined, 'camera', 'plus', 'check', 'share', 'phone'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Book vet' } }
export const Outline: Story = { args: { variant: 'outline', size: 'large', full: true, children: 'Add your pet', icon: 'plus' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Not now' } }
export const Large: Story = { args: { size: 'large', full: true } }
export const WithIcon: Story = { args: { icon: 'camera' } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const SecondaryPressed: Story = { args: { variant: 'secondary', children: 'Book vet' }, parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['button'] } } }
export const Disabled: Story = { args: { disabled: true } }
export const SecondaryDisabled: Story = { args: { variant: 'secondary', children: 'Add your pet', icon: 'plus', disabled: true } }
export const Loading: Story = { args: { loading: true, children: 'Save' } }
export const SecondaryLoading: Story = { args: { variant: 'secondary', loading: true, children: 'Book vet' } }
export const GhostLoading: Story = { args: { variant: 'ghost', loading: true, children: 'Not now' } }
export const GhostPressed: Story = { args: { variant: 'ghost', children: 'Not now' }, parameters: { pseudo: { active: true } } }

/** All states, as on the Figma "States" board: variant × size × default · pressed · focus · disabled · loading */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-12 text-caption text-text-secondary">
      <span />
      {['Default', 'Pressed', 'Focus', 'Disabled', 'Loading'].map((h) => (
        <span key={h}>{h}</span>
      ))}
      {(['primary', 'secondary', 'ghost', 'outline'] as const).flatMap((variant) =>
        (['medium', 'large'] as const).map((size) => (
          <div key={variant + size} className="contents">
            <span>
              {variant} · {size}
            </span>
            <Button variant={variant} size={size}>Button</Button>
            <Button variant={variant} size={size} data-state="pressed">Button</Button>
            <Button variant={variant} size={size} data-state="focus">Button</Button>
            <Button variant={variant} size={size} disabled>Button</Button>
            <Button variant={variant} size={size} loading>Button</Button>
          </div>
        )),
      )}
    </div>
  ),
}

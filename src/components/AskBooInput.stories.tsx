import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AskBooInput } from './AskBooInput'

const meta = {
  title: 'Patterns/AskBooInput',
  component: AskBooInput,
  args: { placeholder: 'Tell Boo anything…', onType: fn(), onSnap: fn(), onTalk: fn() },
  decorators: [(Story) => <div className="rounded-24 bg-ai-card p-24"><Story /></div>],
} satisfies Meta<typeof AskBooInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
/** Welcome: one field with the camera and the mic inside, on a white card */
export const WelcomeField: Story = {
  args: { variant: 'field', placeholder: 'Tell me about your pet…' },
  decorators: [(Story) => <div className="rounded-24 bg-surface-card p-24"><Story /></div>],
}

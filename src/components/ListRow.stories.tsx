import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { rocky } from '../stories/fixtures'
import { ListRow } from './ListRow'

const meta = {
  title: 'Patterns/ListRow',
  component: ListRow,
  args: { title: 'Vaccines', subtitle: 'Rabies due Dec 3', icon: 'syringe', trailing: 'chevron', onClick: fn() },
  // A row lives inside a list card
  decorators: [(Story) => <div className="overflow-hidden rounded-24 bg-surface-card"><Story /></div>],
} satisfies Meta<typeof ListRow>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcon: Story = {}
export const WithPhoto: Story = { args: { icon: undefined, pet: rocky, title: 'Rocky', subtitle: 'Labrador Retriever · 7 y', value: 'Ear drops today' } }
/** The Pets list: overdue in red. */
export const Overdue: Story = {
  args: { icon: undefined, pet: rocky, title: 'Rocky', subtitle: 'Labrador Retriever · 7 y', value: <span className="text-status-waiting-text">2 overdue</span> },
}
export const WithEmoji: Story = { args: { icon: undefined, emoji: '🩺', title: 'New vet', subtitle: 'Everything: history, vaccines, meds, documents' } }
export const WithAction: Story = { args: { icon: 'stethoscope', label: 'Vet', title: 'Bayside Animal Clinic', subtitle: undefined, trailing: { label: 'Call', icon: 'phone' }, href: 'tel:+14155550123' } }
export const WithValue: Story = { args: { icon: undefined, title: 'Microchip', subtitle: undefined, value: '—', trailing: undefined, onClick: undefined } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }

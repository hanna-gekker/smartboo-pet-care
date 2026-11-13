import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { rocky } from '../stories/fixtures'
import { Card } from './Card'
import { ListRow } from './ListRow'

const meta = {
  title: 'Core/Card',
  component: Card,
  args: { variant: 'plain', children: null },
  argTypes: { variant: { control: 'inline-radio', options: ['plain', 'list'] } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const text = (
  <>
    <p className="font-display text-title font-medium">All good.</p>
    <p className="mt-4 text-body text-text-secondary">Next: Rocky’s rabies in 2 weeks.</p>
  </>
)

export const Plain: Story = { args: { children: text } }
export const List: Story = {
  args: {
    variant: 'list',
    className: 'overflow-hidden',
    children: (
      <>
        <ListRow pet={rocky} title="Rocky" subtitle="Labrador Retriever · 7 y" value="2 overdue" trailing="chevron" onClick={() => {}} />
        <ListRow icon="plus" title="Add a pet" subtitle="or snap a vet paper" trailing="chevron" onClick={() => {}} />
      </>
    ),
  },
}
export const Tappable: Story = { args: { children: text, onClick: fn() } }
export const TappablePressed: Story = { args: { children: text, onClick: fn() }, parameters: { pseudo: { active: true } } }

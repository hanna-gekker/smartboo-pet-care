import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { cleo, rocky } from '../stories/fixtures'
import { NextUpCard } from './NextUpCard'

const meta = {
  title: 'Patterns/NextUpCard',
  component: NextUpCard,
  args: {
    pet: rocky,
    title: 'Rabies & DHPP',
    meta: 'Rocky · was due Nov 1 · Bayside Animal Clinic',
    status: { kind: 'waiting', label: 'Overdue · 3 days' },
    onDone: fn(),
    onBookVet: fn(),
  },
} satisfies Meta<typeof NextUpCard>

export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {}
export const Upcoming: Story = { args: { pet: cleo, title: 'Ear drops', meta: 'Cleo · Otomax · 4 drops', status: { kind: 'upcoming', label: '8 PM' } } }
/** No vet saved: only "Done". */
export const WithoutVet: Story = { args: { onBookVet: undefined } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SYMPTOM_CHOICES } from '../lib/boo'
import { rocky } from '../stories/fixtures'
import { RecordSheet } from './RecordSheet'

const meta = {
  title: 'Patterns/RecordSheet',
  component: RecordSheet,
  args: { icon: 'heart-pulse', kind: 'Health note', title: 'Threw up after breakfast', pet: rocky, when: 'Fri, Oct 30 · 8:40 AM', onShare: fn(), onDelete: fn() },
  // The sheet's content, on the sheet's surface
  decorators: [(Story) => <div className="rounded-t-24 bg-surface-card px-24 pt-16"><Story /></div>],
} satisfies Meta<typeof RecordSheet>

export default meta
type Story = StoryObj<typeof meta>

/** Figma "Record detail · Health note (from Talk)" */
export const HealthNoteFromTalk: Story = {
  args: {
    said: 'Rocky threw up after breakfast. Just once, he’s eating fine.',
    saidWhen: 'Oct 30, 8:41 AM',
    question: 'Just once? Is Rocky eating normally?',
    choices: SYMPTOM_CHOICES,
    answers: ['Once', 'Eating fine'],
    onAnswer: fn(),
  },
}
/** Figma "Record detail · Vet visit (from a vet paper)" */
export const FromAVetPaper: Story = {
  args: { icon: 'heart-pulse', title: 'Vet visit · ear infection', when: 'Wed, Oct 28', details: 'Dr. Lee · Apoquel 16 mg for 30 days', source: { title: 'Invoice · $148.00', subtitle: 'Paws & Claws · Oct 28', onOpen: fn() } },
}
/** An older record: no words saved, nothing to share on this device */
export const Plain: Story = { args: { icon: 'weight', kind: 'Weight', title: 'Weight · 24.6 lb', when: 'Tue, Oct 20', onShare: undefined } }
/** Focus on the answer chips */
export const Focus: Story = { ...HealthNoteFromTalk, parameters: { pseudo: { focusVisible: ['[role=radio]'] } } }

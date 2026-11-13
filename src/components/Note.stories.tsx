import type { Meta, StoryObj } from '@storybook/react-vite'
import { Note } from './Note'

const meta = {
  title: 'Boo & Brand/Note',
  component: Note,
  args: { icon: 'home', children: 'Your pets’ records stay on this phone.' },
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = {}
export const Stethoscope: Story = { args: { icon: 'stethoscope', children: 'Boo keeps your pet’s records. It isn’t a vet.' } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { bella, cleo, milo, rocky, tank } from '../stories/fixtures'
import { DayTile } from './DayTile'

const meta = {
  title: 'Patterns/DayTile',
  component: DayTile,
  args: { day: 5, label: 'Thursday, November 5, 2 tasks', pets: [rocky, cleo], onSelect: fn() },
  decorators: [(Story) => <div className="w-[46px]"><Story /></div>],
} satisfies Meta<typeof DayTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoPets: Story = { args: { pets: [] } }
export const OnePet: Story = { args: { pets: [tank] } }
/** More than two pets: one photo and "+N" */
export const MorePets: Story = { args: { pets: [rocky, milo, cleo] } }
export const Today: Story = { args: { day: 4, today: true } }
export const Selected: Story = { args: { selected: true, pets: [bella, milo, cleo] } }
export const TodaySelected: Story = { args: { day: 4, today: true, selected: true, pets: [rocky, milo, cleo] } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['button'] } } }

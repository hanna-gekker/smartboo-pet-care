import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TabBar } from './TabBar'

const meta = {
  title: 'Patterns/TabBar',
  component: TabBar,
  // docked: false keeps it in the page instead of pinned to the bottom of the screen
  args: { active: 'today', onBoo: fn(), docked: false },
  argTypes: { active: { control: 'inline-radio', options: ['today', 'schedule', 'pets', undefined] } },
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Today: Story = {}
export const Schedule: Story = { args: { active: 'schedule' } }
export const Pets: Story = { args: { active: 'pets' } }
/** Screens like Settings: no tab is open. */
export const NoneActive: Story = { args: { active: undefined } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }

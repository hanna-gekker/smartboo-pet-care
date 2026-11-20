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
/** Something is overdue: a coral dot on Schedule, ringed in the glass color. */
export const OverdueDot: Story = { args: { overdue: true } }
/** The dot on the selected Schedule tab, ringed in the pill color. */
export const OverdueDotOnSelected: Story = { args: { active: 'schedule', overdue: true } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
/** Focus on one tab: the ring around it */
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['a[href="/schedule"]'] } } }

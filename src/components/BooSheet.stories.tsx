import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import { sampleData } from '../data/sample'
import { useApp } from '../data/useApp'
import { useUi, type BooStart } from '../data/useUi'
import { BooSheet } from './BooSheet'

/** The Boo sheet reads the app's state. Each story loads the sample pets and opens the sheet on one step. */
function OpenBoo({ start }: { start: BooStart }) {
  useEffect(() => {
    useApp.setState({ ...sampleData(), loaded: true })
    useUi.getState().openBoo(start)
  }, [start])
  return <BooSheet />
}

const meta = {
  title: 'Boo & Brand/BooSheet',
  component: OpenBoo,
  args: { start: 'menu' },
  argTypes: { start: { control: 'inline-radio', options: ['menu', 'type', 'snap', 'talk'] } },
} satisfies Meta<typeof OpenBoo>

export default meta
type Story = StoryObj<typeof meta>

export const Menu: Story = {}
export const Typing: Story = { args: { start: 'type' } }
export const Snap: Story = { args: { start: 'snap' } }
export const Talk: Story = { args: { start: 'talk' } }

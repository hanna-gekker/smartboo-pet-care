import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { rocky } from '../stories/fixtures'
import { PhotoPick } from './PhotoPick'

const meta = {
  title: 'Core/PhotoPick',
  component: PhotoPick,
  args: { onPick: fn() },
} satisfies Meta<typeof PhotoPick>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const WithPhoto: Story = { args: { photo: rocky.photo } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['button'] } } }

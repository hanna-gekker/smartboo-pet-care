import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import { useUi } from '../data/useUi'
import { Toast } from './Toast'

/** Toast reads its text from the app's UI state, so each story puts one there. It hides after 5 seconds, like in the app. */
function ShowToast({ text, undo }: { text: string; undo: boolean }) {
  useEffect(() => {
    useUi.getState().showToast(text, undo ? () => {} : undefined)
  }, [text, undo])
  return <Toast />
}

const meta = {
  title: 'Patterns/Toast',
  component: ShowToast,
  args: { text: 'Saved · Cleo, 3.9 kg · +0.3 kg since Nov 3', undo: true },
} satisfies Meta<typeof ShowToast>

export default meta
type Story = StoryObj<typeof meta>

export const WithUndo: Story = {}
export const WithoutUndo: Story = { args: { text: '2 reminders set', undo: false } }

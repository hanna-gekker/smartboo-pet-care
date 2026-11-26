import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BOO_ERRORS, type BooErrorCase } from '../lib/booErrors'
import { BooError } from './BooError'

const story = (kind: BooErrorCase): Story => {
  const e = BOO_ERRORS[kind]
  return { args: { input: e.input, message: e.message, primary: { label: e.primary, onClick: fn() }, secondary: { label: e.secondary, onClick: fn() } } }
}

const meta = {
  title: 'Boo & Brand/BooError',
  component: BooError,
  decorators: [(Story) => <div className="rounded-t-24 bg-surface-card px-24 pt-24 pb-32"><Story /></div>],
} satisfies Meta<typeof BooError>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 8e */
export const PhotoTooBlurry: Story = story('blurry')
/** Figma 8f */
export const CouldntRead: Story = story('not-paper')
/** Figma 8g */
export const CameraAccessOff: Story = story('camera-off')
/** Figma 8h: the paper waits on the phone */
export const Offline: Story = story('offline')
/** Figma 8i */
export const DidntCatchThat: Story = story('not-heard')
/** Same pattern as Camera access off (text approved Nov 26) */
export const MicrophoneAccessOff: Story = story('mic-off')
/** Boo's server: the daily limit is used up */
export const DailyLimit: Story = story('limit')
/** Boo's server didn't answer */
export const SomethingWentWrong: Story = story('failed')

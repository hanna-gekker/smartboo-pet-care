// Boo — Figma "Boo / Character" (Design system): the AI assistant, a plush lavender paw with a face.
// A picture per pose (src/assets/boo/), with a dark version of each for the dark theme.
//
// pose   idle · listening · wave · reading · writing · happy · oops · sleeping · bell (Figma states share these)
// state  idle      — Boo sways and floats slowly (about 6 s)
//        listening — a soft pulse while Boo records your voice; the listening pose unless another is given
// look   full — the picture over a soft oval shadow (176 × 192 in Figma)
//        mini — the picture alone (the Boo button in the tab bar)
//
// When the phone asks for less motion, Boo stays still. Boo is decoration:
// the button around it carries the name for VoiceOver.

import bell from '../assets/boo/bell.webp'
import bellDark from '../assets/boo/bell-dark.webp'
import happy from '../assets/boo/happy.webp'
import happyDark from '../assets/boo/happy-dark.webp'
import idle from '../assets/boo/idle.webp'
import idleDark from '../assets/boo/idle-dark.webp'
import listening from '../assets/boo/listening.webp'
import listeningDark from '../assets/boo/listening-dark.webp'
import oops from '../assets/boo/oops.webp'
import oopsDark from '../assets/boo/oops-dark.webp'
import reading from '../assets/boo/reading.webp'
import readingDark from '../assets/boo/reading-dark.webp'
import sleeping from '../assets/boo/sleeping.webp'
import sleepingDark from '../assets/boo/sleeping-dark.webp'
import wave from '../assets/boo/wave.webp'
import waveDark from '../assets/boo/wave-dark.webp'
import writing from '../assets/boo/writing.webp'
import writingDark from '../assets/boo/writing-dark.webp'

export type BooState = 'idle' | 'listening'
export type BooPose = 'idle' | 'listening' | 'wave' | 'reading' | 'writing' | 'happy' | 'oops' | 'sleeping' | 'bell'

const pictures: Record<BooPose, [string, string]> = {
  idle: [idle, idleDark],
  listening: [listening, listeningDark],
  wave: [wave, waveDark],
  reading: [reading, readingDark],
  writing: [writing, writingDark],
  happy: [happy, happyDark],
  oops: [oops, oopsDark],
  sleeping: [sleeping, sleepingDark],
  bell: [bell, bellDark],
}

type BooCharacterProps = {
  pose?: BooPose
  state?: BooState
  look?: 'full' | 'mini'
  /** Width in px. Defaults to the Figma size: 176 (full) or 60 (mini). */
  size?: number
  /** Sway and pulse on (default). Off draws Boo still. */
  animated?: boolean
  className?: string
  /** Called as each picture (light and dark) finishes loading — the intro waits for them. */
  onLoad?: () => void
}

export function BooCharacter({ pose, state = 'idle', look = 'full', size, animated = true, className = '', onLoad }: BooCharacterProps) {
  const full = look === 'full'
  const width = size ?? (full ? 176 : 60)
  // Figma: a 176 picture and 16 more below it for the shadow
  const height = full ? (width * 192) / 176 : width
  const shown = pose ?? (state === 'listening' ? 'listening' : 'idle')
  return (
    <span aria-hidden="true" className={`relative inline-block shrink-0 ${animated ? `boo-${state}` : ''} ${className}`} style={{ width, height }}>
      {full && <span className="boo-shadow" />}
      {/* Dark: the same pose with Figma's dark image filters (exposure −0.15, contrast +0.15, highlights −0.2,
          saturation +0.1), so Boo doesn't glow on the dark screen */}
      <img src={pictures[shown][0]} onLoad={onLoad} alt="" draggable={false} className="boo-plush only-light absolute inset-x-0 top-0 aspect-square w-full select-none" />
      <img src={pictures[shown][1]} onLoad={onLoad} alt="" draggable={false} className="boo-plush only-dark absolute inset-x-0 top-0 aspect-square w-full select-none" />
    </span>
  )
}

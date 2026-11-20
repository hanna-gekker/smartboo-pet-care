// Boo — Figma "Boo / Character" (Patterns): the AI assistant, a jelly flower with a face (BooFlower).
// Colours come from the Boo palette (--boo-*) and the ai/* tokens, so dark mode works by itself.
//
// state  idle      — the petals sway left and right while the eye glints look the same way (Figma Rest → Sway left →
//                    Sway right → Rest, about 6 s), and Boo blinks at a random moment every 3–5 s, sometimes twice.
//                    No breathing.
//        listening — a faster pulse while Boo records your voice (Listening 1 ⇄ 2)
// look   full — with the glow and two halos (176 × 192, Welcome, Boo card, Boo sheet)
//        mini — the flower alone (the Boo button in the tab bar)
//
// When the phone asks for less motion, Boo only blinks. Boo is decoration:
// the button around it carries the name for VoiceOver.

import { useEffect, useId, useRef } from 'react'
import { BooFlower } from './BooFlower'

export type BooState = 'idle' | 'listening'

type BooCharacterProps = {
  state?: BooState
  look?: 'full' | 'mini'
  /** Width in px. Defaults to the Figma size: 176 (full) or 60 (mini). */
  size?: number
  /** Sway, blink and pulse on (default). Off draws Boo still. */
  animated?: boolean
  className?: string
}

/** Blinks at a random moment every 3–5 s, sometimes twice in a row. */
function useBlink(ref: React.RefObject<SVGSVGElement | null>, on: boolean) {
  useEffect(() => {
    if (!on) return
    const timers: number[] = []
    const blink = (delay: number) =>
      timers.push(
        window.setTimeout(() => {
          const el = ref.current
          if (!el) return
          el.classList.remove('boo-blink')
          // Restart the animation
          void el.getBoundingClientRect()
          el.classList.add('boo-blink')
        }, delay),
      )
    const loop = () => {
      const wait = 3000 + Math.random() * 2000
      blink(wait)
      if (Math.random() < 0.3) blink(wait + 450)
      timers.push(window.setTimeout(loop, wait + 900))
    }
    loop()
    return () => timers.forEach(clearTimeout)
  }, [ref, on])
}

export function BooCharacter({ state = 'idle', look = 'full', size, animated = true, className = '' }: BooCharacterProps) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const full = look === 'full'
  const width = size ?? (full ? 176 : 60)
  const height = full ? (width * 192) / 176 : width
  const motion = animated ? `boo-${state}` : ''
  useBlink(ref, animated && state === 'idle')

  return (
    <svg ref={ref} width={width} height={height} viewBox={full ? '0 0 176 192' : '0 0 144 144'} overflow="visible" aria-hidden="true" className={`shrink-0 ${motion} ${className}`}>
      {full && (
        <>
          <defs>
            <filter id={`${id}-blur24`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
            <filter id={`${id}-blur6`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {/* Figma order: the luminous glow, then two halos (ai/glow, ai/halo) */}
          <circle className="boo-glow" cx="88" cy="88" r="75" style={{ fill: 'var(--ai-glow)' }} filter={`url(#${id}-blur24)`} />
          <circle cx="88" cy="88" r="88" style={{ fill: 'var(--ai-halo)' }} filter={`url(#${id}-blur6)`} />
          <circle cx="88" cy="88" r="76" style={{ fill: 'var(--ai-halo)' }} filter={`url(#${id}-blur6)`} />
        </>
      )}
      {/* The flower's 144 box, centred on the halo */}
      <g transform={full ? 'translate(16.09 16.09)' : undefined}>
        <BooFlower id={id} />
      </g>
    </svg>
  )
}

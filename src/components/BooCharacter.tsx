// Boo — Figma "Boo / Character" (Patterns): the AI assistant, a flower with a glossy core and two eyes.
// Drawing exported from Figma; every color is an ai/* token, so dark mode works by itself.
//
// state  idle      — slow breathing (Figma Idle 1 ⇄ Idle 2), inviting a tap
//        listening — a faster pulse while Boo records your voice (Listening 1 ⇄ 2)
// look   full — with glow, halo and the float shadow (176 × 192, Welcome, Boo sheet)
//        mini — the flower alone (60, the Boo button in the tab bar)
//
// The animation stops when the phone asks for less motion. Boo is decoration:
// the button around it carries the name for VoiceOver.

import { useId } from 'react'

export type BooState = 'idle' | 'listening'

type BooCharacterProps = {
  state?: BooState
  look?: 'full' | 'mini'
  /** Width in px. Defaults to the Figma size: 176 (full) or 60 (mini). */
  size?: number
  /** Breathing / pulse on (default). Off draws Idle 1 still. */
  animated?: boolean
  className?: string
}

// The drawing in Figma's coordinates: the flower's 128 × 128 box starts at (35, 35).
const PETALS =
  'M99 45.88C105.83 30.86 130.09 37.98 127.72 54.31C141.59 45.37 158.14 64.48 147.32 76.93C163.82 76.91 167.42 101.93 151.58 106.56C165.47 115.46 154.97 138.46 139.15 133.79C146.02 148.79 124.75 162.45 113.97 149.97C111.64 166.3 86.36 166.3 84.03 149.97C73.25 162.45 51.98 148.79 58.85 133.79C43.03 138.46 32.53 115.46 46.42 106.56C30.58 101.93 34.18 76.91 50.68 76.93C39.86 64.48 56.41 45.37 70.28 54.31C67.91 37.98 92.17 30.86 99 45.88Z'

export function BooCharacter({ state = 'idle', look = 'full', size, animated = true, className = '' }: BooCharacterProps) {
  const id = useId().replace(/:/g, '')
  const full = look === 'full'
  const width = size ?? (full ? 176 : 60)
  // full: halo box 176 × 192 (the shadow sits under it); mini: just the flower
  const viewBox = full ? '11 11 176 192' : '35 35 128 128'
  const height = full ? (width * 192) / 176 : width
  const motion = animated ? `boo-${state}` : ''

  return (
    <svg width={width} height={height} viewBox={viewBox} overflow="visible" aria-hidden="true" className={`shrink-0 ${motion} ${className}`}>
      <defs>
        <filter id={`${id}-blur8`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`${id}-blur24`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={`${id}-blur6`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`${id}-blur3`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        {/* Inner light on the core: a soft highlight from the top left */}
        <filter id={`${id}-inner`} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="-4" dy="-6" in="SourceAlpha" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="edge" />
          <feFlood style={{ floodColor: 'var(--ai-highlight)' }} />
          <feComposite in2="edge" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
        <linearGradient id={`${id}-petals`} x1="61.35" y1="50.1" x2="135.94" y2="150.29" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--ai-petal-light)' }} />
          <stop offset="0.6" style={{ stopColor: 'var(--ai-petal)' }} />
          <stop offset="1" style={{ stopColor: 'var(--ai-petal-tint)' }} />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="99" cy="99" r="42" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--ai-core-light)' }} />
          <stop offset="0.7" style={{ stopColor: 'var(--ai-core)' }} />
          <stop offset="1" style={{ stopColor: 'var(--ai-core-edge)' }} />
        </radialGradient>
      </defs>

      {full && (
        <>
          {/* Figma order: glow, two halos (ai/halo, already 60% white in light), then the float shadow on top, so the halo doesn't cut it */}
          <circle className="boo-glow" cx="99" cy="99" r="75" style={{ fill: 'var(--ai-glow)' }} filter={`url(#${id}-blur24)`} />
          <circle cx="99" cy="99" r="88" style={{ fill: 'var(--ai-halo)' }} filter={`url(#${id}-blur6)`} />
          <circle cx="99" cy="99" r="76" style={{ fill: 'var(--ai-halo)' }} filter={`url(#${id}-blur6)`} />
          <ellipse className="boo-shadow" cx="99" cy="195" rx="48" ry="6" style={{ fill: 'var(--ai-float-shadow)' }} filter={`url(#${id}-blur8)`} />
        </>
      )}

      <g className="boo-flower">
        <path d={PETALS} fill={`url(#${id}-petals)`} />
      </g>
      <g className="boo-core">
        <circle cx="99" cy="99" r="42" fill={`url(#${id}-core)`} filter={`url(#${id}-inner)`} />
        <ellipse cx="88.55" cy="76.79" rx="14" ry="7" transform="rotate(-20 88.55 76.79)" style={{ fill: 'var(--ai-highlight)' }} filter={`url(#${id}-blur3)`} />
        <ellipse cx="88" cy="101" rx="6" ry="10" style={{ fill: 'var(--text-on-dark)' }} />
        <ellipse cx="110" cy="101" rx="6" ry="10" style={{ fill: 'var(--text-on-dark)' }} />
      </g>
    </svg>
  )
}

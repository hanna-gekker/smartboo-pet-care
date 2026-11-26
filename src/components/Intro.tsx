// Intro — a short hello when the app starts, right after the iPhone launch screen. It begins exactly like the
// launch screen (surface/canvas, Boo idle at 180 in the centre: scripts/make-splash.cjs), then Boo waves — the idle
// and wave pictures take turns — while the logo fades in under him, and the whole screen fades into the app.
// A tap skips it. With Reduce Motion, Boo just shows the wave pose and the intro fades out.

import { useEffect, useState } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'
import { BooCharacter } from './BooCharacter'
import { Logo } from './Logo'

/** Boo's frames: when each picture starts, in ms. Wave, down, wave, down, wave — and he keeps the paw up. */
const FRAMES: [number, 'idle' | 'wave'][] = [
  [0, 'idle'],
  [250, 'wave'],
  [500, 'idle'],
  [700, 'wave'],
  [900, 'idle'],
  [1100, 'wave'],
]
const FADE_AT = 1700
const DONE_AT = 2000

export function Intro({ onDone }: { onDone: () => void }) {
  const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [pose, setPose] = useState<'idle' | 'wave'>(still ? 'wave' : 'idle')
  const [leaving, setLeaving] = useState(false)

  // Keep the launch screen until both of Boo's pictures are ready, then swap to the intro in the same frame
  const [ready, setReady] = useState(0)
  const go = ready >= 4 // idle and wave, each in light and dark
  useEffect(() => {
    const t = setTimeout(() => setReady(4), 1500) // never wait forever
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!go) return
    // A loaded picture is painted a moment later: wait two frames and a beat, so the launch screen goes away
    // only once Boo is already drawn underneath it
    let t: ReturnType<typeof setTimeout>
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => (t = setTimeout(() => void SplashScreen.hide({ fadeOutDuration: 0 }).catch(() => {}), 120))))
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [go])

  useEffect(() => {
    if (!go) return
    const timers = [
      ...(still ? [] : FRAMES.map(([at, p]) => setTimeout(() => setPose(p), at))),
      setTimeout(() => setLeaving(true), still ? 900 : FADE_AT),
      setTimeout(onDone, still ? 1200 : DONE_AT),
    ]
    return () => timers.forEach(clearTimeout)
  }, [go, still, onDone])

  return (
    <div
      aria-hidden="true"
      onClick={onDone}
      className={`fixed inset-0 z-50 bg-surface-canvas transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Both pictures stay loaded so the swap never flickers; only one is shown */}
      <div className={`intro-boo absolute top-1/2 left-1/2 size-[180px] -translate-x-1/2 -translate-y-1/2 ${leaving && !still ? 'intro-leave' : ''}`}>
        {(['idle', 'wave'] as const).map((p) => (
          <div key={p} className={`absolute inset-0 flex ${pose === p ? '' : 'invisible'}`}>
            <BooCharacter look="mini" pose={p} size={180} animated={false} onLoad={() => setReady((n) => n + 1)} />
          </div>
        ))}
      </div>
      <div className={`${go ? 'animate-intro-logo' : 'opacity-0'} absolute top-[calc(50%_+_106px)] left-1/2 -translate-x-1/2`}>
        <Logo />
      </div>
    </div>
  )
}

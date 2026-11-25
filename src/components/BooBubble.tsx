// Boo bubble — Figma "Welcome & empty states": Boo in a pose with a speech bubble under him.
// The bubble is surface/card with the card shadow, radius 24 and a small tail pointing up at Boo; centred Body text.
// An optional action (one button) sits under the bubble: an empty screen always offers one way forward.

import type { ReactNode } from 'react'
import { BooCharacter, type BooPose } from './BooCharacter'

type BooBubbleProps = {
  children: ReactNode
  pose?: BooPose
  /** One way forward, e.g. Snap a vet paper or Clear search. */
  action?: ReactNode
}

export function BooBubble({ children, pose = 'idle', action }: BooBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-24 py-16">
      <div className="flex w-full flex-col items-center">
        <BooCharacter look="mini" size={96} pose={pose} />
        <div className="relative mt-12 w-full max-w-320 rounded-24 bg-surface-card px-24 py-16 text-center text-body text-text-primary shadow-card">
          {/* The tail: a small turned square under the bubble's top edge, pointing at Boo */}
          <span aria-hidden="true" className="absolute -top-[6px] left-1/2 size-[12px] -translate-x-1/2 rotate-45 rounded-[2px] bg-surface-card" />
          <p className="relative">{children}</p>
        </div>
      </div>
      {action && <div className="w-full">{action}</div>}
    </div>
  )
}

// Boo bubble — Figma "Boo hint" Layout=Centered (Design system, node 377:11903): an empty screen's Boo moment.
// A "stage" card holds Boo and his speech bubble: the Boo card's diagonal gradient (ai/card-mint → blue → lilac →
// pink, .bg-ai-card), a 1px border/ai-card edge inside, radius 24 (Figma draws 28, which has no radius token yet),
// the card shadow, padding 24 on top and 16 below, gap 8. Boo is 121 wide on a soft white glow (a 180 circle of border/panel-edge at 35%, blur 50) with three small
// four-point sparkles (accent/primary-soft 14 and 10, ai/spark-pink 8 at 70%), all decoration. The bubble stays a
// white card with its tail (a rounded triangle that tucks 3 under the card). The action (one button or two) sits under the stage, outside it.
// The Inline layout (Boo hint inside a card, e.g. Today's "shots yet") is BooHint.tsx.

import type { ReactNode } from 'react'
import { BooCharacter, type BooPose } from './BooCharacter'

type BooBubbleProps = {
  children: ReactNode
  pose?: BooPose
  /** One way forward, e.g. Snap a vet paper or Clear search. */
  action?: ReactNode
}

/** A four-point sparkle (decoration). */
function Sparkle({ size, top, x, className }: { size: number; top: number; x: number; className: string }) {
  // Placed like Welcome's sparkles: from the top and from the centre line (Figma positions on the 358 stage)
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} className={`absolute ${className}`} style={{ top, left: `calc(50% + ${x}px)` }}>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
    </svg>
  )
}

export function BooBubble({ children, pose = 'idle', action }: BooBubbleProps) {
  return (
    <div className="flex flex-col gap-16">
      <div className="bg-ai-card shadow-card relative flex flex-col items-center gap-8 overflow-hidden rounded-24 px-16 pt-24 pb-16 ring-1 ring-inset ring-border-ai-card">
        <div className="relative flex w-full justify-center">
          {/* The soft white glow behind Boo */}
          <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-panel-edge opacity-35 blur-[50px]" />
          <Sparkle size={14} top={22} x={-104} className="text-accent-primary-soft" />
          <Sparkle size={10} top={10} x={88} className="text-accent-primary-soft" />
          <Sparkle size={8} top={86} x={104} className="text-ai-spark-pink opacity-70" />
          <BooCharacter look="mini" size={121} pose={pose} className="relative" />
        </div>
        <div className="relative w-full">
          {/* The tail (Figma: 20 × 13, a 20 × 10 triangle with a rounded tip and 3 more below): centred, it reaches
              3 under the bubble, which is drawn on top, so the join has no hairline at any scale */}
          <svg aria-hidden="true" viewBox="0 0 20 13" width="20" height="13" className="absolute -top-[10px] left-1/2 -translate-x-1/2 fill-surface-card">
            <path d="M0 10 L8.3 1.7 C9.2 0.8 10.8 0.8 11.7 1.7 L20 10 L20 13 L0 13 Z" />
          </svg>
          <div className="relative rounded-24 bg-surface-card px-24 py-16 text-center text-body text-text-primary shadow-card">{children}</div>
        </div>
      </div>
      {action && <div className="flex flex-col gap-8">{action}</div>}
    </div>
  )
}

// Boo hint — Figma "Boo hint": a white card where Boo asks for one small thing, with the mini Boo, the question
// and up to two actions under it.

import type { ReactNode } from 'react'
import { BooCharacter } from './BooCharacter'
import { Card } from './Card'

type BooHintProps = {
  children: ReactNode
  /** Buttons under the text. */
  actions?: ReactNode
}

export function BooHint({ children, actions }: BooHintProps) {
  return (
    <Card className="p-24">
      <div className="flex flex-col gap-16">
      <div className="flex items-center gap-16">
        <BooCharacter look="mini" size={44} />
        <p className="min-w-0 flex-1 text-body text-text-primary">{children}</p>
      </div>
      {actions && <div className="flex items-center gap-8">{actions}</div>}
      </div>
    </Card>
  )
}

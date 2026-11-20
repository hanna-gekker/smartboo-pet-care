// Boo hint — Figma "Boo hint": a card where Boo says one small thing, with the mini Boo, the text and up to two actions
// under it. With a `title` (Schedule "Card · Empty day"): a Body Strong line, the text under it in Body S, text/secondary.

import type { ReactNode } from 'react'
import { BooCharacter } from './BooCharacter'
import { Card } from './Card'

type BooHintProps = {
  children: ReactNode
  /** A short first line, e.g. "All good." */
  title?: string
  /** Buttons under the text. */
  actions?: ReactNode
}

export function BooHint({ children, title, actions }: BooHintProps) {
  return (
    <Card className="p-24">
      <div className="flex flex-col gap-16">
      <div className="flex items-center gap-16">
        <BooCharacter look="mini" size={44} />
        {title ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-body font-medium text-text-primary">{title}</p>
            <p className="text-body-s text-text-secondary">{children}</p>
          </div>
        ) : (
          <p className="min-w-0 flex-1 text-body text-text-primary">{children}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-8">{actions}</div>}
      </div>
    </Card>
  )
}

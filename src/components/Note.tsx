// Note — Figma "Note" (Welcome): a 16 icon and a grey caption, centred. Not tappable.

import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export function Note({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-8 text-center text-caption text-text-secondary">
      <Icon name={icon} size={16} className="shrink-0" />
      {children}
    </p>
  )
}

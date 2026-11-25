// Attention card — Figma "Attention card" (Pet folder 12, Vaccines 13): something needs you, on the honey tint
// (status/waiting-bg, card shadow, border/card hairline).
// With an icon: a status chip (a meaning icon), the title, a rose line under it and up to two buttons
//   ("Rabies & DHPP are overdue · Due since Nov 1 · boarding will ask for proof" — Book vet / Mark done).
// Without an icon: a one-line banner with the rose overdue dot ("2 vaccines are overdue. Book a visit with Dr. Lee?").

import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type AttentionCardProps = {
  title: ReactNode
  /** The rose line under the title. */
  detail?: ReactNode
  /** A status chip with this icon; without it the card is a banner with a dot. */
  icon?: IconName
  /** Buttons under the text, e.g. Book vet and Mark done. */
  actions?: ReactNode
  'aria-label'?: string
}

export function AttentionCard({ title, detail, icon, actions, 'aria-label': ariaLabel }: AttentionCardProps) {
  return (
    <section aria-label={ariaLabel} className="flex flex-col gap-16 rounded-24 bg-status-waiting-bg p-16 shadow-card ring-1 ring-inset ring-border-card">
      <div className="flex items-start gap-12">
        {icon ? (
          <span className="chip-status flex size-control-40 shrink-0 items-center justify-center rounded-full text-icon-status-on-chip">
            <Icon name={icon} size={20} />
          </span>
        ) : (
          <span aria-hidden="true" className="mt-8 size-[8px] shrink-0 rounded-full bg-status-waiting-dot" />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className={`text-text-primary ${icon ? 'text-body font-medium' : 'text-body'}`}>{title}</p>
          {detail && <p className="text-body-s text-status-waiting-text">{detail}</p>}
        </div>
      </div>
      {actions && <div className="flex gap-8 [&>*]:flex-1">{actions}</div>}
    </section>
  )
}

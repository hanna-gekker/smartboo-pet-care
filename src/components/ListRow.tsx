// List row — Figma "List row" + "Summary row" (Patterns): a row inside a list card.
// Leading: an icon in a soft circle, a pet photo, or nothing.
// Text: title with an optional subtitle; or, like Summary row, a small label above the title.
// Trailing: a chevron (opens something), an action pill like "Call", or a value on the right.
// The whole row is the tap target: a link (href, e.g. tel:) or a button (onClick). Rows are divided by a 1px line.

import type { ReactNode } from 'react'
import type { Pet } from '../data/types'
import { Icon, type IconName } from './Icon'
import { PetAvatar } from './PetAvatar'

type ListRowProps = {
  title: ReactNode
  subtitle?: ReactNode
  /** Small grey text above the title (Figma Summary row "Label"). */
  label?: string
  /** Text at the right end (Figma "Value"), e.g. a date or "—". */
  value?: ReactNode
  /** Leading icon in a soft circle. */
  icon?: IconName
  /** Leading pet photo (48). */
  pet?: Pet
  /** Leading emoji, e.g. for the share sets. */
  emoji?: string
  /** Trailing: chevron, or an action pill (Summary row Trailing=Action). Never both. */
  trailing?: 'chevron' | { label: string; icon?: IconName }
  href?: string
  onClick?: () => void
}

export function ListRow({ title, subtitle, label, value, icon, pet, emoji, trailing, href, onClick }: ListRowProps) {
  const content = (
    <>
      {icon && (
        <span className="flex size-control-40 shrink-0 items-center justify-center rounded-full bg-accent-primary-subtle text-accent-primary ring-1 ring-inset ring-icon-circle-ring">
          <Icon name={icon} size={20} />
        </span>
      )}
      {pet && <PetAvatar pet={pet} size="md" />}
      {emoji && (
        <span className="flex size-control-40 shrink-0 items-center justify-center text-title" aria-hidden="true">
          {emoji}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-2 text-left">
        {label && <span className="text-caption text-text-secondary">{label}</span>}
        <span className="truncate text-body font-medium text-text-primary">{title}</span>
        {subtitle && <span className="text-body-s text-text-secondary">{subtitle}</span>}
      </span>
      {value !== undefined && <span className="min-w-0 max-w-2/5 truncate text-right text-body-s text-text-secondary">{value}</span>}
      {trailing === 'chevron' && <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary" />}
      {trailing && trailing !== 'chevron' && (
        <span className="flex h-control-32 shrink-0 items-center gap-4 rounded-full bg-accent-primary-subtle px-12 text-body-s font-medium text-accent-primary">
          {trailing.icon && <Icon name={trailing.icon} size={16} />}
          {trailing.label}
        </span>
      )}
    </>
  )
  const cls = 'flex w-full min-h-control-56 items-center gap-16 border-t border-surface-subtle px-24 py-16 first:border-t-0'
  if (href)
    return (
      <a href={href} className={`press ${cls} active:bg-surface-subtle`}>
        {content}
      </a>
    )
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`press ${cls} active:bg-surface-subtle`}>
        {content}
      </button>
    )
  return <div className={cls}>{content}</div>
}

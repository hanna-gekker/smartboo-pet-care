// List row — Figma "List row" + "Summary row" (Patterns): a row inside a list card.
// Leading: an icon in a soft circle, a pet photo, or nothing.
// Text: title with an optional subtitle; or, like Summary row, a small label above the title.
// Trailing: a chevron (opens something), an action pill like "Call", or a value on the right.
// The whole row is the tap target: a link (href, e.g. tel:) or a button (onClick). Rows have no fill and no dividers.
// The leading icon is a category chip (a meaning icon): a diagonal icon/category-chip-* gradient with a white icon
// (iconTone="accent"), or a soft pale circle with an accent outline icon for action rows like Settings ("soft").

import type { ReactNode } from 'react'
import type { Pet } from '../data/types'
import { Icon, type IconName } from './Icon'
import { PetAvatar } from './PetAvatar'
import type { ShowState } from './showState'

type ListRowProps = {
  title: ReactNode
  subtitle?: ReactNode
  /** Small grey text above the title (Figma Summary row "Label"). */
  label?: string
  /** Text at the right end (Figma "Value"), e.g. a date or "—". */
  value?: ReactNode
  /** Leading icon in a circle. */
  icon?: IconName
  /** accent: the filled category chip (default); soft: accent-primary-subtle with an accent-on-subtle icon (Figma 18 Settings). */
  iconTone?: 'accent' | 'soft'
  /** Leading pet photo (48). */
  pet?: Pet
  /** Leading emoji, e.g. for the share sets. */
  emoji?: string
  /** Trailing: chevron, or an action pill (Summary row Trailing=Action). Never both. */
  trailing?: 'chevron' | { label: string; icon?: IconName }
  href?: string
  onClick?: () => void
  'data-state'?: ShowState
}

export function ListRow({ title, subtitle, label, value, icon, iconTone = 'accent', pet, emoji, trailing, href, onClick, 'data-state': state }: ListRowProps) {
  const content = (
    <>
      {icon && (
        <span
          className={`flex size-control-40 shrink-0 items-center justify-center rounded-full ${
            iconTone === 'soft' ? 'bg-accent-primary-subtle text-accent-on-subtle' : 'chip-category text-icon-category-on-chip'
          }`}
        >
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
      {value !== undefined && <span className="min-w-0 max-w-3/5 truncate text-right text-body-s text-text-secondary">{value}</span>}
      {trailing === 'chevron' && <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary" />}
      {trailing && trailing !== 'chevron' && (
        <span className="flex h-control-32 shrink-0 items-center gap-4 rounded-full bg-accent-primary-subtle px-12 text-body font-medium text-accent-on-subtle">
          {trailing.icon && <Icon name={trailing.icon} size={16} />}
          {trailing.label}
        </span>
      )}
    </>
  )
  // Rows sit inside cards that clip their corners, so the focus outline is drawn inside the row
  const cls = 'flex w-full min-h-control-56 items-center gap-16 px-24 py-16 focus-inset'
  if (href)
    return (
      <a href={href} data-state={state} className={`press ${cls} active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle`}>
        {content}
      </a>
    )
  if (onClick)
    return (
      <button type="button" onClick={onClick} data-state={state} className={`press ${cls} active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle`}>
        {content}
      </button>
    )
  return <div className={cls}>{content}</div>
}

// Icon button — Figma "Icon button" (Core components).
// Styles: Primary, Secondary, Soft. Sizes: 40 and 56.
// Plain: the icon alone, no circle (Figma: Settings on Today, with the fill and stroke turned off).
// The 40 circle sits inside a 44×44 tap area, so it is easy to hit with a finger.

import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

export type IconButtonVariant = 'primary' | 'secondary' | 'soft' | 'plain'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
  icon: IconName
  /** What VoiceOver reads, e.g. "Back" or "Talk to Boo". Required: the button has no visible text. */
  label: string
  variant?: IconButtonVariant
  size?: 40 | 56
}

const variants: Record<IconButtonVariant, string> = {
  primary: 'bg-accent-primary text-text-on-accent',
  secondary: 'bg-surface-card text-text-primary ring-1 ring-inset ring-border-control group-active:bg-surface-subtle group-data-[state=pressed]:bg-surface-subtle',
  soft: 'bg-accent-primary-subtle text-accent-primary ring-1 ring-inset ring-icon-circle-ring',
  plain: 'text-text-primary group-active:bg-surface-subtle group-data-[state=pressed]:bg-surface-subtle',
}

export function IconButton({ icon, label, variant = 'secondary', size = 40, type = 'button', className = '', ...rest }: IconButtonProps) {
  const big = size === 56
  return (
    <button
      type={type}
      aria-label={label}
      className={`press group flex shrink-0 items-center justify-center rounded-full disabled:opacity-40 ${big ? 'size-control-56' : 'size-control-44'} ${className}`}
      {...rest}
    >
      <span className={`flex items-center justify-center rounded-full ${big ? 'size-control-56' : 'size-control-40'} ${variants[variant]}`}>
        <Icon name={icon} size={big ? 24 : 20} />
      </span>
    </button>
  )
}

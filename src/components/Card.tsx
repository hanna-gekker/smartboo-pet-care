// Card — Figma "Card" (Core components).
// Types: Plain (padding 16), List (no padding, no outline, rows go edge to edge), Tappable (Plain + pressed state).
// A card becomes Tappable when it gets onClick: then it is a real button.

import type { HTMLAttributes, ReactNode } from 'react'

export type CardVariant = 'plain' | 'list'

type CardProps = Omit<HTMLAttributes<HTMLElement>, 'onClick'> & {
  children: ReactNode
  variant?: CardVariant
  /** Makes the whole card tappable (Figma Type=Tappable). */
  onClick?: () => void
}

const variants: Record<CardVariant, string> = {
  plain: 'p-16',
  list: 'p-0',
}

export function Card({ children, variant = 'plain', onClick, className = '', ...rest }: CardProps) {
  const cls = `block rounded-24 bg-surface-card ${variants[variant]} ${className}`
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`press w-full text-left active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle ${cls}`}
        {...rest}
      >
        {children}
      </button>
    )
  }
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}

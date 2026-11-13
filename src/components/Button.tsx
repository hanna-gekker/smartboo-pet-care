// Button — Figma "Button" (Core components).
// Variants: Primary, Secondary, Ghost. Sizes: Medium (44), Large (56).
// States: pressed (under the finger), focus (keyboard, VoiceOver), disabled, loading.

import { useRef, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'medium' | 'large'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  /** Icon before the label (Figma "Show icon" + "Icon"). */
  icon?: IconName
  /** Stretch to the full width of the parent. */
  full?: boolean
  /** Shows a spinner, and taps do nothing until it is false again. */
  loading?: boolean
  /** If it returns a promise, the button shows loading by itself until the promise ends. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-primary text-text-on-accent',
  // Figma: blue outline and blue icon, black label; the disabled one has a grey outline.
  secondary: 'bg-surface-card text-text-primary ring-1 ring-inset ring-accent-primary disabled:ring-border-control active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle',
  ghost: 'bg-transparent text-text-primary active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle',
}

const sizes: Record<ButtonSize, string> = {
  medium: 'h-control-44 px-24',
  large: 'h-control-56 px-32',
}

export function Button({ children, variant = 'primary', size = 'medium', icon, full, loading, disabled, type = 'button', onClick, className = '', ...rest }: ButtonProps) {
  const [pending, setPending] = useState(false)
  // A ref, not state: two quick taps can arrive before React re-renders.
  const busy = useRef(false)
  const isLoading = Boolean(loading || pending)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (busy.current || isLoading || !onClick) return
    const result = onClick(event)
    if (result instanceof Promise) {
      busy.current = true
      setPending(true)
      try {
        await result
      } finally {
        busy.current = false
        setPending(false)
      }
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={isLoading || undefined}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
      className={`press inline-flex shrink-0 items-center justify-center gap-8 rounded-full text-body font-medium disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {isLoading ? <Spinner /> : icon && <Icon name={icon} size={20} className={variant === 'secondary' && !disabled ? 'text-accent-primary' : undefined} />}
      {children}
    </button>
  )
}

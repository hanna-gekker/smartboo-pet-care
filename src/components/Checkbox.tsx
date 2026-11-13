// Checkbox — Figma "Checkbox" (Core components): a 32 circle, empty or filled with a check.
// The circle sits inside a 44×44 tap area. VoiceOver reads the label, then "checkbox, checked / not checked".

import type { ButtonHTMLAttributes } from 'react'
import { Icon } from './Icon'

type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'onChange'> & {
  checked: boolean
  /** What is being checked, e.g. the task title. Read by VoiceOver. */
  label: string
  onChange: (checked: boolean) => void
  /** Waiting: an overdue task, the empty circle takes the waiting color. */
  tone?: 'default' | 'waiting'
}

export function Checkbox({ checked, label, onChange, tone = 'default', className = '', ...rest }: CheckboxProps) {
  const empty = tone === 'waiting' ? 'bg-surface-card ring-2 ring-inset ring-status-waiting-text' : 'bg-surface-card ring-2 ring-inset ring-border-control'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`press flex size-control-44 shrink-0 items-center justify-center rounded-full disabled:opacity-40 ${className}`}
      {...rest}
    >
      <span className={`flex size-control-32 items-center justify-center rounded-full ${checked ? 'bg-accent-primary text-text-on-accent' : empty}`}>
        {checked && <Icon name="check" size={18} />}
      </span>
    </button>
  )
}

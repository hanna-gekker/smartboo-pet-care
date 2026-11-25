// Switch — the iOS-style on/off toggle (Settings → AI consent). A 51 × 31 track: accent/primary when on;
// surface/subtle with a border/control hairline when off. A 27 thumb on surface/card slides across.
// The whole row is the tap target when a label is given: VoiceOver reads the label, then "switch, on / off".

import type { ReactNode } from 'react'
import type { ShowState } from './showState'

type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** What it turns on. With a label the row is the switch (44+ high); without, give aria-label. */
  label?: ReactNode
  /** Grey text under the label. */
  hint?: ReactNode
  'aria-label'?: string
  disabled?: boolean
  'data-state'?: ShowState
}

export function Switch({ checked, onChange, label, hint, disabled, 'aria-label': ariaLabel, 'data-state': state }: SwitchProps) {
  const track = (
    <span
      aria-hidden="true"
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent-primary' : 'bg-surface-subtle ring-[1.5px] ring-inset ring-border-control'
      }`}
    >
      <span
        className={`shadow-card absolute top-[2px] left-[2px] size-[27px] rounded-full bg-surface-card transition-transform duration-200 motion-reduce:transition-none ${
          checked ? 'translate-x-[20px]' : ''
        }`}
      />
    </span>
  )
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      data-state={state}
      className={`press flex min-h-control-44 items-center gap-12 rounded-16 text-left disabled:opacity-40 ${label ? 'w-full' : ''}`}
    >
      {label && (
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-body font-medium text-text-primary">{label}</span>
          {hint && <span className="text-body-s text-text-secondary">{hint}</span>}
        </span>
      )}
      {track}
    </button>
  )
}

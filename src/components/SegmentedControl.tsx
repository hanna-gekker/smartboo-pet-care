// Segmented control — Figma "Segmented control" (Schedule: Week / Month).
// A white capsule (surface/card, border/card hairline, card shadow); the chosen segment is a nav/active-fill pill
// with a medium nav/active-content label, the others are text/secondary.
// Each segment is a real button inside a radio group, 44 high.

type Option<T extends string> = { value: T; label: string }

type SegmentedControlProps<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  /** What VoiceOver reads for the group, e.g. "View". */
  label: string
  /** /components only: show this state on the first segment that isn't chosen. */
  'data-state'?: 'pressed' | 'focus'
}

export function SegmentedControl<T extends string>({ options, value, onChange, label, 'data-state': state }: SegmentedControlProps<T>) {
  const target = options.find((o) => o.value !== value)?.value
  return (
    <div role="radiogroup" aria-label={label} className="shadow-card flex h-[46px] gap-4 rounded-full bg-surface-card p-4 ring-1 ring-inset ring-border-card">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            data-state={o.value === target ? state : undefined}
            className={`press focus-inside flex-1 rounded-full px-16 text-body-s ${on ? 'bg-nav-active-fill font-medium text-nav-active-content' : 'text-text-secondary active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

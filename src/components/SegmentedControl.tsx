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
  /** accent (Schedule: Week / Month) — the chosen segment is the nav/active-fill pill; quiet (Settings → Appearance)
   *  — a surface/subtle track with the chosen segment as a white surface/card thumb with the card shadow. */
  tone?: 'accent' | 'quiet'
  /** /components only: show this state on the first segment that isn't chosen. */
  'data-state'?: 'pressed' | 'focus'
}

export function SegmentedControl<T extends string>({ options, value, onChange, label, tone = 'accent', 'data-state': state }: SegmentedControlProps<T>) {
  const quiet = tone === 'quiet'
  const target = options.find((o) => o.value !== value)?.value
  return (
    <div role="radiogroup" aria-label={label} className={`flex h-[46px] gap-4 rounded-full p-4 ring-1 ring-inset ring-border-card ${quiet ? 'bg-surface-subtle' : 'shadow-card bg-surface-card'}`}>
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
            className={`press focus-inside flex-1 rounded-full px-16 text-body-s ${on ? (quiet ? 'shadow-card bg-surface-card font-medium text-text-primary' : 'bg-nav-active-fill font-medium text-nav-active-content') : 'text-text-secondary active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

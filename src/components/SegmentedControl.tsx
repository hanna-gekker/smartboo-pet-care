// Segmented control — Figma "Segmented control" (Schedule: Week / Month).
// A grey capsule; the chosen segment is a white capsule with a medium label.
// Each segment is a real button inside a radio group, 44 high.

type Option<T extends string> = { value: T; label: string }

type SegmentedControlProps<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  /** What VoiceOver reads for the group, e.g. "View". */
  label: string
}

export function SegmentedControl<T extends string>({ options, value, onChange, label }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-control-44 gap-4 rounded-full bg-surface-subtle p-4">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`press flex-1 rounded-full px-16 text-body-s ${on ? 'bg-surface-card font-medium text-text-primary' : 'text-text-secondary'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

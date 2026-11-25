// Picker row — a List row whose value opens the iPhone's own picker (Settings → Reminders:
// "Vaccines & rechecks · 2 weeks before", "Daily tasks · 8:00 AM").
// The row is drawn as a List row with a chevron; an invisible native select covers it, so a tap opens the
// system wheel and VoiceOver reads it as a field ("Daily tasks, 8:00 AM, pop-up button").

import type { IconName } from './Icon'
import { ListRow } from './ListRow'
import type { ShowState } from './showState'

type PickerRowProps<T extends string> = {
  title: string
  icon?: IconName
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** What the row shows under the title. Defaults to the chosen option's label. */
  subtitle?: string
  'data-state'?: ShowState
}

export function PickerRow<T extends string>({ title, icon, options, value, onChange, subtitle, 'data-state': state }: PickerRowProps<T>) {
  const chosen = options.find((o) => o.value === value)?.label
  return (
    <div className={`relative has-[select:active]:bg-surface-subtle ${state === 'pressed' ? 'bg-surface-subtle' : ''}`}>
      <ListRow icon={icon} iconTone="soft" title={title} subtitle={subtitle ?? chosen} trailing="chevron" />
      <select
        aria-label={title}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        // iOS treats a tapped select as keyboard-focused; the outline is for the keyboard and Switch Control only
        onPointerDown={(e) => (e.currentTarget.dataset.touched = '')}
        onKeyDown={(e) => delete e.currentTarget.dataset.touched}
        onBlur={(e) => delete e.currentTarget.dataset.touched}
        data-state={state === 'focus' ? 'focus' : undefined}
        className="picker-select focus-inset absolute inset-0 w-full cursor-pointer appearance-none bg-transparent text-transparent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

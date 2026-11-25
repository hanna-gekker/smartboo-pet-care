// Ask Boo input — Figma "Ask Boo input" (Patterns).
// A pill field with a 1px border/card edge: the placeholder takes the free width, the camera (Soft 40) sits inside;
// the mic is its own Primary 56 button outside on the right, 8 away.
// The field's surface follows what it sits on: `card` (white, on the Boo card) or `canvas` (grey, on a white card).
// The placeholder area opens Boo for typing; the buttons open the camera or voice.
// Typing in place (Welcome, Figma 6i): with `value` the field is a real text input; once it has text, the mic becomes
// a Send arrow (arrow-up, Primary 56) and Return sends too.
// Focus on the placeholder area shows as the field's own 2px accent/primary border (Figma "States"), not a ring around the text.

import { IconButton } from './IconButton'
import type { ShowState } from './showState'

type AskBooInputProps = {
  placeholder: string
  /** Opens Boo for typing. Not used when the field types in place (`value`). */
  onType?: () => void
  /** Typing in place: the text, how it changes, and what Send does. */
  value?: string
  onChange?: (value: string) => void
  onSend?: (value: string) => void
  onSnap: () => void
  onTalk: () => void
  /** The field's fill: `card` on the Boo card (Today), `canvas` on a white card (Welcome). */
  surface?: 'card' | 'canvas'
  /** All three parts at 40%, taps do nothing. */
  disabled?: boolean
  /** /components only: focus on the field, or the mic pressed. */
  'data-state'?: ShowState
}

export function AskBooInput({ placeholder, onType, value, onChange, onSend, onSnap, onTalk, surface = 'card', disabled, 'data-state': state }: AskBooInputProps) {
  const inPlace = value !== undefined
  const canSend = inPlace && value.trim() !== ''
  return (
    // Disabled: the whole input at 40% and inert (no taps, no focus), so the parts don't fade twice
    <div inert={disabled} className={`flex items-center gap-8 ${disabled ? 'opacity-40' : ''}`}>
      <div className={`flex h-control-56 min-w-0 flex-1 items-center gap-8 field-box rounded-full p-8 ${state === 'focus' ? 'field-box-focus' : ''} ring-1 ring-inset ring-border-card ${surface === 'canvas' ? 'bg-surface-canvas' : 'bg-surface-card'}`}>
        {inPlace ? (
          <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSend) onSend?.(value)
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            enterKeyHint="send"
            className="field-focus -my-2 min-h-control-44 min-w-0 flex-1 bg-transparent pr-8 pl-16 text-body text-text-primary outline-none placeholder:text-text-secondary"
          />
        ) : (
          <button type="button" onClick={onType} className="press field-focus -my-2 min-h-control-44 min-w-0 flex-1 truncate rounded-full pr-8 pl-16 text-left text-body text-text-secondary">
            {placeholder}
          </button>
        )}
        <IconButton variant="soft" icon="camera" label="Snap a vet paper" onClick={onSnap} className="-m-2" />
      </div>
      {canSend ? (
        <IconButton variant="primary" size={56} icon="arrow-up" label="Send" onClick={() => onSend?.(value)} />
      ) : (
        <IconButton variant="primary" size={56} icon="mic" label="Talk to Boo" data-state={state === 'pressed' ? 'pressed' : undefined} onClick={onTalk} />
      )}
    </div>
  )
}

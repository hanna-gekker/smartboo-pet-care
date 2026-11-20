// Ask Boo input — Figma "Ask Boo input" (Patterns).
// Row (Today, Boo card): a white pill field with the placeholder and the camera (Soft 40), then the mic as its own Primary 56 button.
// Field (Welcome): one pill on surface/canvas with a border/card hairline; the camera (white, border/card) and the mic
// (accent/primary) are the same size, 40, inside it.
// The placeholder area opens Boo for typing; the buttons open voice or the camera.

import { Icon } from './Icon'
import { IconButton } from './IconButton'

type AskBooInputProps = {
  placeholder: string
  onType: () => void
  onSnap: () => void
  onTalk: () => void
  variant?: 'row' | 'field'
}

export function AskBooInput({ placeholder, onType, onSnap, onTalk, variant = 'row' }: AskBooInputProps) {
  const text = (
    <button type="button" onClick={onType} className="press min-h-control-44 min-w-0 flex-1 truncate text-left text-body text-text-secondary">
      {placeholder}
    </button>
  )
  if (variant === 'field') {
    return (
      <div className="flex h-control-56 items-center gap-4 rounded-full bg-surface-canvas pr-4 pl-24 ring-1 ring-inset ring-border-card">
        {text}
        <button type="button" aria-label="Snap a vet paper" onClick={onSnap} className="press flex size-control-44 shrink-0 items-center justify-center rounded-full">
          <span className="flex size-control-40 items-center justify-center rounded-full bg-surface-card text-accent-primary ring-1 ring-inset ring-border-card">
            <Icon name="camera" size={20} />
          </span>
        </button>
        <IconButton variant="primary" icon="mic" label="Talk to Boo" onClick={onTalk} />
      </div>
    )
  }
  return (
    <div className="flex items-center gap-8">
      <div className="flex h-control-56 min-w-0 flex-1 items-center gap-4 rounded-full bg-surface-card pr-4 pl-24">
        {text}
        <IconButton variant="soft" icon="camera" label="Snap a vet paper" onClick={onSnap} />
      </div>
      <IconButton variant="primary" size={56} icon="mic" label="Talk to Boo" onClick={onTalk} />
    </div>
  )
}

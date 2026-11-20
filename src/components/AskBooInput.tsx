// Ask Boo input — Figma "Ask Boo input" (Patterns).
// A pill field with a 1px border/card edge: the placeholder takes the free width, the camera (Soft 40) sits inside;
// the mic is its own Primary 56 button outside on the right, 8 away.
// The field's surface follows what it sits on: `card` (white, on the Boo card) or `canvas` (grey, on a white card).
// The placeholder area opens Boo for typing; the buttons open the camera or voice.

import { IconButton } from './IconButton'

type AskBooInputProps = {
  placeholder: string
  onType: () => void
  onSnap: () => void
  onTalk: () => void
  /** The field's fill: `card` on the Boo card (Today), `canvas` on a white card (Welcome). */
  surface?: 'card' | 'canvas'
}

export function AskBooInput({ placeholder, onType, onSnap, onTalk, surface = 'card' }: AskBooInputProps) {
  return (
    <div className="flex items-center gap-8">
      <div className={`flex h-control-56 min-w-0 flex-1 items-center gap-8 rounded-full p-8 pl-24 ring-1 ring-inset ring-border-card ${surface === 'canvas' ? 'bg-surface-canvas' : 'bg-surface-card'}`}>
        <button type="button" onClick={onType} className="press -my-2 min-h-control-44 min-w-0 flex-1 truncate text-left text-body text-text-secondary">
          {placeholder}
        </button>
        <IconButton variant="soft" icon="camera" label="Snap a vet paper" onClick={onSnap} className="-m-2" />
      </div>
      <IconButton variant="primary" size={56} icon="mic" label="Talk to Boo" onClick={onTalk} />
    </div>
  )
}

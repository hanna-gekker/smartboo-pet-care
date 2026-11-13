// Ask Boo input — Figma "Ask Boo input" (Patterns): a white pill with a placeholder, the camera (Soft) and the mic (Primary).
// The placeholder area opens Boo for typing; the buttons open voice or the camera.

import { IconButton } from './IconButton'

type AskBooInputProps = {
  placeholder: string
  onType: () => void
  onSnap: () => void
  onTalk: () => void
}

export function AskBooInput({ placeholder, onType, onSnap, onTalk }: AskBooInputProps) {
  return (
    <div className="flex h-control-56 items-center gap-4 rounded-full bg-surface-card pr-4 pl-24">
      <button type="button" onClick={onType} className="press min-h-control-44 min-w-0 flex-1 truncate text-left text-body text-text-secondary">
        {placeholder}
      </button>
      <IconButton variant="soft" icon="camera" label="Snap a vet paper" onClick={onSnap} />
      <IconButton variant="primary" icon="mic" label="Talk to Boo" onClick={onTalk} />
    </div>
  )
}

// Tap hint — Figma "Tap hint" (Welcome): a small blue mic and a grey caption under Boo.
// It is a real button (44 tall) that opens Boo for voice, like tapping Boo itself.

import { Icon } from './Icon'

export function TapHint({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press -my-12 inline-flex min-h-control-44 items-center gap-[6px] rounded-full pr-[14px] pl-12">
      <Icon name="mic" size={16} className="shrink-0 text-accent-primary" />
      <span className="text-caption font-medium text-text-secondary">{label}</span>
    </button>
  )
}

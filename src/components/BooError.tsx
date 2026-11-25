// Boo error — Figma "Boo" 8e–8i: what you gave Boo on the right (a paper thumbnail, "…" for voice, or the typed words)
// in a surface/subtle bubble; under it the mini Boo (40) and what Boo says (SB/Body L); then two Large buttons side by
// side, Primary and Secondary. The second one is always a way without the AI. Texts come in as props.

import { BooCharacter } from './BooCharacter'
import { Button } from './Button'

type Action = { label: string; onClick: () => void }

type BooErrorProps = {
  /** What you gave Boo: a paper, your voice, or typed words. */
  input: 'paper' | 'voice' | { text: string }
  /** What Boo says. */
  message: string
  primary: Action
  secondary: Action
}

export function BooError({ input, message, primary, secondary }: BooErrorProps) {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-16 bg-surface-subtle p-8">
          {input === 'paper' ? (
            <div role="img" aria-label="Your paper" className="flex h-[56px] w-[44px] flex-col gap-4 rounded-8 bg-surface-card px-8 pt-8 ring-1 ring-inset ring-border-card">
              {[30, 24, 30, 18, 27].map((w, i) => (
                <span key={i} className="h-[3px] rounded-full bg-border-control" style={{ width: (w / 30) * 100 + '%' }} />
              ))}
            </div>
          ) : (
            <p className="px-8 py-4 text-body text-text-primary">{input === 'voice' ? <span aria-label="What you said">…</span> : input.text}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-12">
        <BooCharacter look="mini" size={40} pose="oops" />
        <p role="status" className="min-w-0 flex-1 text-body-l text-text-primary">
          {message}
        </p>
      </div>
      <div className="flex gap-8">
        <Button size="large" onClick={primary.onClick} className="flex-1 !px-16">
          {primary.label}
        </Button>
        <Button size="large" variant="secondary" onClick={secondary.onClick} className="flex-1 !px-16">
          {secondary.label}
        </Button>
      </div>
    </div>
  )
}

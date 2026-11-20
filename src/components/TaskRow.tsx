// Task row — Figma "Task row" (Patterns): a checkbox, the pet photo, what to do and a grey line with pet and time.
// States: default, done (checked and crossed out in place, grey; the photo stays as is) and waiting
// (overdue: the line and the circle take the waiting color).
// Rows sit in a list card with no fill and no dividers of their own. Data comes in as props; see src/lib/tasks.ts.
// The whole row is one checkbox (Figma "States"): a tap anywhere checks it; pressed = surface/subtle, focus = the ring
// inside the row (focus-inset). No shrink on press: the row fills the card edge to edge.

import type { Pet } from '../data/types'
import type { TaskState } from '../lib/tasks'
import { Checkbox } from './Checkbox'
import { PetAvatar } from './PetAvatar'
import type { ShowState } from './showState'

type TaskRowProps = {
  title: string
  /** Extra after the title, e.g. the dose "4 drops". */
  detail?: string
  /** The grey line: "Rocky · 8 AM". */
  meta: string
  state: TaskState
  /** Whose task it is: the photo, or the first letter. */
  pet?: Pet
  /** Tap on the row: done ⇄ not done. */
  onToggle: () => void
  /** No side padding, for a row inside a card that already has it (Next up). */
  flush?: boolean
  'data-state'?: ShowState
}

export function TaskRow({ title, detail, meta, state, pet, onToggle, flush, 'data-state': show }: TaskRowProps) {
  const done = state === 'done'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={[title, detail, meta].filter(Boolean).join(', ')}
      onClick={onToggle}
      data-state={show}
      className={`focus-inset flex w-full items-center gap-12 py-16 text-left active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle ${flush ? 'px-0' : 'px-16'}`}
    >
      {/* The 24 circle sits where the old 44 tap area put it: 18 from the row edge, 12 + 2 before the photo */}
      <span className="mx-2">
        <Checkbox checked={done} tone={state === 'waiting' ? 'waiting' : 'default'} />
      </span>
      <PetAvatar pet={pet} size="sm" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-body font-medium ${done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
          {title}
          {detail && <span className={`font-regular text-text-secondary`}> · {detail}</span>}
        </p>
        <p
          className={`mt-2 truncate text-body-s ${
            done ? 'text-text-secondary' : state === 'waiting' ? 'font-medium text-status-waiting-text' : 'text-text-secondary'
          }`}
        >
          {meta}
        </p>
      </div>
    </button>
  )
}

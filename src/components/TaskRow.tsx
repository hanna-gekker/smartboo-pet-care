// Task row — Figma "Task row" (Patterns): a checkbox, the pet photo, what to do and a grey line with pet and time.
// States: default, done (checked and crossed out in place, grey; the photo stays as is) and waiting
// (overdue: the line and the circle take the waiting color).
// Rows sit in a list card with no fill and no dividers of their own. Data comes in as props; see src/lib/tasks.ts.

import type { Pet } from '../data/types'
import type { TaskState } from '../lib/tasks'
import { Checkbox } from './Checkbox'
import { PetAvatar } from './PetAvatar'

type TaskRowProps = {
  title: string
  /** Extra after the title, e.g. the dose "4 drops". */
  detail?: string
  /** The grey line: "Rocky · 8 AM". */
  meta: string
  state: TaskState
  /** Whose task it is: the photo, or the first letter. */
  pet?: Pet
  /** Tap on the circle: done ⇄ not done. */
  onToggle: () => void
  /** No side padding, for a row inside a card that already has it (Next up). */
  flush?: boolean
}

export function TaskRow({ title, detail, meta, state, pet, onToggle, flush }: TaskRowProps) {
  const done = state === 'done'
  return (
    <div className={`flex items-center gap-12 py-16 ${flush ? 'px-0' : 'px-16'}`}>
      {/* The circle's 44 tap area overlaps the row padding, so the 24 circle lines up 20 from the card edge */}
      <Checkbox checked={done} label={title} tone={state === 'waiting' ? 'waiting' : 'default'} onChange={onToggle} className="-mx-8" />
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
    </div>
  )
}

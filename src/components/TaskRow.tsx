// Task row — Figma "Task row" (Patterns): pet photo, what to do, a grey line with pet and time, a checkbox.
// States: default, done (crossed out, grey) and waiting (overdue: the line and the circle take the waiting color).
// Rows sit in a list card, divided by a 1px surface/subtle line. Data comes in as props; see src/lib/tasks.ts.

import type { Pet } from '../data/types'
import type { TaskState } from '../lib/tasks'
import { Checkbox } from './Checkbox'
import { PetAvatar } from './ui'

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
    <div className={`flex items-center gap-16 border-t border-surface-subtle py-16 first:border-t-0 ${flush ? 'px-0' : 'px-24'}`}>
      <PetAvatar pet={pet} size={40} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-body font-medium ${done ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
          {title}
          {detail && <span className={`font-regular ${done ? 'text-text-tertiary' : 'text-text-secondary'}`}> · {detail}</span>}
        </p>
        <p
          className={`mt-2 truncate text-body-s ${
            done ? 'text-text-tertiary' : state === 'waiting' ? 'font-medium text-status-waiting-text' : 'text-text-secondary'
          }`}
        >
          {meta}
        </p>
      </div>
      <Checkbox checked={done} label={title} tone={state === 'waiting' ? 'waiting' : 'default'} onChange={onToggle} className="-mr-4" />
    </div>
  )
}

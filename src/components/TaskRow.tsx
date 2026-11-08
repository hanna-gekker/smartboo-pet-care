import type { Pet, Task } from '../data/types'
import { formatDay, formatTime, today } from '../lib/dates'
import { Icon } from './Icon'
import { PetAvatar } from './ui'

/** One task: pet avatar, what (with dose), pet name and time. Tap the circle to cross it out. */
export function TaskRow({ task, pet, onToggle, showDate }: { task: Task; pet?: Pet; onToggle: () => void; showDate?: boolean }) {
  const done = Boolean(task.doneAt)
  const now = new Date()
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const overdue = !done && (task.date < today() || (task.date === today() && task.time !== undefined && task.time < nowTime))

  let when = showDate ? formatDay(task.date, { weekday: 'short', month: 'short', day: 'numeric' }) : ''
  if (task.time) when = [when, formatTime(task.time)].filter(Boolean).join(' · ')
  if (overdue) {
    when = task.date === today() ? `waiting since ${formatTime(task.time)}` : `overdue since ${formatDay(task.date)}`
  }

  return (
    <div className="flex items-center gap-12 py-8">
      <PetAvatar pet={pet} size={40} />
      <div className={`min-w-0 flex-1 ${done ? 'opacity-50' : ''}`}>
        <p className={`truncate text-body font-medium ${done ? 'line-through' : ''}`}>
          {task.title}
          {task.detail && <span className="font-regular text-text-secondary"> · {task.detail}</span>}
        </p>
        <p className={`truncate text-body-s ${overdue ? 'font-medium text-status-waiting-text' : 'text-text-secondary'}`}>
          {pet?.name}
          {when && ` · ${when}`}
        </p>
      </div>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `Undo: ${task.title}` : `Mark done: ${task.title}`}
        onClick={onToggle}
        className="press -mr-4 flex size-control-44 shrink-0 items-center justify-center"
      >
        <span className={`flex size-[28px] items-center justify-center rounded-full ${done ? 'bg-accent-primary text-text-on-accent' : overdue ? 'ring-2 ring-status-waiting-text' : 'ring-2 ring-border-control'}`}>
          {done && <Icon name="check" size={16} />}
        </span>
      </button>
    </div>
  )
}

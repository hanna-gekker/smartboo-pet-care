// Status pill — Figma "Status pill" (Core components): a white pill with a colored dot and a short label.
// Waiting (overdue or late today) · Upcoming · Done.

export type PillStatus = 'waiting' | 'upcoming' | 'done'

const dots: Record<PillStatus, string> = {
  waiting: 'bg-status-waiting-dot',
  upcoming: 'bg-accent-primary',
  done: 'bg-text-primary',
}

export function StatusPill({ status, label }: { status: PillStatus; label: string }) {
  return (
    <span className="inline-flex items-center gap-4 self-start rounded-full bg-surface-card px-12 py-8 text-caption text-text-primary">
      <span className={`size-8 shrink-0 rounded-full ${dots[status]}`} aria-hidden="true" />
      {label}
    </span>
  )
}

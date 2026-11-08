import { NavLink } from 'react-router'
import { useUi } from '../data/useUi'
import { Icon, type IconName } from './Icon'

const tabs: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Today', icon: 'today' },
  { to: '/schedule', label: 'Schedule', icon: 'schedule' },
  { to: '/pets', label: 'Pets', icon: 'pets' },
]

/** Floating black capsule with Today · Schedule · Pets, plus the round Boo button to the right. */
export function TabBar() {
  const openBoo = useUi((s) => s.openBoo)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-16 pb-[max(env(safe-area-inset-bottom),var(--space-16))]">
      <div className="pointer-events-auto flex w-full max-w-[420px] items-center gap-12">
        <nav aria-label="Main" className="flex h-control-64 flex-1 items-center justify-around rounded-full bg-surface-nav px-8 text-text-on-dark shadow-[0_12px_30px_-10px_var(--surface-scrim)]">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `press flex min-h-[48px] min-w-control-64 flex-col items-center justify-center gap-2 rounded-full text-caption font-medium ${isActive ? 'opacity-100' : 'opacity-55'}`
              }
            >
              <Icon name={t.icon} size={22} />
              {t.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open Boo"
          onClick={() => openBoo()}
          className="press flex size-control-64 shrink-0 items-center justify-center rounded-full bg-accent-primary text-text-on-accent shadow-[0_12px_30px_-10px_var(--accent-primary)]"
        >
          <BooFace />
        </button>
      </div>
    </div>
  )
}

/** Boo's little ghost face */
export function BooFace({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4c-5.5 0-9.5 4.2-9.5 9.6V26l3.2-2.2 3.1 2.2L16 23.8l3.2 2.2 3.1-2.2 3.2 2.2V13.6C25.5 8.2 21.5 4 16 4z" fill="currentColor" />
      <circle cx="12.6" cy="14" r="1.7" fill="var(--accent-primary)" />
      <circle cx="19.4" cy="14" r="1.7" fill="var(--accent-primary)" />
    </svg>
  )
}

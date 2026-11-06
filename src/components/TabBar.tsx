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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
      <div className="pointer-events-auto flex w-full max-w-[420px] items-center gap-3">
        <nav aria-label="Main" className="flex h-16 flex-1 items-center justify-around rounded-full bg-bar px-2 text-on-bar shadow-[0_12px_30px_-10px_var(--scrim)]">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `press flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium ${isActive ? 'opacity-100' : 'opacity-55'}`
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
          className="press flex size-16 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_12px_30px_-10px_var(--accent)]"
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
      <circle cx="12.6" cy="14" r="1.7" fill="var(--accent)" />
      <circle cx="19.4" cy="14" r="1.7" fill="var(--accent)" />
    </svg>
  )
}

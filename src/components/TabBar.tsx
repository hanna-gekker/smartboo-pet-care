// Tab bar — Figma "Tab bar" + "Tab item" (Patterns).
// A dark capsule with Today · Schedule · Pets, and the round Boo button to its right.
// The active tab is a light pill (nav/active-*), marked for VoiceOver with aria-current="page".

import { Link } from 'react-router'
import { BooCharacter } from './BooCharacter'
import { Icon, type IconName } from './Icon'

export type Tab = 'today' | 'schedule' | 'pets'

const tabs: { key: Tab; to: string; label: string; icon: IconName }[] = [
  { key: 'today', to: '/', label: 'Today', icon: 'today' },
  { key: 'schedule', to: '/schedule', label: 'Schedule', icon: 'schedule' },
  { key: 'pets', to: '/pets', label: 'Pets', icon: 'pets' },
]

type TabBarProps = {
  /** Which tab is open. None on screens like Settings. */
  active?: Tab
  /** What the Boo button does. */
  onBoo: () => void
  /** Pinned to the bottom of the screen (the app). Off on /components, where it sits in the page. */
  docked?: boolean
}

export function TabBar({ active, onBoo, docked = true }: TabBarProps) {
  const bar = (
    <div className="pointer-events-auto flex w-full max-w-[420px] items-center gap-12">
      <nav aria-label="Main" className="flex h-control-64 flex-1 items-center rounded-full bg-surface-nav p-4">
        {tabs.map((t) => {
          const on = t.key === active
          return (
            <Link
              key={t.key}
              to={t.to}
              aria-current={on ? 'page' : undefined}
              className={`press flex h-control-56 flex-1 flex-col items-center justify-center gap-2 rounded-full text-caption ${
                on ? 'bg-surface-card font-medium text-nav-active-label ring-1 ring-inset ring-nav-active-ring' : 'text-text-on-dark-muted'
              }`}
            >
              <Icon name={t.icon} size={24} />
              {t.label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        aria-label="Open Boo"
        onClick={onBoo}
        className="press flex size-control-64 shrink-0 items-center justify-center rounded-full"
      >
        <BooCharacter look="mini" animated={false} />
      </button>
    </div>
  )

  if (!docked) return bar
  return <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-16 pb-safe-16">{bar}</div>
}

/** Boo's old ghost face. Screens still use it; P10 moves them to BooCharacter. */
export function BooFace({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4c-5.5 0-9.5 4.2-9.5 9.6V26l3.2-2.2 3.1 2.2L16 23.8l3.2 2.2 3.1-2.2 3.2 2.2V13.6C25.5 8.2 21.5 4 16 4z" fill="currentColor" />
      <circle cx="12.6" cy="14" r="1.7" fill="var(--accent-primary)" />
      <circle cx="19.4" cy="14" r="1.7" fill="var(--accent-primary)" />
    </svg>
  )
}

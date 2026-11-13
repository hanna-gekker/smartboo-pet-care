// Tab bar — Figma "Tab bar" + "Tab item" (Patterns).
// A dark capsule with Today · Schedule · Pets, and the round Boo button to its right.
// The active tab is a light pill (nav/active-*), marked for VoiceOver with aria-current="page".

import { Link } from 'react-router'
import { BooCharacter } from './BooCharacter'
import { Icon, type IconName } from './Icon'

export type Tab = 'today' | 'schedule' | 'pets'

const tabs: { key: Tab; to: string; label: string; icon: IconName }[] = [
  { key: 'today', to: '/', label: 'Today', icon: 'sun' },
  { key: 'schedule', to: '/schedule', label: 'Schedule', icon: 'calendar' },
  { key: 'pets', to: '/pets', label: 'Pets', icon: 'paw' },
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
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-16 pb-safe-16">
      {/* Figma "Bottom fade": content scrolling under the bar fades into the page background (120 high, solid from the middle). */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[120px] bg-linear-to-b from-surface-canvas-clear via-surface-canvas via-50% to-surface-canvas" />
      <div className="relative flex w-full justify-center">{bar}</div>
    </div>
  )
}

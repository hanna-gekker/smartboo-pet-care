// Tab bar — Figma "Tab bar" + "Tab item" (Patterns).
// A capsule (surface/card, border/card hairline, 24 background blur, soft shadow) with Today · Schedule · Pets, and Boo to its right.
// Capsule 62 high with 4 inside, tabs 54 high; the bar is 348 wide on a 390 phone (21 on each side).
// The selected tab is a nav/active-fill pill with the filled icon, marked for VoiceOver with aria-current="page".
// A coral dot on Schedule when something is overdue. Content scrolls under the bar; no fade behind it.

import { Link } from 'react-router'
import { BooCharacter } from './BooCharacter'
import { Icon, type IconName } from './Icon'

export type Tab = 'today' | 'schedule' | 'pets'

const tabs: { key: Tab; to: string; label: string; icon: IconName; iconOn: IconName }[] = [
  { key: 'today', to: '/', label: 'Today', icon: 'sun', iconOn: 'sun-fill' },
  { key: 'schedule', to: '/schedule', label: 'Schedule', icon: 'calendar', iconOn: 'calendar-fill' },
  { key: 'pets', to: '/pets', label: 'Pets', icon: 'paw', iconOn: 'paw-fill' },
]

type TabBarProps = {
  /** Which tab is open. None on screens like Settings. */
  active?: Tab
  /** Something is overdue: a dot on Schedule. */
  overdue?: boolean
  /** What the Boo button does. */
  onBoo: () => void
  /** Pinned to the bottom of the screen (the app). Off on /components, where it sits in the page. */
  docked?: boolean
  /** /components only: show this state on the first tab that isn't open. */
  'data-state'?: 'pressed' | 'focus'
}

export function TabBar({ active, overdue = false, onBoo, docked = true, 'data-state': state }: TabBarProps) {
  const target = tabs.find((t) => t.key !== active)?.key
  const bar = (
    <div className="pointer-events-auto flex w-full max-w-420 items-center gap-8">
      <nav aria-label="Main" className="glass-bar flex h-[62px] flex-1 items-center rounded-full p-4 ring-1 ring-inset ring-border-card">
        {tabs.map((t) => {
          const on = t.key === active
          const dot = overdue && t.key === 'schedule'
          return (
            <Link
              key={t.key}
              to={t.to}
              aria-current={on ? 'page' : undefined}
              data-state={t.key === target ? state : undefined}
              aria-label={dot ? `${t.label}, overdue` : undefined}
              className={`press focus-inside relative flex h-[54px] flex-1 flex-col items-center justify-center gap-2 rounded-full text-tab-label font-medium ${
                on ? 'bg-nav-active-fill text-nav-active-content' : 'text-text-secondary active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle'
              }`}
            >
              <Icon name={on ? t.iconOn : t.icon} size={20} className={on ? 'text-nav-active-icon' : ''} />
              {t.label}
              {/* Due dot: 8px, on the icon's top-right corner, with a 2px ring outside (nav/dot-ring*) */}
              {dot && (
                <span
                  aria-hidden="true"
                  className={`absolute top-8 left-[calc(50%+3px)] size-8 rounded-full bg-status-waiting-dot ring-2 ${on ? 'ring-nav-dot-ring-active' : 'ring-nav-dot-ring'}`}
                />
              )}
            </Link>
          )
        })}
      </nav>
      {/* Boo: just the mini flower at the bar's height, breathing instead of a glow */}
      <button type="button" aria-label="Open Boo" onClick={onBoo} className="press flex size-[62px] shrink-0 items-center justify-center rounded-full">
        <BooCharacter look="mini" size={62} />
      </button>
    </div>
  )

  if (!docked) return bar
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-[21px] pb-safe-16">
      {/* Bottom scroll edge: content that scrolls below the capsule blurs and fades into the background */}
      <span aria-hidden="true" className="tab-bar-edge" />
      {bar}
    </div>
  )
}

// Small layout pieces shared by the screens. No data loading inside — only props.
// The base components live in their own files: Button, IconButton, Card, TextField, ListRow, PetAvatar…

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { IconButton } from './IconButton'

/** Figma "Section header": a title with an optional action link on the right. */
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-24 mb-12 flex min-h-control-44 items-center justify-between">
      <h2 className="font-display text-body-l font-medium">{children}</h2>
      {action}
    </div>
  )
}

/** The action link in a section header, e.g. "See schedule". */
export function TextLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press -mr-8 min-h-control-44 px-8 text-body font-medium text-accent-primary">
      {children}
    </button>
  )
}

/** Figma "Nav bar": a screen inside a stack, with Back on the left, a title and an optional action on the right. */
export function StackScreen({ title, children, right, withTabBar = true }: { title: string; children: ReactNode; right?: ReactNode; withTabBar?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className={`pt-safe min-h-dvh px-16 ${withTabBar ? 'pb-[144px]' : 'pb-safe'}`}>
      <header className="-mx-2 flex min-h-control-56 items-center gap-4">
        <IconButton icon="back" label="Back" onClick={() => navigate(-1)} />
        {title ? <h1 className="flex-1 truncate font-display text-body-l font-medium">{title}</h1> : <span className="flex-1" />}
        {right}
      </header>
      {children}
    </div>
  )
}

/** Figma "Filter chip": a pill in a swipeable row; the selected one is dark. */
export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`press min-h-control-44 shrink-0 rounded-full px-16 text-body-s font-medium ${active ? 'bg-surface-nav text-text-on-dark' : 'bg-surface-card text-text-secondary ring-1 ring-inset ring-surface-subtle'}`}
    >
      {children}
    </button>
  )
}

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
    <button type="button" onClick={onClick} className="press -mr-8 min-h-control-44 rounded-full px-8 text-body font-medium text-accent-primary">
      {children}
    </button>
  )
}

/** Figma "Nav bar": a screen inside a stack, with Back on the left, a title and an optional action on the right.
 *  `onBack` replaces going back in history (a step inside a flow); `back={false}` hides it.
 *  `footer` sticks to the bottom of the screen (the main button of a flow). */
export function StackScreen({
  title,
  children,
  right,
  withTabBar = true,
  onBack,
  back = true,
  footer,
}: {
  title: string
  children: ReactNode
  right?: ReactNode
  withTabBar?: boolean
  onBack?: () => void
  back?: boolean
  footer?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className={`pt-safe min-h-dvh px-16 ${withTabBar ? 'pb-tab-bar-room' : 'pb-safe'} ${footer ? 'flex flex-col' : ''}`}>
      <header className="-mx-2 flex min-h-control-56 items-center gap-4">
        {back ? <IconButton icon="chevron-left" label="Back" onClick={onBack ?? (() => navigate(-1))} /> : <span className="size-control-44" />}
        {title ? <h1 className="flex-1 truncate font-display text-body-l font-medium">{title}</h1> : <span className="flex-1" />}
        {right}
      </header>
      {footer ? (
        <>
          <div className="flex-1">{children}</div>
          <div className="pt-16">{footer}</div>
        </>
      ) : (
        children
      )}
    </div>
  )
}

/** Figma "Filter chip": a pill in a swipeable row; the selected one is accent. A tab (filters) or a radio (one answer). */
export function Chip({ children, active, onClick, role = 'tab' }: { children: ReactNode; active?: boolean; onClick: () => void; role?: 'tab' | 'radio' }) {
  return (
    <button
      type="button"
      role={role}
      aria-selected={role === 'tab' ? active : undefined}
      aria-checked={role === 'radio' ? Boolean(active) : undefined}
      onClick={onClick}
      className={`press min-h-control-44 shrink-0 rounded-full px-16 text-body-s font-medium ${active ? 'bg-accent-primary text-text-on-accent' : 'bg-surface-card text-text-primary ring-1 ring-inset ring-border-control'}`}
    >
      {children}
    </button>
  )
}

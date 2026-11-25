// Small layout pieces shared by the screens. No data loading inside — only props.
// The base components live in their own files: Button, IconButton, Card, TextField, ListRow, PetAvatar…

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { IconButton } from './IconButton'
import type { ShowState } from './showState'

/** Figma "Section header": SB/Title (24/32) with an optional action link on the right; 32 above (Figma: 16 between blocks + 16 section padding), 12 to the card.
 *  The link keeps its 44 tap area but doesn't make the row taller (-my-6). */
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-32 mb-12 flex items-center justify-between">
      <h2 className="font-display text-title font-medium">{children}</h2>
      {action}
    </div>
  )
}

/** The action link in a section header, e.g. "See schedule". */
export function TextLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press -my-6 -mr-8 min-h-control-44 rounded-full px-8 text-caption text-accent-primary">
      {children}
    </button>
  )
}

/** Figma "Nav bar": a screen inside a stack, with Back on the left, the title centred (Body, medium, text/primary)
 *  and an optional action on the right.
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
      {/* Three columns: Back, the title centred on the screen, the action — the side columns share the width */}
      {/* Figma Nav bar: 44 high, 16 under the status bar */}
      <header className="-mx-2 mt-16 grid min-h-control-44 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex">{back ? <IconButton icon="chevron-left" label="Back" onClick={onBack ?? (() => navigate(-1))} /> : <span className="size-control-44" />}</div>
        {title ? <h1 className="max-w-[240px] truncate text-center text-body font-medium text-text-primary">{title}</h1> : <span />}
        <div className="flex justify-end">{right}</div>
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

/** Figma "Filter chip": a pill in a swipeable row. Selected = F2 (Nov 25): accent/primary-subtle with a 1.5px
 *  accent/primary edge inside and an accent/on-subtle label. A tab (filters) or a radio (one answer). */
export function Chip({
  children,
  active,
  onClick,
  role = 'tab',
  disabled,
  'data-state': state,
}: {
  children: ReactNode
  active?: boolean
  onClick: () => void
  role?: 'tab' | 'radio'
  disabled?: boolean
  'data-state'?: ShowState
}) {
  return (
    <button
      type="button"
      role={role}
      aria-selected={role === 'tab' ? active : undefined}
      aria-checked={role === 'radio' ? Boolean(active) : undefined}
      onClick={onClick}
      disabled={disabled}
      data-state={state}
      className={`press min-h-control-44 shrink-0 rounded-full px-16 text-body-s font-regular disabled:opacity-40 ${active ? 'bg-accent-primary-subtle text-accent-on-subtle ring-[1.5px] ring-inset ring-accent-primary active:bg-accent-primary-soft data-[state=pressed]:bg-accent-primary-soft' : 'bg-surface-card text-text-primary ring-1 ring-inset ring-border-control active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle'}`}
    >
      {children}
    </button>
  )
}

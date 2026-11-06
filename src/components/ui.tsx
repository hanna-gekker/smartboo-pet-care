// Small building blocks. No data loading inside — only props.

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import type { Pet } from '../data/types'
import { Icon, type IconName } from './Icon'

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
  icon?: IconName
  full?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

const buttonStyles = {
  primary: 'bg-accent text-on-accent',
  secondary: 'bg-accent-soft text-accent',
  ghost: 'bg-transparent text-ink-2',
  dark: 'bg-bar text-on-bar',
}

export function Button({ children, onClick, variant = 'primary', icon, full, disabled, type = 'button', className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`press inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold disabled:opacity-40 ${buttonStyles[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}

export function IconButton({ icon, label, onClick, className = '' }: { icon: IconName; label: string; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`press flex size-11 shrink-0 items-center justify-center rounded-full text-ink ${className}`}
    >
      <Icon name={icon} />
    </button>
  )
}

export function PetAvatar({ pet, size = 40, dot }: { pet?: Pet; size?: number; dot?: boolean }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      {pet?.photo ? (
        <img src={pet.photo} alt="" className="size-full rounded-full object-cover" draggable={false} />
      ) : (
        <span className="flex size-full items-center justify-center rounded-full bg-accent-soft font-display font-semibold text-accent" style={{ fontSize: size * 0.42 }}>
          {pet?.name[0] ?? '?'}
        </span>
      )}
      {dot && <span className="absolute top-0 right-0 size-3 rounded-full border-2 border-bg bg-warn" />}
    </span>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const cls = `rounded-md bg-surface p-4 shadow-[0_1px_2px_var(--line)] ring-1 ring-line ${className}`
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`press block w-full text-left ${cls}`}>
        {children}
      </button>
    )
  return <div className={cls}>{children}</div>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-7 mb-3 flex min-h-6 items-center justify-between">
      <h2 className="font-display text-[17px] font-semibold">{children}</h2>
      {action}
    </div>
  )
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press -my-3 -mr-2 min-h-11 px-2 text-[15px] font-medium text-accent">
      {children}
    </button>
  )
}

/** A screen inside a stack: back arrow at the top left, title, optional action on the right. */
export function StackScreen({ title, children, right, withTabBar = true }: { title: string; children: ReactNode; right?: ReactNode; withTabBar?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className={`pt-safe min-h-dvh px-gutter ${withTabBar ? 'pb-36' : 'pb-safe'}`}>
      <header className="-mx-2 flex min-h-12 items-center gap-1">
        <IconButton icon="back" label="Back" onClick={() => navigate(-1)} />
        {title ? <h1 className="flex-1 truncate font-display text-[17px] font-semibold">{title}</h1> : <span className="flex-1" />}
        {right}
      </header>
      {children}
    </div>
  )
}

export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`press min-h-11 shrink-0 rounded-full px-4 text-[14px] font-medium ${active ? 'bg-bar text-on-bar' : 'bg-surface text-ink-2 ring-1 ring-line'}`}
    >
      {children}
    </button>
  )
}

export function Field({ label, children, unsure }: { label: string; children: ReactNode; unsure?: boolean }) {
  return (
    <label className={`block rounded-sm px-3 py-2 ${unsure ? 'bg-warn-soft ring-1 ring-warn' : 'bg-bg ring-1 ring-line'}`}>
      <span className="flex items-center gap-1 text-[12px] font-medium text-ink-2">
        {label}
        {unsure && <span className="text-warn">· please check</span>}
      </span>
      {children}
    </label>
  )
}

export const inputClass = 'mt-0.5 block min-h-7 w-full bg-transparent text-[16px] text-ink outline-none'

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
  primary: 'bg-accent-primary text-text-on-accent',
  secondary: 'bg-accent-primary-subtle text-accent-primary',
  ghost: 'bg-transparent text-text-secondary',
  dark: 'bg-surface-nav text-text-on-dark',
}

export function Button({ children, onClick, variant = 'primary', icon, full, disabled, type = 'button', className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`press inline-flex min-h-[48px] items-center justify-center gap-8 rounded-full px-16 text-body font-medium disabled:opacity-40 ${buttonStyles[variant]} ${full ? 'w-full' : ''} ${className}`}
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
      className={`press flex size-control-44 shrink-0 items-center justify-center rounded-full text-text-primary ${className}`}
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
        <span className="flex size-full items-center justify-center rounded-full bg-accent-primary-subtle font-display font-medium text-accent-primary" style={{ fontSize: size * 0.42 }}>
          {pet?.name[0] ?? '?'}
        </span>
      )}
      {dot && <span className="absolute top-0 right-0 size-[12px] rounded-full border-2 border-surface-canvas bg-status-waiting-dot" />}
    </span>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const cls = `rounded-24 bg-surface-card p-16 shadow-[0_1px_2px_var(--surface-subtle)] ring-1 ring-surface-subtle ${className}`
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
    <div className="mt-24 mb-12 flex min-h-[24px] items-center justify-between">
      <h2 className="font-display text-body-l font-medium">{children}</h2>
      {action}
    </div>
  )
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press -my-12 -mr-8 min-h-control-44 px-8 text-body font-medium text-accent-primary">
      {children}
    </button>
  )
}

/** A screen inside a stack: back arrow at the top left, title, optional action on the right. */
export function StackScreen({ title, children, right, withTabBar = true }: { title: string; children: ReactNode; right?: ReactNode; withTabBar?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className={`pt-safe min-h-dvh px-16 ${withTabBar ? 'pb-[144px]' : 'pb-safe'}`}>
      <header className="-mx-8 flex min-h-[48px] items-center gap-4">
        <IconButton icon="back" label="Back" onClick={() => navigate(-1)} />
        {title ? <h1 className="flex-1 truncate font-display text-body-l font-medium">{title}</h1> : <span className="flex-1" />}
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
      className={`press min-h-control-44 shrink-0 rounded-full px-16 text-body-s font-medium ${active ? 'bg-surface-nav text-text-on-dark' : 'bg-surface-card text-text-secondary ring-1 ring-surface-subtle'}`}
    >
      {children}
    </button>
  )
}

export function Field({ label, children, unsure }: { label: string; children: ReactNode; unsure?: boolean }) {
  return (
    <label className={`block rounded-16 px-12 py-8 ${unsure ? 'bg-status-check-bg ring-1 ring-status-check-border' : 'bg-surface-canvas ring-1 ring-surface-subtle'}`}>
      <span className="flex items-center gap-4 text-caption font-medium text-text-secondary">
        {label}
        {unsure && <span className="text-status-check-text">· please check</span>}
      </span>
      {children}
    </label>
  )
}

export const inputClass = 'mt-2 block min-h-[28px] w-full bg-transparent text-body text-text-primary outline-none'

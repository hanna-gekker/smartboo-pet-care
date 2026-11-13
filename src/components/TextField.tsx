// Text field — Figma "Form field" (Patterns).
// States: Default, Focused, Needs check (Boo wasn't sure), Error. Plus disabled.
// The label is tied to the field, and a hint or error is read by VoiceOver together with it.

import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type Common = {
  label: string
  /** A short line under the field. */
  hint?: string
  /** What is wrong. Shows a red outline and the message under the field. */
  error?: string
  /** Boo read this value but isn't sure (Figma State=Needs check). */
  needsCheck?: boolean
  /** Icon at the right end of the field, e.g. "schedule" for a date. */
  trailingIcon?: IconName
  /** Forces a look for /components and Storybook. Screens don't pass it. */
  'data-state'?: 'focus'
}

type InputProps = Common & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { options?: undefined }
type SelectProps = Common &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    /** Turns the field into a choice list. */
    options: { value: string; label: string }[]
  }

const box = {
  default: 'bg-surface-card ring-1 ring-border-control focus-within:ring-2 focus-within:ring-text-primary data-[state=focus]:ring-2 data-[state=focus]:ring-text-primary',
  check: 'bg-status-check-bg ring-1 ring-status-check-border focus-within:ring-2',
  error: 'bg-surface-card ring-2 ring-status-error-border',
}

export function TextField(props: InputProps | SelectProps) {
  const { label, hint, error, needsCheck, trailingIcon, 'data-state': state, className = '', ...field } = props
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  const look = error ? box.error : needsCheck ? box.check : box.default
  const fieldProps = {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': message ? messageId : undefined,
    className: 'min-w-0 flex-1 appearance-none bg-transparent py-12 text-body leading-24 text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed',
  }

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <label htmlFor={id} className="flex items-center gap-4 text-caption font-medium text-text-secondary">
        {label}
        {needsCheck && !error && <span className="text-status-check-text">· please check</span>}
      </label>
      <div data-state={state} className={`flex items-center gap-8 rounded-16 px-16 has-[:disabled]:opacity-40 ${look}`}>
        {'options' in field && field.options ? (
          <select {...(field as Omit<SelectProps, keyof Common | 'options'>)} {...fieldProps}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input {...(field as Omit<InputProps, keyof Common | 'options'>)} {...fieldProps} />
        )}
        {trailingIcon && <Icon name={trailingIcon} size={20} className="shrink-0 text-text-secondary" />}
      </div>
      {message && (
        <p id={messageId} className={`flex items-center gap-4 text-caption ${error ? 'text-status-error-text' : 'text-text-secondary'}`}>
          {error && <Icon name="alert-circle" size={16} className="shrink-0" />}
          {message}
        </p>
      )}
    </div>
  )
}

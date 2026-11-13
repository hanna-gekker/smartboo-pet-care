import { useEffect } from 'react'
import { useUi } from '../data/useUi'
import { Button } from './Button'
import { Icon } from './Icon'

/** "Saved · Undo" — disappears after 5 seconds. */
export function Toast() {
  const toast = useUi((s) => s.toast)
  const hide = useUi((s) => s.hideToast)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(hide, 5000)
    return () => clearTimeout(timer)
  }, [toast, hide])

  if (!toast) return null
  return (
    <div className="pt-safe pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-16">
      <div role="status" className="animate-fade-in pointer-events-auto flex min-h-control-56 w-full max-w-420 items-center gap-12 rounded-full bg-surface-nav py-4 pr-4 pl-16 text-text-on-dark">
        <span className="flex size-icon-24 shrink-0 items-center justify-center rounded-full bg-text-on-dark text-surface-nav">
          <Icon name="check" size={16} />
        </span>
        <p className="flex-1 text-body-s">{toast.text}</p>
        {toast.undo && (
          <Button
            variant="ghost"
            onClick={() => {
              toast.undo?.()
              hide()
            }}
            className="!text-text-on-dark active:!bg-transparent"
          >
            Undo
          </Button>
        )}
      </div>
    </div>
  )
}

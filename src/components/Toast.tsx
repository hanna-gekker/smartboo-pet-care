import { useEffect } from 'react'
import { useUi } from '../data/useUi'
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-16 pt-[max(env(safe-area-inset-top),var(--space-12))]">
      <div role="status" className="animate-fade-in pointer-events-auto flex w-full max-w-[420px] items-center gap-12 rounded-full bg-surface-nav py-4 pr-4 pl-16 text-text-on-dark">
        <Icon name="check" size={18} />
        <p className="flex-1 text-body-s ">{toast.text}</p>
        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              toast.undo?.()
              hide()
            }}
            className="press min-h-control-44 rounded-full px-16 text-body-s font-medium"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  )
}

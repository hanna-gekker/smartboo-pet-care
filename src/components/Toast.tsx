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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(env(safe-area-inset-top),12px)]">
      <div role="status" className="animate-fade-in pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-full bg-bar py-1.5 pr-1.5 pl-4 text-on-bar">
        <Icon name="check" size={18} />
        <p className="flex-1 text-[14px] leading-tight">{toast.text}</p>
        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              toast.undo?.()
              hide()
            }}
            className="press min-h-11 rounded-full px-4 text-[14px] font-semibold"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  )
}

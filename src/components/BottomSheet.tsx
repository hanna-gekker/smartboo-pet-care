import { useRef, useState, type ReactNode } from 'react'

/** A sheet that slides up over the current screen and closes with a swipe down or a tap on the dimmed area. */
export function BottomSheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const startY = useRef<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)

  if (!open) return null

  const onStart = (y: number) => {
    startY.current = y
    setDragging(true)
  }
  const onMove = (y: number) => {
    if (startY.current !== null) setDragY(Math.max(0, y - startY.current))
  }
  const onEnd = () => {
    if (dragY > 90) onClose()
    startY.current = null
    setDragging(false)
    setDragY(0)
  }

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={label}>
      <div className="animate-fade-in absolute inset-0 bg-surface-scrim" onClick={onClose} />
      <div
        className="animate-sheet-in pb-safe absolute inset-x-0 bottom-0 mx-auto max-h-[88dvh] max-w-560 overflow-y-auto rounded-t-24 bg-surface-card px-16"
        style={{ transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform 200ms ease' }}
      >
        <div
          className="sticky top-0 z-10 -mx-16 flex h-control-32 touch-none items-center justify-center bg-surface-card"
          onTouchStart={(e) => onStart(e.touches[0].clientY)}
          onTouchMove={(e) => onMove(e.touches[0].clientY)}
          onTouchEnd={onEnd}
          onPointerDown={(e) => e.pointerType === 'mouse' && onStart(e.clientY)}
          onPointerMove={(e) => e.pointerType === 'mouse' && e.buttons && onMove(e.clientY)}
          onPointerUp={(e) => e.pointerType === 'mouse' && onEnd()}
        >
          <span className="h-[6px] w-control-40 rounded-full bg-surface-subtle" />
        </div>
        {children}
      </div>
    </div>
  )
}

// Step bar — Figma "Step bar" (Add your pet · step by step).
// One segment per step, 4 high, gap 8 (Figma 6; no 6 token); done and current = accent/primary,
// the rest border/card. VoiceOver reads "Step 2 of 5".

type StepBarProps = {
  /** How many steps there are. */
  steps: number
  /** The current step, from 1. */
  current: number
}

export function StepBar({ steps, current }: StepBarProps) {
  return (
    <div role="progressbar" aria-label={`Step ${current} of ${steps}`} aria-valuemin={1} aria-valuemax={steps} aria-valuenow={current} className="flex gap-8">
      {Array.from({ length: steps }, (_, i) => (
        <span key={i} className={`h-4 flex-1 rounded-full ${i < current ? 'bg-accent-primary' : 'bg-border-card'}`} />
      ))}
    </div>
  )
}

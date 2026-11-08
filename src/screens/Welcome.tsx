import { useNavigate } from 'react-router'
import { BooFace } from '../components/TabBar'
import { Button } from '../components/ui'
import { useApp } from '../data/useApp'
import { useUi } from '../data/useUi'

/** First launch only — until the first pet exists. Two equal ways in. */
export function Welcome() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const loadSample = useApp((s) => s.loadSample)

  return (
    <div className="pt-safe pb-safe flex min-h-dvh flex-col px-16">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex size-[96px] items-center justify-center rounded-full bg-accent-primary text-text-on-accent">
          <BooFace size={56} />
        </span>
        <h1 className="mt-24 font-display text-display font-medium">Just hand it to Boo.</h1>
        <p className="mt-12 max-w-[320px] text-body leading-24 text-text-secondary">
          Everything about your pets in one place. Snap a vet paper — Boo files it and reminds you what’s due.
        </p>
      </div>

      <div className="flex flex-col gap-8 pb-8">
        <Button full icon="camera" onClick={() => openBoo('snap')}>
          Snap a vet paper
        </Button>
        <Button full variant="secondary" icon="plus" onClick={() => navigate('/pets/new')}>
          Add your pet
        </Button>
        <Button full variant="ghost" onClick={() => openBoo('menu')}>
          No papers right now
        </Button>
        <button type="button" onClick={loadSample} className="press min-h-control-44 text-body-s text-text-tertiary">
          Explore with sample pets
        </button>
      </div>
    </div>
  )
}

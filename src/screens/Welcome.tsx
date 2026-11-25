import { useNavigate } from 'react-router'
import { AskBooInput } from '../components/AskBooInput'
import { BooCharacter } from '../components/BooCharacter'
import { Button } from '../components/Button'
import { Note } from '../components/Note'
import { useUi } from '../data/useUi'

// Figma sparkles around Boo (x, y, size on the 390 frame), in ai/petal.
const sparkles = [
  { x: 66, y: 127, s: 22 },
  { x: 295, y: 155, s: 16 },
  { x: 311, y: 244, s: 12 },
  { x: 54, y: 269, s: 10 },
  { x: 291, y: 76, s: 8 },
]

/**
 * Figma "6 · Welcome": first launch only, until the first pet exists. Talk first.
 * Boo on a calm glow (tap to talk), then a white card: the title, "Just hand it to Boo.", one field to tell Boo
 * about your pet (type, camera or mic) and "Add your pet". At the bottom: Boo isn't a vet.
 */
export function Welcome() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const talk = () => openBoo('talk')

  return (
    <div className="bg-welcome relative isolate min-h-dvh overflow-hidden">
      {/* Soft glow behind Boo (Figma "Hero glow"), kept around the centre line */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]">
        <div className="absolute top-[55px] left-[calc(50%-165px)] size-[330px] rounded-full bg-ai-card-mint opacity-47 blur-[88px]" />
        <div className="absolute top-[60px] left-[calc(50%-180px)] size-[220px] rounded-full bg-ai-card-lilac opacity-55 blur-[88px]" />
        <div className="absolute top-[60px] left-[calc(50%-40px)] size-[220px] rounded-full bg-ai-card-blue opacity-55 blur-[88px]" />
        {sparkles.map((p) => (
          <svg key={p.x} viewBox="0 0 24 24" className="absolute fill-ai-petal" style={{ top: p.y, left: `calc(50% + ${p.x - 195}px)`, width: p.s, height: p.s }}>
            <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        ))}
      </div>

      <div className="pt-safe flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center justify-end gap-16 px-16 pt-4 pb-16">
          {/* Boo: the Figma instance is 275 × 300, set 14 / 22 out of its 248 frame */}
          <button type="button" aria-label="Talk to Boo" onClick={talk} className="press relative mx-auto mb-8 size-[248px] shrink-0 rounded-full">
            <BooCharacter size={275} pose="wave" className="absolute -top-[22px] -left-[14px]" />
          </button>

          <section className="shadow-card flex w-full max-w-420 flex-col gap-24 rounded-24 bg-surface-card p-24 text-center ring-1 ring-inset ring-border-card">
            <div className="flex flex-col gap-8">
              <h1 className="font-display text-display font-medium">
                {/* Line breaks as in Figma */}
                Everything about
                <br />
                your pets,
                <br />
                in one place.
              </h1>
              <p className="text-body-l text-text-secondary">Just hand it to Boo.</p>
            </div>
            <div className="flex flex-col gap-12">
              <AskBooInput surface="canvas" placeholder="Tell me about your pet…" onType={() => openBoo('type')} onSnap={() => openBoo('snap')} onTalk={talk} />
              <Button full size="large" variant="outline" icon="plus" onClick={() => navigate('/pets/new')}>
                Add your pet
              </Button>
            </div>
          </section>
        </div>

        <div className="pb-safe flex justify-center px-16 pt-4">
          <Note icon="stethoscope">Boo keeps your pet’s records. It isn’t a vet.</Note>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router'
import { BooCharacter } from '../components/BooCharacter'
import { Button } from '../components/Button'
import { GlassCard } from '../components/GlassCard'
import { Note } from '../components/Note'
import { TapHint } from '../components/TapHint'
import { useUi } from '../data/useUi'

/**
 * Figma "Welcome": first launch only, until the first pet exists.
 * Boo on top (tap to talk), an example Reminder on glass, the title in the middle, two equal ways in.
 */
export function Welcome() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const talk = () => openBoo('talk')

  return (
    <div className="bg-welcome relative isolate min-h-dvh overflow-hidden">
      {/* Soft light behind everything. Figma positions on the 390 frame, kept around the centre line.
          The aura glows show in dark only, the Boo backdrop in light only (the tokens are clear otherwise). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full">
        <div className="absolute top-[150px] left-[calc(50%-15px)] size-[260px] rounded-full bg-ai-aura-2 opacity-28 blur-[55px]" />
        <div className="absolute top-[40px] left-[calc(50%-285px)] size-[300px] rounded-full bg-ai-aura-1 opacity-60 blur-[45px]" />
        <div className="absolute top-[313px] left-[calc(50%-100px)] h-[120px] w-[260px] rounded-full bg-ai-aura-2 opacity-22 blur-[30px]" />
        <div className="absolute top-[43px] left-[calc(50%-125px)] size-[250px] rounded-full bg-ai-boo-backdrop blur-[15px]" />
      </div>

      <div className="pt-safe flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center px-24 pt-24">
          {/* Boo: the Figma instance is 200 wide, set 10px out of its 180 frame */}
          <button type="button" aria-label="Talk to Boo" onClick={talk} className="press relative size-[180px] shrink-0 rounded-full">
            <BooCharacter size={200} className="absolute -top-[10px] -left-[10px]" />
          </button>
          <div className="pt-[36px]">
            <TapHint label="Tap Boo to talk" onClick={talk} />
          </div>
          <div className="pt-32">
            <GlassCard image="/pets/rocky.jpg" title="Rocky’s rabies is due in 2 weeks" caption="Reminder" />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
            <h1 className="font-display text-display font-medium">
              {/* Line breaks as in Figma */}
              Everything about
              <br />
              your pets,
              <br />
              in one place.
            </h1>
            <p className="mt-8 text-body-l text-text-secondary">Just hand it to Boo.</p>
          </div>
        </div>

        <div className="pb-safe px-16">
          <div className="flex flex-col gap-[20px] pb-8">
            <div className="flex flex-col gap-12">
              <Button full size="large" icon="camera" onClick={() => openBoo('snap')}>
                Snap a vet paper
              </Button>
              <Button full size="large" variant="secondary" icon="plus" onClick={() => navigate('/pets/new')}>
                Add your pet
              </Button>
            </div>
            <div className="flex flex-col gap-8">
              <Note icon="home">Your pets’ records stay on this phone.</Note>
              <Note icon="stethoscope">Boo keeps your pet’s records. It isn’t a vet.</Note>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

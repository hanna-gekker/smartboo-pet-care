// Boo: a bottom sheet over the current screen (not a chat). Talk · Snap a paper · Type → toast, review card or answer.
// Boo itself is lib/booClient.ts (the server function); lib/boo.ts holds the sample paper and the stand-in Boo.

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Capacitor } from '@capacitor/core'
import { newId, petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import { SPECIES, type Pet, type PetRecord, type Species, type Task, type Vaccine } from '../data/types'
import { answersLine, howOften, samplePaper, type BooResult, type PaperMed, type ParsedPaper } from '../lib/boo'
import { readPaper, understand } from '../lib/booClient'
import { canListen, listen } from '../lib/speech'
import { BOO_ERRORS, BooPaperError, type BooErrorCase } from '../lib/booErrors'
import { askPermission, openAppSettings, syncReminders } from '../lib/reminders'
import { addDays, ageShort, formatDay, nowTime, today } from '../lib/dates'
import { speciesLabel } from '../lib/species'
import { convertWeight, weightUnits } from '../lib/weight'
import { shortVaccine } from '../lib/vaccines'
import { BottomSheet } from './BottomSheet'
import { BooCharacter, type BooPose } from './BooCharacter'
import { BooError } from './BooError'
import { Button } from './Button'
import { Card } from './Card'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { ListRow } from './ListRow'
import { PetAvatar } from './PetAvatar'
import { AnswerChips } from './RecordSheet'
import { TextField } from './TextField'

type Step =
  | { name: 'menu' }
  | { name: 'type' }
  | { name: 'consent'; then: () => void }
  | { name: 'snap' }
  | { name: 'talk' }
  | { name: 'reading' }
  | { name: 'paper'; paper: ParsedPaper }
  | { name: 'remind'; documents: { petId: string; documentId: string }[]; petId: string; petName: string }
  | { name: 'notifications-off'; petId: string; petName: string }
  | { name: 'photo'; petId: string; petName: string }
  | { name: 'thinking' }
  | { name: 'new-pet'; found: Extract<BooResult, { kind: 'new-pet' }> }
  | { name: 'result'; result: BooResult; phrase: string }
  | { name: 'error'; kind: BooErrorCase; input?: 'paper' | 'voice'; retry?: () => void }

export function BooSheet() {
  const { booOpen, booSession, closeBoo, openBoo, paperWaiting, setPaperWaiting } = useUi()
  // A paper picked while offline is read as soon as the phone is back online (PRODUCT.md "When something goes wrong")
  useEffect(() => {
    if (!paperWaiting) return
    const read = () => {
      setPaperWaiting(false)
      openBoo('reading')
    }
    window.addEventListener('online', read)
    return () => window.removeEventListener('online', read)
  }, [paperWaiting, setPaperWaiting, openBoo])
  return (
    <BottomSheet open={booOpen} onClose={closeBoo} label="Boo">
      <div className="pb-16">
        <BooFlow key={booSession} />
      </div>
    </BottomSheet>
  )
}

/** One opening of the sheet. A new key on every opening starts it fresh. */
function BooFlow() {
  const { booStart, booText } = useUi()
  const [step, setStep] = useState<Step>(booStart === 'send' ? { name: 'thinking' } : ({ name: booStart } as Step))
  const [text, setText] = useState(booText)
  return <StepView step={step} setStep={setStep} text={text} setText={setText} sendNow={booStart === 'send'} />
}

function StepView({ step, setStep, text, setText, sendNow }: { step: Step; setStep: (s: Step) => void; text: string; setText: (t: string) => void; sendNow?: boolean }) {
  const app = useApp()
  const { closeBoo, showToast, setPaperWaiting } = useUi()
  const navigate = useNavigate()

  /** Boo asks once before sending anything to the AI service. */
  const withConsent = (action: () => void) => {
    if (app.settings.booConsent) action()
    else setStep({ name: 'consent', then: action })
  }

  const startReading = (file?: File) =>
    withConsent(() => {
      useUi.getState().setPaperFile(file)
      if (!navigator.onLine) {
        setPaperWaiting(true)
        setStep({ name: 'error', kind: 'offline' })
      } else setStep({ name: 'reading' })
    })

  // Reading runs while the step is on screen; a paper Boo can't use shows its error (blurry, not a vet paper, offline)
  const reading = step.name === 'reading'
  useEffect(() => {
    if (!reading) return
    let live = true
    const file = useUi.getState().paperFile
    ;(file ? readPaper(file) : samplePaper())
      .then((paper) => live && setStep({ name: 'paper', paper }))
      .catch((e: unknown) => {
        if (!live) return
        if (e instanceof BooPaperError) {
          if (e.kind === 'offline') setPaperWaiting(true)
          setStep({ name: 'error', kind: e.kind, retry: () => setStep({ name: 'reading' }) })
        } else setStep({ name: 'error', kind: 'not-paper' })
      })
    return () => {
      live = false
    }
  }, [reading, setStep, setPaperWaiting])

  const addByHand = () => {
    closeBoo()
    navigate('/pets/new')
  }

  const send = (phrase: string) => {
    if (!phrase.trim()) return
    withConsent(async () => {
      setStep({ name: 'thinking' })
      let result: BooResult
      try {
        result = await understand(phrase, app)
      } catch (e) {
        return setStep({ name: 'error', kind: e instanceof BooPaperError ? e.kind : 'failed', input: 'voice', retry: () => send(phrase) })
      }
      if (result.kind === 'weight' || result.kind === 'record') saveSimple(result, phrase)
      else if (result.kind === 'new-pet') setStep({ name: 'new-pet', found: result })
      else setStep({ name: 'result', result, phrase })
    })
  }

  /** "Both" (Figma 8b): Boo files the same phrase for each pet. Simple records are saved for each; a course of meds
   *  gets one review card with both pets. */
  const sendFor = async (petIds: string[], phrase: string, shown: string) => {
    setStep({ name: 'thinking' })
    const named = petIds.map((id) => petById(app.pets, id)!).filter(Boolean)
    let results: BooResult[]
    try {
      results = await Promise.all(named.map((p) => understand(`${p.name} ${phrase}`, app)))
    } catch (e) {
      return setStep({ name: 'error', kind: e instanceof BooPaperError ? e.kind : 'failed', input: 'voice', retry: () => void sendFor(petIds, phrase, shown) })
    }
    if (results.every((x) => x.kind === 'record')) {
      const ids = results.map((x) => {
        const id = newId('rec')
        if (x.kind === 'record') app.addRecord({ id, petId: x.petId, type: x.type, date: today(), time: nowTime(), title: x.title, said: shown })
        return id
      })
      showToast(`Saved to ${named.map((p) => p.name).join(' & ')}’s notes`, () => ids.forEach((id) => app.removeRecord(id)))
      closeBoo()
      return
    }
    const first = results[0]
    if (first.kind === 'meds') setStep({ name: 'result', result: { ...first, petIds }, phrase: shown })
    else setStep({ name: 'result', result: first, phrase: shown })
  }

  // Opened with text to read (Welcome, typed in place): read it once, right away
  const sentOnce = useRef(false)
  useEffect(() => {
    if (!sendNow || sentOnce.current) return
    sentOnce.current = true
    send(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on opening
  }, [])

  /** Simple records are saved right away, with "Saved · Undo". */
  const saveSimple = (result: Extract<BooResult, { kind: 'weight' | 'record' }>, said: string) => {
    const pet = petById(app.pets, result.petId)!
    const id = newId('rec')
    if (result.kind === 'weight') {
      const last = app.records.filter((r) => r.petId === pet.id && r.type === 'weight').sort((a, b) => b.date.localeCompare(a.date))[0]
      const value = convertWeight(result.value, result.unit, pet.weightUnit)
      app.addRecord({ id, petId: pet.id, type: 'weight', date: today(), time: nowTime(), title: 'Weight', value, said })
      const diff = last?.value !== undefined ? Math.round((value - last.value) * 10) / 10 : undefined
      const change = diff === undefined ? '' : diff === 0 ? ' · same as last time' : ` · ${diff > 0 ? '+' : '−'}${Math.abs(diff)} ${pet.weightUnit} since ${formatDay(last.date)}`
      showToast(`Saved · ${pet.name}, ${value} ${pet.weightUnit}${change}`, () => app.removeRecord(id))
    } else {
      app.addRecord({ id, petId: pet.id, type: result.type, date: today(), time: nowTime(), title: result.title, said })
      showToast(`Saved to ${pet.name}’s notes`, () => app.removeRecord(id))
    }
    navigator.vibrate?.(10)
    setText('')
    closeBoo()
  }

  switch (step.name) {
    case 'menu':
      return (
        <div className="flex flex-col gap-16">
          <BooHeader />
          {/* Figma "8 · Boo sheet": three tiles, Talk first and highlighted */}
          <div className="grid grid-cols-3 gap-12">
            <BigAction icon="mic" label="Talk" main onClick={() => setStep({ name: 'talk' })} />
            <BigAction icon="camera" label="Snap" onClick={() => setStep({ name: 'snap' })} />
            <BigAction icon="keyboard" label="Type" onClick={() => setStep({ name: 'type' })} />
          </div>
          <p className="text-caption text-text-secondary">Try: “Cleo weighs 950 grams” · “When is Rocky’s rabies due?”</p>
        </div>
      )

    case 'type':
      return (
        <div className="flex flex-col gap-16">
          <BooHeader />
          {/* Figma "8a · Typing": a grey capsule with the send button */}
          <form
            className="flex min-h-control-56 items-center gap-8 rounded-full bg-surface-subtle py-8 pr-8 pl-16 focus-within:ring-2 focus-within:ring-text-primary"
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
          >
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell Boo anything…"
              aria-label="Type to Boo"
              enterKeyHint="send"
              className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-text-tertiary"
            />
            <IconButton type="submit" variant="primary" icon="arrow-up" label="Send" disabled={!text.trim()} className="-m-2" />
          </form>
        </div>
      )

    case 'consent':
      return (
        // Figma 6j "AI consent": the mini Boo and one sentence, Continue / Not now. Asked once.
        <div className="flex flex-col gap-24">
          <div className="flex items-center gap-12">
            <BooCharacter look="mini" size={56} />
            <p className="min-w-0 flex-1 text-body text-text-primary">Boo sends your photo or words to an AI service to read them. Nothing is kept after that.</p>
          </div>
          <div className="flex flex-col gap-8">
            <Button
              full
              onClick={() => {
                app.updateSettings({ booConsent: true })
                step.then()
              }}
            >
              Continue
            </Button>
            <Button full variant="ghost" onClick={closeBoo}>
              Not now
            </Button>
          </div>
        </div>
      )

    case 'new-pet':
      return (
        <NewPetReview
          found={step.found}
          onConfirm={(pet) => {
            navigator.vibrate?.(10)
            app.addPet(pet)
            setStep({ name: 'photo', petId: pet.id, petName: pet.name })
          }}
        />
      )

    case 'snap':
      // Figma 6a "Pick a source": Boo and the title, then a card per source
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Snap a vet paper" />
          <div className="flex flex-col gap-8">
            <FilePick icon="camera" label="Camera" accept="image/*" capture onPick={startReading} />
            <FilePick icon="image" label="Photo library" accept="image/*" onPick={startReading} />
            <FilePick icon="file-text" label="PDF from Files" accept="application/pdf" onPick={startReading} />
          </div>
          <Button full variant="ghost" onClick={() => startReading()} className="!text-accent-on-subtle">
            No paper at hand? Try a sample one
          </Button>
        </div>
      )

    case 'talk':
      return <Talk onDone={(t) => (t ? send(t) : setStep({ name: 'menu' }))} onNotHeard={() => setStep({ name: 'error', kind: 'not-heard' })} onMicOff={() => setStep({ name: 'error', kind: 'mic-off' })} />

    case 'error': {
      const e = BOO_ERRORS[step.kind]
      const snap = () => setStep({ name: 'snap' })
      const actions: Record<BooErrorCase, [() => void, () => void]> = {
        blurry: [snap, snap],
        'not-paper': [snap, addByHand],
        // On the iPhone this opens the app's own page in iOS Settings
        'camera-off': [() => window.open('app-settings:'), snap],
        offline: [closeBoo, addByHand],
        'not-heard': [() => setStep({ name: 'talk' }), () => setStep({ name: 'type' })],
        'mic-off': [openAppSettings, () => setStep({ name: 'type' })],
        limit: [addByHand, closeBoo],
        failed: [step.retry ?? closeBoo, addByHand],
      }
      const [primary, secondary] = actions[step.kind]
      return <BooError input={step.input ?? e.input} message={e.message} primary={{ label: e.primary, onClick: primary }} secondary={{ label: e.secondary, onClick: secondary }} />
    }

    case 'reading':
      // Figma 6c: a paper being scanned and the review card it turns into
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Reading…" pose="reading" />
          <ReadingPicture />
        </div>
      )

    case 'thinking':
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Thinking…" pose="writing" />
        </div>
      )

    case 'paper':
      return (
        <PaperReview
          paper={step.paper}
          onConfirm={(saved) => {
            navigator.vibrate?.(10)
            // The photo question is for the first new pet (or the first pet); reminders only if a vaccine is still ahead
            const first = saved.find((x) => x.isNew) ?? saved[0]
            const next = { petId: first.petId, petName: first.petName }
            const ahead = step.paper.pets.some((p) => p.vaccines.some((v) => v.due && v.due >= today()))
            setStep(ahead ? { name: 'remind', documents: saved, ...next } : { name: 'photo', ...next })
          }}
        />
      )

    case 'remind':
      // Figma 6e
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Remind you 2 weeks before each one?" pose="bell" />
          <div className="flex flex-col gap-8">
            <Button
              full
              size="large"
              onClick={async () => {
                // The tasks are saved either way (they show in Schedule); only now does iOS ask for notifications
                const n = step.documents.reduce((sum, d) => sum + app.remindVaccines(d.petId, d.documentId), 0)
                const next = { petId: step.petId, petName: step.petName }
                try {
                  if ((await askPermission()) !== 'granted') return setStep({ name: 'notifications-off', ...next })
                  const s = useApp.getState()
                  await syncReminders(s.tasks, s.pets, s.settings)
                  showToast(`${n} reminder${n === 1 ? '' : 's'} set`)
                } catch {
                  showToast("Couldn't set reminders. They're still in your Schedule.")
                }
                setStep({ name: 'photo', ...next })
              }}
            >
              Yes
            </Button>
            <Button full variant="ghost" onClick={() => setStep({ name: 'photo', petId: step.petId, petName: step.petName })}>
              Not now
            </Button>
          </div>
        </div>
      )

    case 'notifications-off':
      // Permission denied: the app keeps working, the tasks are in Schedule; a way back to the iPhone Settings
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Notifications are off" pose="oops" />
          <p className="text-body-l text-text-primary">So I can't remind you. You can turn them on in Settings — your reminders are still in Schedule.</p>
          <div className="flex flex-col gap-8">
            <Button full size="large" onClick={openAppSettings}>
              Open Settings
            </Button>
            <Button full variant="ghost" onClick={() => setStep({ name: 'photo', petId: step.petId, petName: step.petName })}>
              Not now
            </Button>
          </div>
        </div>
      )

    case 'photo': {
      // Figma 6g
      const finish = () => {
        closeBoo()
        navigate('/')
      }
      const pet = petById(app.pets, step.petId)
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title={`Add a photo of ${step.petName}?`} />
          <div className="flex flex-col gap-8">
            {pet?.photo ? (
              <Button full size="large" onClick={finish}>
                Done
              </Button>
            ) : (
              <PhotoPick
                onPick={(file) => {
                  app.updatePet(step.petId, { photo: URL.createObjectURL(file) })
                  finish()
                }}
              />
            )}
            <Button full variant="ghost" onClick={finish}>
              Later
            </Button>
          </div>
        </div>
      )
    }

    case 'result':
      return (
        <ResultView
          result={step.result}
          phrase={step.phrase}
          onBack={() => setStep({ name: 'menu' })}
          onPick={(petIds) => {
            if (step.result.kind !== 'which-pet') return
            if (petIds.length === 1) send(`${petById(app.pets, petIds[0])?.name} ${step.result.text}`)
            else void sendFor(petIds, step.result.text, step.phrase)
          }}
        />
      )
  }
}

/** Boo and the question on top of the sheet (Figma "Header"). No name: there are no accounts. */
function BooHeader() {
  const name = useApp((s) => s.settings.owner?.name)
  return (
    <div className="flex items-center gap-12">
      <BooCharacter size={56} />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="font-display text-title font-medium">{name ? `What’s up, ${name}?` : 'What’s up?'}</p>
        <p className="text-body-s text-text-secondary">Talk, snap a paper or type — I’ll file it.</p>
      </div>
    </div>
  )
}

/** A big tile: an icon in a circle over a label. `main` is the highlighted one (Talk). */
function BigAction({ icon, label, main, onClick }: { icon: 'mic' | 'camera' | 'keyboard'; label: string; main?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press flex h-[112px] flex-col items-center justify-center gap-12 rounded-24 px-8 py-16 text-body font-medium ${
        main ? 'bg-accent-primary-subtle text-accent-primary ring-2 ring-accent-primary ring-inset' : 'shadow-card bg-surface-card text-text-primary ring-1 ring-border-card ring-inset'
      }`}
    >
      <span className={`flex size-48 items-center justify-center rounded-full ${main ? 'bg-accent-primary text-text-on-accent' : 'bg-accent-primary-subtle text-accent-primary'}`}>
        <Icon name={icon} size={24} />
      </span>
      {label}
    </button>
  )
}

/** Figma 6a "Sources": a tappable card with the source's icon in a soft accent circle, its name and a chevron. */
function FilePick({ icon, label, accept, capture, onPick }: { icon: 'camera' | 'image' | 'file-text'; label: string; accept: string; capture?: boolean; onPick: (file?: File) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        capture={capture ? 'environment' : undefined}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="press flex w-full items-center gap-16 rounded-16 bg-surface-card p-16 text-left ring-1 ring-inset ring-border-card active:bg-surface-subtle data-[state=pressed]:bg-surface-subtle"
      >
          <span className="flex size-control-40 shrink-0 items-center justify-center rounded-full bg-accent-primary-subtle text-accent-primary">
            <Icon name={icon} size={20} />
          </span>
          <span className="flex-1 text-body font-medium text-text-primary">{label}</span>
          <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary" />
      </button>
    </>
  )
}

/** "Take photo" (Figma 6g): the main button opens the camera. */
function PhotoPick({ onPick }: { onPick: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
      <Button full size="large" icon="camera" onClick={() => ref.current?.click()}>
        Take photo
      </Button>
    </>
  )
}

/** Figma "Header" of the first-launch sheets: the mini Boo (56) in the step's pose and the title, 12 apart. */
export function SheetHeader({ title, pose = 'idle' }: { title: string; pose?: BooPose }) {
  return (
    <div className="flex items-center gap-12">
      <BooCharacter look="mini" size={56} pose={pose} />
      <h2 className="min-w-0 flex-1 font-display text-title font-medium">{title}</h2>
    </div>
  )
}

/** Figma 6c "Skeleton": a 112 × 140 paper with grey lines and an accent scan line, and the review card to come. */
function ReadingPicture() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-16">
      <svg viewBox="0 0 112 140" className="h-[140px] w-[112px] overflow-hidden rounded-8 shadow-card">
        <rect x="0.5" y="0.5" width="111" height="139" rx="8" style={{ fill: 'var(--surface-card)', stroke: 'var(--border-card)' }} />
        <rect x="16" y="18" width="52" height="8" rx="4" style={{ fill: 'var(--accent-primary)' }} />
        {[
          [36, 80],
          [48, 64],
          [66, 80],
          [78, 72],
          [90, 56],
          [108, 40],
        ].map(([y, w]) => (
          <rect key={y} x="16" y={y} width={w} height="5" rx="2.5" style={{ fill: 'var(--border-card)' }} />
        ))}
        <circle cx="87" cy="115" r="10.25" strokeWidth="1.5" style={{ fill: 'none', stroke: 'var(--accent-primary)' }} />
        <rect className="boo-scan" x="0" y="2" width="112" height="2" style={{ fill: 'var(--accent-primary)' }} />
      </svg>
      <div className="panel-card flex w-full flex-col gap-16 overflow-hidden rounded-24 p-16">
        <div className="flex items-center gap-12">
          <span className="size-avatar-40 rounded-full bg-surface-subtle" />
          <span className="flex flex-col gap-8">
            <span className="h-[10px] w-[120px] rounded-full bg-surface-subtle" />
            <span className="h-[10px] w-[180px] rounded-full bg-surface-subtle" />
          </span>
        </div>
        {[150, 110].map((w) => (
          <div key={w} className="flex items-center justify-between">
            <span className="h-[10px] rounded-full bg-surface-subtle" style={{ width: w }} />
            <span className="h-icon-20 w-[56px] rounded-full bg-surface-subtle" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Figma 6k "Review card · from words": the pet Boo heard about. Looks right saves it; Edit details opens its fields. */
function NewPetReview({ found, onConfirm }: { found: Extract<BooResult, { kind: 'new-pet' }>; onConfirm: (pet: Pet) => void }) {
  const [editing, setEditing] = useState(false)
  const [pet, setPet] = useState<Pet>(() => ({
    id: newId('pet'),
    name: found.name,
    species: found.species,
    breed: found.breed,
    birthDate: found.birthDate,
    weightUnit: weightUnits(found.species)[0],
    allergies: [],
  }))
  const set = (patch: Partial<Pet>) => setPet((p) => ({ ...p, ...patch }))
  return (
    <div className="flex flex-col gap-16">
      <SheetHeader title="Here’s what I found" />
      {editing ? (
        <Card className="flex flex-col gap-8">
          <TextField label="Name" required value={pet.name} onChange={(e) => set({ name: e.target.value })} autoComplete="off" />
          <TextField
            label="Species"
            value={pet.species}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const species = e.target.value as Species
              set({ species, weightUnit: weightUnits(species)[0] })
            }}
            options={SPECIES.map((s) => ({ value: s, label: speciesLabel(s) }))}
          />
          <TextField label="Breed" value={pet.breed ?? ''} onChange={(e) => set({ breed: e.target.value })} />
          <TextField label="Date of birth" type="date" value={pet.birthDate ?? ''} onChange={(e) => set({ birthDate: e.target.value })} />
        </Card>
      ) : (
        <Card variant="list" className="overflow-hidden">
          <ListRow pet={pet} title={pet.name} subtitle={[speciesLabel(pet.species), pet.breed, ageShort(pet.birthDate)].filter(Boolean).join(' · ')} />
        </Card>
      )}
      <div className="flex flex-col gap-8">
        <Button full size="large" disabled={!pet.name.trim()} onClick={() => onConfirm({ ...pet, name: pet.name.trim(), breed: pet.breed?.trim() || undefined })}>
          Looks right
        </Button>
        {!editing && (
          <Button full variant="ghost" onClick={() => setEditing(true)}>
            Edit details
          </Button>
        )}
      </div>
    </div>
  )
}

type SavedPet = { petId: string; petName: string; documentId: string; isNew: boolean }

/** Review card for a paper: every pet on it with its vaccines and medicines, uncertain fields highlighted, "Looks right". */
function PaperReview({ paper, onConfirm }: { paper: ParsedPaper; onConfirm: (saved: SavedPet[]) => void }) {
  const app = useApp()
  const [forms, setForms] = useState(paper.pets.map((p) => ({ name: p.name, breed: p.breed, birthDate: p.birthDate })))
  const edit = (i: number, patch: Partial<(typeof forms)[number]>) => setForms((fs) => fs.map((f, j) => (j === i ? { ...f, ...patch } : f)))
  const existingOf = (name: string) => app.pets.find((p) => p.name.toLowerCase() === name.trim().toLowerCase())

  const confirm = () => {
    const saved = paper.pets.map((found, i): SavedPet => {
      const form = forms[i]
      const existing = existingOf(form.name)
      const petId = existing?.id ?? newId('pet')
      const pet: Pet = existing ?? { id: petId, name: form.name.trim(), species: found.species, breed: form.breed, birthDate: form.birthDate, weightUnit: 'kg', allergies: [] }
      const documentId = newId('doc')
      const vaccines: Vaccine[] = found.vaccines.map((v) => ({ id: newId('vax'), petId, documentId, ...v }))
      const records: PetRecord[] = [
        { id: newId('rec'), petId, type: 'document', date: paper.date, title: paper.title, detail: [paper.clinic, paper.amount].filter(Boolean).join(' · '), documentId },
      ]
      if (vaccines.length)
        records.push({ id: newId('rec'), petId, type: 'vaccine', date: paper.date, title: `${found.vaccines.map((v) => shortVaccine(v.name)).join(', ')} given`, documentId })
      const clinic = found.meds.filter((m) => m.where === 'clinic')
      if (clinic.length)
        records.push({ id: newId('rec'), petId, type: 'meds', date: paper.date, title: `Given at the clinic: ${clinic.map((m) => m.name).join(', ')}`, documentId })
      // A medicine to give at home with "how often" and "how long" becomes a course from the visit day; the days
      // still ahead get reminders. Without them (or if the course is over) it is filed as a record.
      const courses: Parameters<typeof app.addMed>[] = []
      for (const m of found.meds.filter((x) => x.where !== 'clinic')) {
        const until = m.perDay && m.days && m.where === 'home' ? addDays(paper.date, m.days - 1) : undefined
        if (until && until >= today()) {
          const tasks: Task[] = []
          for (let day = paper.date > today() ? paper.date : today(); day <= until; day = addDays(day, 1))
            for (const time of courseTimes(m.perDay!)) tasks.push({ id: newId('task'), petId, kind: 'med', title: m.name, date: day, time })
          courses.push([
            { id: newId('med'), petId, name: m.name, dose: m.dose || howOften(m.perDay!), start: paper.date, until },
            tasks,
            { id: newId('rec'), petId, type: 'meds', date: paper.date, title: `Started ${m.name}`, detail: medLine(m), documentId },
          ])
        } else records.push({ id: newId('rec'), petId, type: 'meds', date: paper.date, title: m.name, detail: medLine(m) || undefined, documentId })
      }
      app.addPaper({ pet, isNewPet: !existing, document: { id: documentId, petId, title: paper.title, clinic: paper.clinic, date: paper.date }, vaccines, records })
      for (const c of courses) app.addMed(...c)
      return { petId, petName: pet.name, documentId, isNew: !existing }
    })
    onConfirm(saved)
  }

  return (
    <div>
      <p className="text-body-s font-medium text-accent-primary">Boo found</p>
      <h2 className="font-display text-title font-medium">
        {paper.title} · {formatDay(paper.date)}
      </h2>
      {paper.clinic && <p className="text-body-s text-text-secondary">{paper.clinic}</p>}
      {paper.pets.length > 1 && (
        <p className="mt-16 text-body-s text-text-primary">
          This paper has {paper.pets.length} pets: {paper.pets.map((p) => p.name || 'no name').join(', ')}.
        </p>
      )}

      {paper.pets.map((found, i) => {
        const existing = existingOf(forms[i].name)
        const home = found.meds.filter((m) => m.where !== 'clinic')
        const clinic = found.meds.filter((m) => m.where === 'clinic')
        return (
          <section key={i} aria-label={forms[i].name || undefined} className={i > 0 ? 'mt-24 border-t border-border-card pt-16' : ''}>
            {existing ? (
              <p className="mt-16 rounded-16 bg-accent-primary-subtle p-12 text-body-s text-accent-primary">This goes into {existing.name}’s folder.</p>
            ) : (
              <p className="mt-16 text-body-s text-text-secondary">New pet — I’ll create a folder.</p>
            )}

            <div className="mt-12 grid grid-cols-2 gap-8">
              <TextField label="Name" value={forms[i].name} onChange={(e) => edit(i, { name: e.target.value })} />
              <TextField label="Species" value={found.species} readOnly />
              <TextField label="Breed" value={forms[i].breed} onChange={(e) => edit(i, { breed: e.target.value })} />
              <TextField label="Born" type="date" value={forms[i].birthDate} onChange={(e) => edit(i, { birthDate: e.target.value })} needsCheck={found.unsure.includes('birthDate')} />
            </div>

            {found.vaccines.length > 0 && (
              <Card variant="list" className="mt-12 overflow-hidden">
                <table className="w-full text-body-s">
                  <thead className="text-caption font-medium text-text-secondary">
                    <tr>
                      <th className="px-16 pt-12 pb-4 text-left font-medium">Vaccine</th>
                      <th className="pt-12 pb-4 text-right font-medium">Given</th>
                      <th className="px-16 pt-12 pb-4 text-right font-medium">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {found.vaccines.map((v, j) => (
                      <tr key={j} className="border-t border-surface-subtle">
                        <td className="px-16 py-8 font-medium">{v.name}</td>
                        <td className="py-8 text-right whitespace-nowrap text-text-secondary">{formatDay(v.given)}</td>
                        <td className="px-16 py-8 text-right whitespace-nowrap">{v.due ? formatDay(v.due, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {home.length > 0 && (
              <Card variant="list" className="mt-12 overflow-hidden">
                <p className="px-16 pt-12 pb-4 text-caption font-medium text-text-secondary">Medicines to give at home</p>
                <ul className="text-body-s">
                  {home.map((m, j) => (
                    <li key={j} className="border-t border-surface-subtle px-16 py-8">
                      <p className="font-medium text-text-primary">{m.name}</p>
                      {medLine(m) && <p className="text-text-secondary">{medLine(m)}</p>}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {clinic.length > 0 && <p className="mt-8 text-body-s text-text-secondary">Given at the clinic: {clinic.map((m) => m.name).join(', ')}.</p>}
          </section>
        )
      })}

      {paper.amount && <p className="mt-8 text-body-s text-text-secondary">Amount: {paper.amount}</p>}

      <div className="mt-16">
        <Button full icon="check" onClick={confirm} disabled={forms.some((f) => !f.name.trim())}>
          Looks right
        </Button>
      </div>
    </div>
  )
}

/** Times of day for a course of meds. */
const courseTimes = (perDay: number) => (perDay === 1 ? ['08:00'] : perDay === 2 ? ['08:00', '20:00'] : ['08:00', '14:00', '20:00'])

/** "½ tablet · twice a day · 10 days" — only what the paper says. */
const medLine = (m: PaperMed) => [m.dose, m.perDay && howOften(m.perDay), m.days && `${m.days} day${m.days === 1 ? '' : 's'}`].filter(Boolean).join(' · ')

/** Figma 8b / 10 / 8c: a short conversation — your phrase on the right, Boo's reply under it, then what to do. */
function YouSaid({ children }: { children: ReactNode }) {
  return <p className="ml-auto w-fit max-w-4/5 rounded-24 bg-surface-subtle px-16 py-8 text-body-s text-text-primary">{children}</p>
}

function BooSays({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-12">
      <BooCharacter look="mini" size={40} animated={false} />
      <p className="min-w-0 flex-1 pt-8 text-body text-text-primary">{children}</p>
    </div>
  )
}

function ResultView({ result, phrase, onBack, onPick }: { result: BooResult; phrase: string; onBack: () => void; onPick: (petIds: string[]) => void }) {
  const app = useApp()
  const { closeBoo, showToast } = useUi()
  const navigate = useNavigate()
  const said = phrase && <YouSaid>{phrase}</YouSaid>
  const call = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  if (result.kind === 'which-pet') {
    const pets = result.candidates.map((id) => petById(app.pets, id)).filter(Boolean) as Pet[]
    return (
      <div className="flex flex-col gap-16 pt-8">
        {said}
        <BooSays>Which pet is this for?</BooSays>
        <div className="grid grid-cols-3 gap-8">
          {pets.map((p) => (
            <PetTile key={p.id} pets={[p]} label={p.name} onClick={() => onPick([p.id])} />
          ))}
          {pets.length === 2 && <PetTile pets={pets} label="Both" onClick={() => onPick(pets.map((p) => p.id))} />}
        </div>
      </div>
    )
  }

  if (result.kind === 'red-flag') {
    const pet = result.petId ? petById(app.pets, result.petId) : undefined
    const vet = pet?.vet ?? app.pets.find((p) => p.vet)?.vet
    return (
      <div className="flex flex-col gap-16 pt-8">
        {said}
        <BooSays>That sounds worth a call to your vet today.</BooSays>
        <div className="flex flex-col gap-8">
          {vet && (
            <Button full size="large" icon="phone" onClick={() => call(vet.phone)}>
              Call {vet.name}
            </Button>
          )}
          {pet && (
            <Button
              full
              variant="ghost"
              onClick={() => {
                const id = newId('rec')
                app.addRecord({ id, petId: pet.id, type: 'health', date: today(), time: nowTime(), title: result.text.replace(/\.$/, ''), said: phrase || result.text })
                showToast(`Saved to ${pet.name}’s notes`, () => app.removeRecord(id))
                closeBoo()
              }}
            >
              I’ll watch {pet.name} — save it
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (result.kind === 'answer') {
    const pet = result.petId ? petById(app.pets, result.petId) : undefined
    const task = result.taskId ? app.tasks.find((t) => t.id === result.taskId) : undefined
    return (
      <div className="flex flex-col gap-16 pt-8">
        {said}
        <BooSays>{result.text}</BooSays>
        {result.source && (
          <Card variant="list" className="overflow-hidden">
            <ListRow
              icon="file-text"
              iconTone="soft"
              title={result.source.label}
              subtitle={result.source.detail}
              trailing="chevron"
              onClick={() => {
                closeBoo()
                navigate(result.source!.to)
              }}
            />
          </Card>
        )}
        {task ? (
          <div className="flex gap-8 [&>*]:flex-1">
            {pet?.vet && <Button onClick={() => call(pet.vet!.phone)}>Book vet</Button>}
            <Button
              variant="secondary"
              onClick={() => {
                // Remind me: the same reminder again tomorrow at 9:00
                const id = newId('task')
                app.addTask({ ...task, id, date: addDays(today(), 1), time: '09:00', remind: true, doneAt: undefined })
                showToast('Saved', () => app.removeTask(id))
                closeBoo()
              }}
            >
              Remind me
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={onBack} className="-ml-16 self-start">
            Ask something else
          </Button>
        )}
      </div>
    )
  }

  if (result.kind === 'symptom') {
    const pet = petById(app.pets, result.petId)!
    return <SymptomReview key={result.title} pet={pet} result={result} phrase={phrase} said={said} />
  }

  if (result.kind === 'meds') {
    const pets = (result.petIds ?? [result.petId]).map((id) => petById(app.pets, id)).filter(Boolean) as Pet[]
    const until = addDays(today(), result.days - 1)
    return (
      <div className="flex flex-col gap-16 pt-8">
        {said}
        <ReviewShell
          pets={pets}
          kind="New course of meds"
          title={result.name}
          onConfirm={() => {
            const times = courseTimes(result.perDay)
            for (const pet of pets) {
              const tasks: Task[] = []
              for (let i = 0; i < result.days; i++)
                for (const time of times) tasks.push({ id: newId('task'), petId: pet.id, kind: 'med', title: result.name, date: addDays(today(), i), time })
              app.addMed({ id: newId('med'), petId: pet.id, name: result.name, dose: result.dose, start: today(), until }, tasks, {
                id: newId('rec'),
                petId: pet.id,
                type: 'meds',
                date: today(),
                said: phrase || undefined,
                title: `Started ${result.name}`,
                detail: `${result.dose} for ${result.days} days`,
              })
            }
            showToast(`${result.name} added to ${pets.map((p) => p.name).join(' & ')}’s schedule`)
            closeBoo()
          }}
        >
          <p className="mt-8 text-body text-text-secondary">
            {result.dose} · {result.days} days · until {formatDay(until)}
          </p>
        </ReviewShell>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-16 pt-8">
      {said}
      <BooSays>I’m not sure what to do with that yet. Try “Cleo weighs 3.9 kg” or “When is Rocky’s rabies due?”.</BooSays>
      <Button variant="ghost" onClick={onBack} className="-ml-16 self-start">
        Back
      </Button>
    </div>
  )
}

/** Figma 8b pet tile: the photo (56) and the name; "Both" overlaps two photos. */
function PetTile({ pets, label, onClick }: { pets: Pet[]; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press panel-card flex min-h-control-64 flex-col items-center gap-8 rounded-24 py-16">
      <span className="flex">
        {pets.map((p, i) => (
          <span key={p.id} className={i > 0 ? '-ml-16' : ''}>
            <PetAvatar pet={p} size="md" outlined={pets.length > 1} />
          </span>
        ))}
      </span>
      <span className="text-body font-medium text-text-primary">{label}</span>
    </button>
  )
}

/** A symptom (Figma 9 · Review card): Boo's follow-up question with answers to tap, and a title that can be corrected. */
function SymptomReview({ pet, result, phrase, said }: { pet: Pet; result: Extract<BooResult, { kind: 'symptom' }>; phrase: string; said: ReactNode }) {
  const app = useApp()
  const { closeBoo, showToast } = useUi()
  const [title, setTitle] = useState(result.title)
  const [answers, setAnswers] = useState<(string | undefined)[]>([])
  const picked = answers.filter(Boolean) as string[]
  return (
    <div className="flex flex-col gap-16 pt-8">
      {said}
      <ReviewShell
        pets={[pet]}
        kind="Symptom"
        title={title}
        onTitle={setTitle}
        confirmDisabled={!title.trim()}
        onConfirm={() => {
          app.addRecord({
            id: newId('rec'),
            petId: pet.id,
            type: 'health',
            date: today(),
            time: nowTime(),
            title: title.trim(),
            said: phrase || undefined,
            question: result.question,
            ...(picked.length > 0 && { answers: picked, detail: answersLine(picked) }),
          })
          showToast(`Saved to ${pet.name}'s history`)
          closeBoo()
        }}
      >
        <p className="mt-12 text-body">{result.question}</p>
        <AnswerChips answers={answers} onAnswer={setAnswers} />
      </ReviewShell>
    </div>
  )
}

function ReviewShell({ pets, kind, title, onTitle, confirmDisabled, children, onConfirm }: { pets: Pet[]; kind: string; title: string; /** The title can be corrected before saving */ onTitle?: (title: string) => void; confirmDisabled?: boolean; children: ReactNode; onConfirm: () => void }) {
  return (
    <div className="pt-4">
      <div className="flex items-center gap-12">
        <span className="flex shrink-0">
          {pets.map((p, i) => (
            <span key={p.id} className={i > 0 ? '-ml-16' : ''}>
              <PetAvatar pet={p} size="md" outlined={pets.length > 1} />
            </span>
          ))}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body-s font-medium text-accent-primary">{kind}</p>
          {onTitle ? (
            <input
              aria-label="Title"
              value={title}
              onChange={(e) => onTitle(e.target.value)}
              className="w-full border-b border-border-control bg-transparent py-4 font-display text-title font-medium text-text-primary outline-none focus-visible:border-accent-primary"
            />
          ) : (
            <h2 className="font-display text-title font-medium">{title}</h2>
          )}
        </div>
      </div>
      {children}
      <div className="mt-16">
        <Button full icon="check" onClick={onConfirm} disabled={confirmDisabled}>
          Looks right
        </Button>
      </div>
    </div>
  )
}

/** Talk: listens until Done (lib/speech.ts: the iPhone's speech recognition, or the browser's). */
function Talk({ onDone, onNotHeard, onMicOff }: { onDone: (text: string) => void; onNotHeard: () => void; onMicOff: () => void }) {
  const [heard, setHeard] = useState('')
  const [supported, setSupported] = useState(canListen)
  const recRef = useRef<{ stop: () => void } | null>(null)
  // Listening starts once; it reads the latest callbacks through a ref
  const events = useRef({ onNotHeard, onMicOff })
  useEffect(() => {
    events.current = { onNotHeard, onMicOff }
  }, [onNotHeard, onMicOff])

  useEffect(() => {
    // Pet names help the phone hear "Milo" rather than "my low"
    const names = useApp.getState().pets.map((p) => p.name)
    recRef.current = listen(
      {
        onText: setHeard,
        onNothing: () => events.current.onNotHeard(),
        onDenied: () => events.current.onMicOff(),
        // In the iPhone app this is a passing failure (the audio didn't start): "I didn't catch that", try again.
        // A browser without speech recognition says it can't listen.
        onUnavailable: () => (Capacitor.isNativePlatform() ? events.current.onNotHeard() : setSupported(false)),
      },
      names,
    )
    return () => recRef.current?.stop()
  }, [])

  return (
    <div className="flex flex-col items-center py-24 text-center">
      <BooCharacter state={supported ? 'listening' : 'idle'} animated={supported} />
      {supported ? (
        <>
          <p className="mt-16 font-display text-title font-medium">Listening…</p>
          <p className="mt-8 min-h-control-44 text-body text-text-secondary">{heard || 'Say something like “Rocky threw up this morning”'}</p>
          <div className="mt-16 flex gap-8">
            <Button variant="ghost" onClick={() => onDone('')}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                recRef.current?.stop()
                if (heard.trim()) onDone(heard)
                else onNotHeard()
              }}
            >
              Done
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-16 font-display text-title font-medium">Voice works in the iPhone app</p>
          <p className="mt-8 text-body text-text-secondary">This browser can’t listen. Type to Boo instead.</p>
          <Button variant="secondary" onClick={() => onDone('')} className="mt-16">
            Type instead
          </Button>
        </>
      )}
    </div>
  )
}

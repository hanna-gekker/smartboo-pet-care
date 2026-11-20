// Boo: a bottom sheet over the current screen (not a chat). Talk · Snap a paper · Type → toast, review card or answer.
// Boo's "brain" is faked in lib/boo.ts until the Boo spike.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { newId, petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Pet, PetRecord, Task, Vaccine } from '../data/types'
import { readPaper, understand, type BooResult, type ParsedPaper } from '../lib/boo'
import { BOO_ERRORS, BooPaperError, type BooErrorCase } from '../lib/booErrors'
import { askPermission, openAppSettings, syncReminders } from '../lib/reminders'
import { addDays, formatDay, nowTime, today } from '../lib/dates'
import { convertWeight } from '../lib/weight'
import { BottomSheet } from './BottomSheet'
import { BooCharacter } from './BooCharacter'
import { BooError } from './BooError'
import { Button } from './Button'
import { Card } from './Card'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { PetAvatar } from './PetAvatar'
import { TextField } from './TextField'

type Step =
  | { name: 'menu' }
  | { name: 'type' }
  | { name: 'consent'; then: () => void }
  | { name: 'snap' }
  | { name: 'talk' }
  | { name: 'reading' }
  | { name: 'paper'; paper: ParsedPaper }
  | { name: 'remind'; petId: string; documentId: string; petName: string }
  | { name: 'notifications-off'; petId: string; petName: string }
  | { name: 'photo'; petId: string; petName: string }
  | { name: 'thinking' }
  | { name: 'result'; result: BooResult }
  | { name: 'error'; kind: BooErrorCase }

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
  const [step, setStep] = useState<Step>({ name: booStart } as Step)
  const [text, setText] = useState(booText)
  return <StepView step={step} setStep={setStep} text={text} setText={setText} />
}

function StepView({ step, setStep, text, setText }: { step: Step; setStep: (s: Step) => void; text: string; setText: (t: string) => void }) {
  const app = useApp()
  const { closeBoo, showToast, setPaperWaiting } = useUi()
  const navigate = useNavigate()

  /** Boo asks once before sending anything to the AI service. */
  const withConsent = (action: () => void) => {
    if (app.settings.booConsent) action()
    else setStep({ name: 'consent', then: action })
  }

  const startReading = () =>
    withConsent(() => {
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
    readPaper()
      .then((paper) => live && setStep({ name: 'paper', paper }))
      .catch((e: unknown) => {
        if (!live) return
        if (e instanceof BooPaperError) {
          if (e.kind === 'offline') setPaperWaiting(true)
          setStep({ name: 'error', kind: e.kind })
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
      const result = await understand(phrase, app)
      if (result.kind === 'weight' || result.kind === 'record') saveSimple(result)
      else setStep({ name: 'result', result })
    })
  }

  /** Simple records are saved right away, with "Saved · Undo". */
  const saveSimple = (result: Extract<BooResult, { kind: 'weight' | 'record' }>) => {
    const pet = petById(app.pets, result.petId)!
    const id = newId('rec')
    if (result.kind === 'weight') {
      const last = app.records.filter((r) => r.petId === pet.id && r.type === 'weight').sort((a, b) => b.date.localeCompare(a.date))[0]
      const value = convertWeight(result.value, result.unit, pet.weightUnit)
      app.addRecord({ id, petId: pet.id, type: 'weight', date: today(), time: nowTime(), title: 'Weight', value })
      const diff = last?.value !== undefined ? Math.round((value - last.value) * 10) / 10 : undefined
      const change = diff === undefined ? '' : diff === 0 ? ' · same as last time' : ` · ${diff > 0 ? '+' : '−'}${Math.abs(diff)} ${pet.weightUnit} since ${formatDay(last.date)}`
      showToast(`Saved · ${pet.name}, ${value} ${pet.weightUnit}${change}`, () => app.removeRecord(id))
    } else {
      app.addRecord({ id, petId: pet.id, type: result.type, date: today(), time: nowTime(), title: result.title })
      showToast(`Saved to ${pet.name}'s folder`, () => app.removeRecord(id))
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
        <div className="pt-8">
          <h2 className="font-display text-title font-medium">Before Boo reads anything</h2>
          <p className="mt-12 text-body leading-24 text-text-secondary">
            Boo sends your photo or words to an AI service to read them. Nothing is kept after that. Your records stay on this phone.
          </p>
          <p className="mt-12 text-body-s text-text-secondary">Boo keeps your pet’s records. It isn’t a vet.</p>
          <div className="mt-24 flex flex-col gap-8">
            <Button
              full
              onClick={() => {
                app.updateSettings({ booConsent: true })
                step.then()
              }}
            >
              Continue
            </Button>
            <Button full variant="ghost" onClick={() => setStep({ name: 'menu' })}>
              Not now
            </Button>
          </div>
        </div>
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
          <Button full variant="ghost" onClick={startReading} className="!text-accent-on-subtle">
            No paper at hand? Try a sample one
          </Button>
        </div>
      )

    case 'talk':
      return <Talk onDone={(t) => (t ? send(t) : setStep({ name: 'menu' }))} onNotHeard={() => setStep({ name: 'error', kind: 'not-heard' })} />

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
      }
      const [primary, secondary] = actions[step.kind]
      return <BooError input={e.input} message={e.message} primary={{ label: e.primary, onClick: primary }} secondary={{ label: e.secondary, onClick: secondary }} />
    }

    case 'reading':
      // Figma 6c: a paper being scanned and the review card it turns into
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Reading…" listening />
          <ReadingPicture />
        </div>
      )

    case 'thinking':
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Thinking…" listening />
        </div>
      )

    case 'paper':
      return (
        <PaperReview
          paper={step.paper}
          onConfirm={(petId, documentId, petName) => {
            navigator.vibrate?.(10)
            setStep({ name: 'remind', petId, documentId, petName })
          }}
        />
      )

    case 'remind':
      // Figma 6e
      return (
        <div className="flex flex-col gap-16">
          <SheetHeader title="Remind you 2 weeks before each one?" />
          <div className="flex flex-col gap-8">
            <Button
              full
              size="large"
              onClick={async () => {
                // The tasks are saved either way (they show in Schedule); only now does iOS ask for notifications
                const n = app.remindVaccines(step.petId, step.documentId)
                const next = { petId: step.petId, petName: step.petName }
                try {
                  if ((await askPermission()) !== 'granted') return setStep({ name: 'notifications-off', ...next })
                  const s = useApp.getState()
                  await syncReminders(s.tasks, s.pets, s.settings.remindDaysBefore)
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
          <SheetHeader title="Notifications are off" />
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
      return <ResultView result={step.result} onBack={() => setStep({ name: 'menu' })} onPick={(petId) => step.result.kind === 'which-pet' && send(`${petById(app.pets, petId)?.name} ${step.result.text}`)} />
  }
}

/** Boo and the question on top of the sheet (Figma "Header"). No name: there are no accounts. */
function BooHeader() {
  return (
    <div className="flex items-center gap-12">
      <BooCharacter size={56} />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="font-display text-title font-medium">What’s up?</p>
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
      <Card onClick={() => ref.current?.click()} className="!rounded-16 !bg-surface-card !shadow-none">
        <span className="flex items-center gap-16">
          <span className="flex size-control-40 shrink-0 items-center justify-center rounded-full bg-accent-primary-subtle text-accent-primary">
            <Icon name={icon} size={20} />
          </span>
          <span className="flex-1 text-body font-medium text-text-primary">{label}</span>
          <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary" />
        </span>
      </Card>
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

/** Figma "Header" of the first-launch sheets: the mini Boo (56) and the title, 12 apart. Listening while Boo works. */
function SheetHeader({ title, listening }: { title: string; listening?: boolean }) {
  return (
    <div className="flex items-center gap-12">
      <BooCharacter look="mini" size={56} state={listening ? 'listening' : 'idle'} />
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
      <div className="flex w-full flex-col gap-16 overflow-hidden rounded-24 bg-surface-panel p-16 ring-1 ring-inset ring-border-card">
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

/** Review card for a paper: everything Boo found, uncertain fields highlighted, "Looks right". */
function PaperReview({ paper, onConfirm }: { paper: ParsedPaper; onConfirm: (petId: string, documentId: string, petName: string) => void }) {
  const app = useApp()
  const [name, setName] = useState(paper.pet.name)
  const [breed, setBreed] = useState(paper.pet.breed)
  const [birthDate, setBirthDate] = useState(paper.pet.birthDate)
  const existing = app.pets.find((p) => p.name.toLowerCase() === name.trim().toLowerCase())

  const confirm = () => {
    const petId = existing?.id ?? newId('pet')
    const pet: Pet = existing ?? { id: petId, name: name.trim(), species: paper.pet.species, breed, birthDate, weightUnit: 'kg', allergies: [] }
    const documentId = newId('doc')
    const vaccines: Vaccine[] = paper.vaccines.map((v) => ({ id: newId('vax'), petId, documentId, ...v }))
    const records: PetRecord[] = [
      { id: newId('rec'), petId, type: 'document', date: paper.date, title: paper.title, detail: `${paper.clinic} · ${paper.amount}`, documentId },
      { id: newId('rec'), petId, type: 'vaccine', date: paper.date, title: `${paper.vaccines.map((v) => v.name.split(' (')[0]).join(', ')} given`, documentId },
    ]
    app.addPaper({ pet, isNewPet: !existing, document: { id: documentId, petId, title: paper.title, clinic: paper.clinic, date: paper.date }, vaccines, records })
    onConfirm(petId, documentId, pet.name)
  }

  return (
    <div>
      <p className="text-body-s font-medium text-accent-primary">Boo found</p>
      <h2 className="font-display text-title font-medium">
        {paper.title} · {formatDay(paper.date)}
      </h2>
      <p className="text-body-s text-text-secondary">{paper.clinic}</p>

      {existing ? (
        <p className="mt-16 rounded-16 bg-accent-primary-subtle p-12 text-body-s text-accent-primary">This goes into {existing.name}’s folder.</p>
      ) : (
        <p className="mt-16 text-body-s text-text-secondary">New pet — I’ll create a folder.</p>
      )}

      <div className="mt-12 grid grid-cols-2 gap-8">
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Species" value={paper.pet.species} readOnly />
        <TextField label="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
        <TextField label="Born" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} needsCheck={paper.unsure.includes('birthDate')} />
      </div>

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
            {paper.vaccines.map((v) => (
              <tr key={v.name} className="border-t border-surface-subtle">
                <td className="px-16 py-8 font-medium">{v.name}</td>
                <td className="py-8 text-right whitespace-nowrap text-text-secondary">{formatDay(v.given)}</td>
                <td className="px-16 py-8 text-right whitespace-nowrap">{formatDay(v.due, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-8 text-body-s text-text-secondary">Amount: {paper.amount}</p>

      <div className="mt-16">
        <Button full icon="check" onClick={confirm} disabled={!name.trim()}>
          Looks right
        </Button>
      </div>
    </div>
  )
}

function ResultView({ result, onBack, onPick }: { result: BooResult; onBack: () => void; onPick: (petId: string) => void }) {
  const app = useApp()
  const { closeBoo, showToast } = useUi()
  const navigate = useNavigate()

  if (result.kind === 'which-pet') {
    const pets = result.candidates.map((id) => petById(app.pets, id)).filter(Boolean) as Pet[]
    return (
      <div className="pt-8">
        <h2 className="font-display text-title font-medium">Which pet?</h2>
        <p className="mt-4 text-body-s text-text-secondary">“{result.text}”</p>
        <div className="mt-16 flex flex-wrap gap-8">
          {pets.map((p) => (
            <button key={p.id} type="button" onClick={() => onPick(p.id)} className="press flex min-h-control-44 items-center gap-8 rounded-full bg-surface-card py-4 pr-16 pl-4 ring-1 ring-inset ring-border-control active:bg-surface-subtle">
              <PetAvatar pet={p} size="sm" />
              <span className="text-body font-medium">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (result.kind === 'answer') {
    return (
      <div className="pt-8">
        <p className="text-body-l leading-24">{result.text}</p>
        {result.source && (
          <button
            type="button"
            onClick={() => {
              closeBoo()
              navigate(`/pets/${result.source!.petId}`)
            }}
            className="press mt-12 flex min-h-control-44 items-center gap-4 rounded-full text-body font-medium text-accent-primary"
          >
            {result.source.label}
            <Icon name="chevron-right" size={20} />
          </button>
        )}
        <Button variant="ghost" onClick={onBack} className="mt-16 -ml-16">
          Ask something else
        </Button>
      </div>
    )
  }

  if (result.kind === 'symptom') {
    const pet = petById(app.pets, result.petId)!
    return (
      <ReviewShell
        pet={pet}
        kind="Symptom"
        title={result.title}
        onConfirm={() => {
          app.addRecord({ id: newId('rec'), petId: pet.id, type: 'health', date: today(), time: nowTime(), title: result.title })
          showToast(`Saved to ${pet.name}'s history`)
          closeBoo()
        }}
      >
        <p className="mt-12 text-body">{result.question}</p>
        <div className="mt-8 flex gap-8">
          <span className="rounded-full bg-surface-canvas px-12 py-4 text-body-s ring-1 ring-surface-subtle">Once</span>
          <span className="rounded-full bg-surface-canvas px-12 py-4 text-body-s ring-1 ring-surface-subtle">Eating fine</span>
        </div>
      </ReviewShell>
    )
  }

  if (result.kind === 'meds') {
    const pet = petById(app.pets, result.petId)!
    const until = addDays(today(), result.days - 1)
    return (
      <ReviewShell
        pet={pet}
        kind="New course of meds"
        title={result.name}
        onConfirm={() => {
          const times = result.perDay === 1 ? ['08:00'] : result.perDay === 2 ? ['08:00', '20:00'] : ['08:00', '14:00', '20:00']
          const tasks: Task[] = []
          for (let i = 0; i < result.days; i++)
            for (const time of times) tasks.push({ id: newId('task'), petId: pet.id, kind: 'med', title: result.name, date: addDays(today(), i), time })
          app.addMed({ id: newId('med'), petId: pet.id, name: result.name, dose: result.dose, until }, tasks, {
            id: newId('rec'),
            petId: pet.id,
            type: 'meds',
            date: today(),
            title: `Started ${result.name}`,
            detail: `${result.dose} for ${result.days} days`,
          })
          showToast(`${result.name} added to ${pet.name}'s schedule`)
          closeBoo()
        }}
      >
        <p className="mt-8 text-body text-text-secondary">
          {result.dose} · {result.days} days · until {formatDay(until)}
        </p>
      </ReviewShell>
    )
  }

  return (
    <div className="pt-8">
      <p className="text-body-l leading-24">I’m not sure what to do with that yet. Try “Cleo weighs 3.9 kg” or “When is Rocky’s rabies due?”.</p>
      <Button variant="ghost" onClick={onBack} className="mt-16 -ml-16">
        Back
      </Button>
    </div>
  )
}

function ReviewShell({ pet, kind, title, children, onConfirm }: { pet: Pet; kind: string; title: string; children: ReactNode; onConfirm: () => void }) {
  return (
    <div className="pt-4">
      <div className="flex items-center gap-12">
        <PetAvatar pet={pet} size="md" />
        <div>
          <p className="text-body-s font-medium text-accent-primary">{kind}</p>
          <h2 className="font-display text-title font-medium">{title}</h2>
        </div>
      </div>
      {children}
      <div className="mt-16">
        <Button full icon="check" onClick={onConfirm}>
          Looks right
        </Button>
      </div>
    </div>
  )
}

/** Talk: on the iPhone this uses on-device speech (step 05). In the browser: Web Speech API where available. */
function Talk({ onDone, onNotHeard }: { onDone: (text: string) => void; onNotHeard: () => void }) {
  const [heard, setHeard] = useState('')
  const [supported, setSupported] = useState(() => Boolean(speechRecognition()))
  const recRef = useRef<{ stop: () => void } | null>(null)
  // The recogniser starts once; it reads the latest callback through a ref
  const notHeard = useRef(onNotHeard)
  useEffect(() => {
    notHeard.current = onNotHeard
  }, [onNotHeard])

  useEffect(() => {
    const Rec = speechRecognition()
    if (!Rec) return
    const rec = new Rec()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => setHeard(Array.from(e.results).map((r) => r[0].transcript).join(' '))
    // Nothing heard → Boo says so (Figma 8i); any other error means the browser can't listen
    rec.onerror = (e) => (e?.error === 'no-speech' ? notHeard.current() : setSupported(false))
    rec.start()
    recRef.current = rec
    return () => rec.stop()
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

function speechRecognition() {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => SpeechRec) | undefined
}

type SpeechRec = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void
  onerror: (e?: { error?: string }) => void
  start: () => void
  stop: () => void
}

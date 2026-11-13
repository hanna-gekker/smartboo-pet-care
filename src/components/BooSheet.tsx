// Boo: a bottom sheet over the current screen (not a chat). Talk · Snap a paper · Type → toast, review card or answer.
// Boo's "brain" is faked in lib/boo.ts until the Boo spike.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { newId, petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Pet, PetRecord, Task, Vaccine } from '../data/types'
import { readPaper, understand, type BooResult, type ParsedPaper } from '../lib/boo'
import { addDays, formatDay, today } from '../lib/dates'
import { BottomSheet } from './BottomSheet'
import { BooCharacter } from './BooCharacter'
import { Button } from './Button'
import { Card } from './Card'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { PetAvatar } from './PetAvatar'
import { TextField } from './TextField'

type Step =
  | { name: 'menu' }
  | { name: 'consent'; then: () => void }
  | { name: 'snap' }
  | { name: 'talk' }
  | { name: 'reading' }
  | { name: 'paper'; paper: ParsedPaper }
  | { name: 'remind'; petId: string; documentId: string; petName: string }
  | { name: 'photo'; petId: string; petName: string }
  | { name: 'thinking' }
  | { name: 'result'; result: BooResult }

export function BooSheet() {
  const { booOpen, booSession, closeBoo } = useUi()
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
  const [step, setStep] = useState<Step>(booStart === 'snap' ? { name: 'snap' } : booStart === 'talk' ? { name: 'talk' } : { name: 'menu' })
  const [text, setText] = useState(booText)
  return <StepView step={step} setStep={setStep} text={text} setText={setText} />
}

function StepView({ step, setStep, text, setText }: { step: Step; setStep: (s: Step) => void; text: string; setText: (t: string) => void }) {
  const app = useApp()
  const { closeBoo, showToast } = useUi()
  const navigate = useNavigate()

  /** Boo asks once before sending anything to the AI service. */
  const withConsent = (action: () => void) => {
    if (app.settings.booConsent) action()
    else setStep({ name: 'consent', then: action })
  }

  const startReading = () =>
    withConsent(async () => {
      setStep({ name: 'reading' })
      const paper = await readPaper()
      setStep({ name: 'paper', paper })
    })

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
      const value = result.unit === pet.weightUnit ? result.value : result.unit === 'g' ? result.value / 1000 : result.value * 1000
      app.addRecord({ id, petId: pet.id, type: 'weight', date: today(), title: 'Weight', value })
      const diff = last?.value !== undefined ? Math.round((value - last.value) * 10) / 10 : undefined
      const change = diff === undefined ? '' : diff === 0 ? ' · same as last time' : ` · ${diff > 0 ? '+' : '−'}${Math.abs(diff)} ${pet.weightUnit} since ${formatDay(last.date)}`
      showToast(`Saved · ${pet.name}, ${value} ${pet.weightUnit}${change}`, () => app.removeRecord(id))
    } else {
      app.addRecord({ id, petId: pet.id, type: result.type, date: today(), title: result.title })
      showToast(`Saved to ${pet.name}'s folder`, () => app.removeRecord(id))
    }
    navigator.vibrate?.(10)
    setText('')
    closeBoo()
  }

  switch (step.name) {
    case 'menu':
      return (
        <div>
          <div className="flex items-center gap-12 pt-4 pb-16">
            <BooCharacter size={56} />
            <div>
              <p className="font-display text-title font-medium">What happened?</p>
              <p className="text-body-s text-text-secondary">Tell me, or hand me a vet paper.</p>
            </div>
          </div>
          <form
            className="flex items-center gap-8 rounded-full bg-surface-canvas py-4 pr-4 pl-16 ring-1 ring-inset ring-border-control focus-within:ring-2 focus-within:ring-text-primary"
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="“Cleo weighs 3.9 kg”"
              aria-label="Type to Boo"
              className="min-h-control-44 flex-1 bg-transparent text-body outline-none placeholder:text-text-tertiary"
            />
            <IconButton type="submit" variant="primary" icon="send" label="Send" disabled={!text.trim()} />
          </form>
          <div className="mt-16 grid grid-cols-3 gap-8">
            <BigAction icon="mic" label="Talk" onClick={() => setStep({ name: 'talk' })} />
            <BigAction icon="camera" label="Snap a paper" onClick={() => setStep({ name: 'snap' })} />
            <BigAction icon="keyboard" label="Type" onClick={() => (document.querySelector('[aria-label="Type to Boo"]') as HTMLInputElement | null)?.focus()} />
          </div>
          <div className="swipe-row -mx-16 mt-16 flex gap-8 px-16">
            {['Cleo weighs 3.9 kg', 'Rocky threw up', "When is Rocky's rabies due?", 'Ear drops twice a day for 10 days'].map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="press min-h-control-44 shrink-0 rounded-full bg-accent-primary-subtle px-16 text-body-s text-accent-primary">
                {s}
              </button>
            ))}
          </div>
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
      return (
        <div className="pt-4">
          <h2 className="font-display text-title font-medium">Snap a vet paper</h2>
          <p className="mt-4 text-body text-text-secondary">Vaccine certificate, invoice, discharge notes — a photo or a PDF.</p>
          <div className="mt-16 flex flex-col gap-8">
            <FilePick icon="camera" label="Take a photo" accept="image/*" capture onPick={startReading} />
            <FilePick icon="doc" label="Choose from Photos" accept="image/*" onPick={startReading} />
            <FilePick icon="doc" label="PDF from Files" accept="application/pdf" onPick={startReading} />
          </div>
          <Button full variant="ghost" onClick={startReading} className="mt-12 !text-accent-primary">
            No paper at hand? Try a sample one
          </Button>
        </div>
      )

    case 'talk':
      return <Talk onDone={(t) => (t ? send(t) : setStep({ name: 'menu' }))} />

    case 'reading':
    case 'thinking':
      return (
        <div className="flex flex-col items-center py-32 text-center">
          <BooCharacter state="listening" />
          <p className="mt-16 font-display text-title font-medium">{step.name === 'reading' ? 'Reading…' : 'Thinking…'}</p>
          {step.name === 'reading' && <p className="mt-4 text-body-s text-text-secondary">Finding the pet, vaccines and dates</p>}
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
      return (
        <div className="pt-8">
          <h2 className="font-display text-title font-medium">Remind you 2 weeks before each one?</h2>
          <p className="mt-8 text-body text-text-secondary">I’ll nudge you before {step.petName}’s vaccines are due.</p>
          <div className="mt-24 flex flex-col gap-8">
            <Button
              full
              onClick={() => {
                // On the phone this is where iOS asks for notification permission (step 05).
                const n = app.remindVaccines(step.petId, step.documentId)
                showToast(`${n} reminder${n === 1 ? '' : 's'} set`)
                setStep({ name: 'photo', petId: step.petId, petName: step.petName })
              }}
            >
              Yes, remind me
            </Button>
            <Button full variant="ghost" onClick={() => setStep({ name: 'photo', petId: step.petId, petName: step.petName })}>
              Not now
            </Button>
          </div>
        </div>
      )

    case 'photo': {
      const finish = () => {
        closeBoo()
        navigate('/')
      }
      const pet = petById(app.pets, step.petId)
      return (
        <div className="pt-8">
          <div className="flex justify-center py-8">
            <PetAvatar pet={pet} size="xl" />
          </div>
          <h2 className="mt-12 text-center font-display text-title font-medium">Add a photo of {step.petName}?</h2>
          <div className="mt-24 flex flex-col gap-8">
            {pet?.photo ? (
              <Button full onClick={finish}>
                Done
              </Button>
            ) : (
              <FilePick
                icon="camera"
                label="Take photo"
                accept="image/*"
                capture
                primary
                onPick={(file) => {
                  if (file) app.updatePet(step.petId, { photo: URL.createObjectURL(file) })
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

function BigAction({ icon, label, onClick }: { icon: 'mic' | 'camera' | 'keyboard'; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press flex min-h-control-64 flex-col items-center justify-center gap-4 rounded-24 bg-surface-canvas py-12 text-body-s font-medium active:bg-surface-subtle">
      <span className="flex size-control-40 items-center justify-center rounded-full bg-accent-primary text-text-on-accent">
        <Icon name={icon} size={20} />
      </span>
      {label}
    </button>
  )
}

function FilePick({ icon, label, accept, capture, primary, onPick }: { icon: 'camera' | 'doc'; label: string; accept: string; capture?: boolean; primary?: boolean; onPick: (file?: File) => void }) {
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
      <Button full variant={primary ? 'primary' : 'secondary'} icon={icon} onClick={() => ref.current?.click()}>
        {label}
      </Button>
    </>
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
            className="press mt-12 flex min-h-control-44 items-center gap-4 text-body font-medium text-accent-primary"
          >
            {result.source.label}
            <Icon name="chevron" size={20} />
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
          app.addRecord({ id: newId('rec'), petId: pet.id, type: 'health', date: today(), title: result.title })
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
function Talk({ onDone }: { onDone: (text: string) => void }) {
  const [heard, setHeard] = useState('')
  const [supported, setSupported] = useState(() => Boolean(speechRecognition()))
  const recRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    const Rec = speechRecognition()
    if (!Rec) return
    const rec = new Rec()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => setHeard(Array.from(e.results).map((r) => r[0].transcript).join(' '))
    rec.onerror = () => setSupported(false)
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
                onDone(heard)
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
  onerror: () => void
  start: () => void
  stop: () => void
}

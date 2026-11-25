import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { BooHint } from '../components/BooHint'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { ColorSwatches } from '../components/ColorSwatches'
import { PetAvatar } from '../components/PetAvatar'
import { SpeciesTile } from '../components/SpeciesTile'
import { StepBar } from '../components/StepBar'
import { TextField } from '../components/TextField'
import { Chip, StackScreen } from '../components/ui'
import { newId, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Pet, PetColor, Species, WeightUnit } from '../data/types'
import { ageLong, nowTime, today } from '../lib/dates'
import { pickPetColor, SPECIES_COLOR } from '../lib/petColors'
import { getsVaccines, POPULAR_BREEDS, SPECIES, speciesLabel } from '../lib/species'
import { getsWeighed, weightUnits } from '../lib/weight'

type Step = 'species' | 'name' | 'breed' | 'birthday' | 'weight' | 'done'

const NOT_SURE = "I'm not sure"

/**
 * Figma "Add your pet · step by step" (A1–A6): one question per screen, the steps follow the species.
 * Species → name, photo and frame colour → breed (kind, for fish) → birthday → weight (not for fish) → all set.
 */
export function AddPet() {
  const navigate = useNavigate()
  const openBoo = useUi((s) => s.openBoo)
  const { pets, addPet, addRecord } = useApp()
  const isFirst = pets.length === 0

  const [step, setStep] = useState<Step>('species')
  const [species, setSpecies] = useState<Species>()
  const [name, setName] = useState('')
  const [color, setColor] = useState<PetColor>('ocean')
  const [noFrame, setNoFrame] = useState(false)
  const [photo, setPhoto] = useState<string>()
  const [breed, setBreed] = useState('')
  const [notSure, setNotSure] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [noDate, setNoDate] = useState(false)
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<WeightUnit>('lb')
  const [saved, setSaved] = useState<Pet>()
  const [savedWeight, setSavedWeight] = useState(0)
  const [hint, setHint] = useState(true)
  const photoInput = useRef<HTMLInputElement>(null)

  const flow: Step[] = ['species', 'name', 'breed', 'birthday', ...(species && !getsWeighed(species) ? [] : (['weight'] as Step[]))]
  const index = flow.indexOf(step)
  const last = index === flow.length - 1
  const pet: Pet = { id: saved?.id ?? 'new-pet', name: name.trim() || 'Your pet', species: species ?? 'other', color, noFrame: noFrame || undefined, photo, weightUnit: unit, allergies: [] }
  const petName = name.trim()

  const pickSpecies = (s: Species) => {
    setSpecies(s)
    setColor(pickPetColor(s, pets))
    setUnit(weightUnits(s)[0])
    setBreed('')
    setNotSure(false)
  }

  const save = (skipWeight = false) => {
    const final: Pet = {
      ...pet,
      id: newId('pet'),
      name: petName,
      breed: notSure ? undefined : breed.trim() || undefined,
      birthDate: noDate ? undefined : birthDate || undefined,
    }
    addPet(final)
    const value = skipWeight || step !== 'weight' ? 0 : parseFloat(weight.replace(',', '.'))
    if (value > 0) addRecord({ id: newId('rec'), petId: final.id, type: 'weight', date: today(), time: nowTime(), title: 'Weight', value })
    setSaved(final)
    setSavedWeight(value > 0 ? value : 0)
    setStep('done')
  }

  const next = () => (last ? save() : setStep(flow[index + 1]))
  const back = () => (index > 0 ? setStep(flow[index - 1]) : navigate(-1))
  const finish = () => navigate(isFirst ? '/' : `/pets/${saved!.id}`, { replace: true })

  // Step 6: the pet's card and, for species that get vaccines, Boo asks for the last vet paper
  if (step === 'done' && saved) {
    const stats = [
      saved.breed && { value: saved.breed, label: saved.species === 'fish' ? 'Type' : 'Breed' },
      saved.birthDate && { value: ageLong(saved.birthDate), label: 'Age' },
      savedWeight > 0 && { value: `${savedWeight} ${saved.weightUnit}`, label: 'Weight' },
    ].filter(Boolean) as { value: string; label: string }[]
    return (
      <StackScreen
        title="Add your pet"
        back={false}
        withTabBar={false}
        footer={
          <Button full size="large" onClick={finish}>
            Done
          </Button>
        }
      >
        <div className="mt-16 flex flex-col gap-16">
          <Card className="p-24">
            <div className="flex flex-col items-center gap-16 text-center">
              <PetAvatar pet={saved} size="card" petals={saved.color} />
              <div className="flex flex-col gap-8">
                <h2 className="font-display text-title font-medium">{saved.name} is all set</h2>
                <p className="text-body-s text-text-secondary">{speciesLabel(saved.species)}</p>
              </div>
              {stats.length > 0 && (
                <dl className="flex w-full items-center justify-center">
                  {stats.map((s, i) => (
                    <div key={s.label} className={`flex min-w-0 flex-1 flex-col gap-2 px-8 ${i > 0 ? 'border-l border-border-card' : ''}`}>
                      <dd className="truncate text-body font-medium text-text-primary">{s.value}</dd>
                      <dt className="order-last text-caption text-text-secondary">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </Card>
          {hint && getsVaccines(saved.species) && (
            <BooHint
              pose="happy"
              actions={
                <>
                  <Button
                    onClick={() => {
                      finish()
                      openBoo('snap')
                    }}
                  >
                    Snap a vet paper
                  </Button>
                  <Button variant="ghost" onClick={() => setHint(false)}>
                    Not now
                  </Button>
                </>
              }
            >
              I don’t know {saved.name}’s shots yet. Snap the last vet paper?
            </BooHint>
          )}
        </div>
      </StackScreen>
    )
  }

  const canGoOn = step === 'species' ? Boolean(species) : step === 'name' ? Boolean(petName) : step === 'birthday' ? noDate || Boolean(birthDate) : true
  const optional = step === 'breed' || step === 'weight'
  const popular = species ? (POPULAR_BREEDS[species] ?? []) : []
  const isFish = species === 'fish'

  return (
    <StackScreen
      title="Add your pet"
      withTabBar={false}
      onBack={back}
      footer={
        <div className="flex flex-col items-center">
          {optional && (
            <button
              type="button"
              onClick={() => {
                if (step === 'breed') {
                  setBreed('')
                  setNotSure(false)
                }
                if (last) save(true)
                else setStep(flow[index + 1])
              }}
              className="press min-h-control-44 rounded-full px-16 text-body font-medium text-accent-on-subtle"
            >
              Skip
            </button>
          )}
          <Button full size="large" disabled={!canGoOn} onClick={() => next()}>
            {last ? 'Save pet' : 'Next'}
          </Button>
          <button type="button" onClick={() => openBoo('talk')} className="press min-h-control-44 rounded-full px-16 text-body-s font-medium text-accent-on-subtle">
            Or just tell Boo
          </button>
        </div>
      }
    >
      {/* Figma: Progress, Heading, Body — 16 apart; the blocks inside a step's Body are 24 apart */}
      <div className="mt-16 flex flex-col gap-16">
        <StepBar steps={flow.length} current={index + 1} />

        {step === 'species' && (
          <>
            <Question title="Who's joining the family?" sub="Pick one. You can add more pets later." />
            <div className="flex flex-col gap-24">
              <div role="radiogroup" aria-label="Species" className="grid grid-cols-4 gap-8">
                {SPECIES.map((s) => (
                  <SpeciesTile key={s} species={s} label={speciesLabel(s)} color={SPECIES_COLOR[s]} selected={s === species} onSelect={() => pickSpecies(s)} />
                ))}
              </div>
            </div>
          </>
        )}

        {step === 'name' && (
          <>
            <Question title="What's their name?" />
            <div className="flex flex-col gap-24">
              <div className="mt-8 flex flex-col items-center gap-12">
                <PetAvatar pet={pet} size="hero" petals={color} onAddPhoto={() => photoInput.current?.click()} />
                <button type="button" onClick={() => photoInput.current?.click()} className="press -my-12 min-h-control-44 rounded-full px-16 text-body-s font-medium text-accent-on-subtle">
                  {photo ? 'Change photo' : 'Add a photo'}
                </button>
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setPhoto(URL.createObjectURL(file))
                  }}
                />
              </div>
              <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
              <Card className="p-16">
                <p className="mb-8 text-caption font-medium text-text-secondary">Frame colour</p>
                <ColorSwatches
                  label="Frame colour"
                  allowNone
                  value={noFrame ? 'none' : color}
                  onChange={(c) => {
                    setNoFrame(c === 'none')
                    if (c !== 'none') setColor(c)
                  }}
                />
              </Card>
            </div>
          </>
        )}

        {step === 'breed' && (
          <>
            <Question title={isFish ? 'What kind of fish?' : 'Do you know the breed?'} sub="Optional. You can change it later." />
            <div className="flex flex-col gap-24">
              {!popular.length || species === 'dog' ? (
                <TextField label="Breed" placeholder="Search breeds" value={notSure ? '' : breed} onChange={(e) => { setBreed(e.target.value); setNotSure(false) }} autoComplete="off" />
              ) : null}
              <div className="flex flex-col gap-8">
                {species === 'dog' && <p className="text-caption text-text-secondary">Popular</p>}
                <div role="radiogroup" aria-label={isFish ? 'Kind of fish' : 'Breed'} className="flex flex-wrap gap-8">
                  {popular
                    .filter((b) => species !== 'dog' || !breed || notSure || popular.includes(breed) || b.toLowerCase().includes(breed.toLowerCase()))
                    .map((b) => (
                      <Chip key={b} role="radio" active={!notSure && breed === b} onClick={() => { setBreed(b); setNotSure(false) }}>
                        {b}
                      </Chip>
                    ))}
                  <Chip role="radio" active={notSure} onClick={() => { setNotSure(true); setBreed('') }}>
                    {NOT_SURE}
                  </Chip>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'birthday' && (
          <>
            <Question title={`When was ${petName} born?`} />
            <div className="flex flex-col gap-24">
              <div className="flex flex-col gap-8">
                <TextField label="Date of birth" type="date" max={today()} value={noDate ? '' : birthDate} disabled={noDate} onChange={(e) => setBirthDate(e.target.value)} />
                <label className="-ml-12 flex items-center gap-4 text-body text-text-primary">
                  <Checkbox checked={noDate} label="I don't know the exact date" onChange={setNoDate} />
                  <span aria-hidden="true">I don't know the exact date</span>
                </label>
                <p className="text-caption text-text-secondary">If unsure, Boo asks for an approximate age instead.</p>
              </div>
            </div>
          </>
        )}

        {step === 'weight' && species && (
          <>
            <Question title={`How much does ${petName} weigh?`} sub={unit === 'g' || unit === 'oz' ? 'Optional. Small pets are weighed in grams.' : 'Optional. Helps Boo track changes.'} />
            <div className="flex flex-col gap-24">
              <div className="flex flex-col gap-12">
                <TextField label="Weight" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} autoComplete="off" />
                <div role="radiogroup" aria-label="Unit" className="flex gap-8">
                  {weightUnits(species).map((u) => (
                    <Chip key={u} role="radio" active={unit === u} onClick={() => setUnit(u)}>
                      {u}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StackScreen>
  )
}

/** The step's question (SB/Title) with an optional grey line under it. */
function Question({ title, sub }: { title: string; sub?: string }) {
  return (
    // Figma "Heading": 8 on top, the title, 6, the line under it
    <div className="flex flex-col gap-6 pt-8">
      <h2 className="font-display text-title font-medium">{title}</h2>
      {sub && <p className="text-body-s text-text-secondary">{sub}</p>}
    </div>
  )
}

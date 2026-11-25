import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ColorSwatches } from '../components/ColorSwatches'
import { PetAvatar } from '../components/PetAvatar'
import { TextField } from '../components/TextField'
import { StackScreen } from '../components/ui'
import { newId, petById, useApp } from '../data/useApp'
import type { Pet, Species, Vet } from '../data/types'
import { petColor } from '../lib/petColors'
import { SPECIES, speciesLabel } from '../lib/species'

/** Add your pet (new) or Edit profile (existing). */
export function PetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pets, settings, addPet, updatePet } = useApp()
  const existing = id ? petById(pets, id) : undefined
  const isFirst = pets.length === 0

  const [pet, setPet] = useState<Pet>(
    existing ?? { id: newId('pet'), name: '', species: 'dog', breed: '', birthDate: '', weightUnit: 'kg', allergies: [] },
  )
  const [allergies, setAllergies] = useState(pet.allergies.join(', '))
  const photoInput = useRef<HTMLInputElement>(null)
  const set = (patch: Partial<Pet>) => setPet((p) => ({ ...p, ...patch }))

  const save = () => {
    const final: Pet = {
      ...pet,
      name: pet.name.trim(),
      // An edit keeps the unit the weights were logged in
      weightUnit: existing ? pet.weightUnit : ['dog', 'cat'].includes(pet.species) ? 'kg' : 'g',
      allergies: allergies.split(',').map((a) => a.trim()).filter(Boolean),
    }
    if (existing) {
      updatePet(existing.id, final)
      navigate(-1)
    } else {
      addPet(final)
      navigate(isFirst ? '/' : `/pets/${final.id}`, { replace: true })
    }
  }

  // Vet: one of your vets (from the pets and Settings), or none; "Add a vet…" opens Settings → Add a vet
  const allVets = [...new Map([...pets.map((p) => p.vet), ...(settings.vets ?? [])].filter((v): v is Vet => !!v?.name).map((v) => [v.name, v])).values()]
  const vetLabel = (v: Vet) => [v.name, v.clinic].filter(Boolean).join(' · ')

  return (
    <StackScreen title={existing ? `Edit ${existing.name}` : 'Add your pet'} withTabBar={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="mt-16 flex flex-col gap-16"
      >
        <button type="button" onClick={() => photoInput.current?.click()} className="press mx-auto flex flex-col items-center gap-8 rounded-24">
          <PetAvatar pet={pet.name ? pet : undefined} size="hero" petals={pet.color ?? (existing ? petColor(existing, pets) : undefined)} />
          <span className="text-body font-medium text-accent-primary">{pet.photo ? 'Change photo' : 'Add a photo'}</span>
        </button>
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            // On the phone the photo is saved as a file next to the data (step 05). In the browser it lives until reload.
            if (file) set({ photo: URL.createObjectURL(file) })
          }}
        />

        {/* Figma 14: the frame colour on its own card */}
        <Card>
          <p className="mb-8 text-caption font-medium text-text-secondary">Frame colour</p>
          <ColorSwatches
            label="Frame colour"
            allowNone
            value={pet.noFrame ? 'none' : (pet.color ?? (existing ? petColor(existing, pets) : 'ocean'))}
            onChange={(c) => set(c === 'none' ? { noFrame: true } : { color: c, noFrame: false })}
          />
        </Card>

        <Card className="flex flex-col gap-8">
          <TextField label="Name" required value={pet.name} onChange={(e) => set({ name: e.target.value })} placeholder="Rocky" autoComplete="off" />
          <TextField
            label="Species"
            value={pet.species}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => set({ species: e.target.value as Species })}
            options={SPECIES.map((s) => ({ value: s, label: speciesLabel(s) }))}
          />
          <TextField label="Breed" value={pet.breed ?? ''} onChange={(e) => set({ breed: e.target.value })} placeholder="Beagle" />
          <TextField label="Date of birth" type="date" trailingIcon="calendar" value={pet.birthDate ?? ''} onChange={(e) => set({ birthDate: e.target.value })} />
          {existing && (
            <>
              <TextField label="Microchip" value={pet.microchip ?? ''} onChange={(e) => set({ microchip: e.target.value })} />
              <TextField label="Insurance" value={pet.insurance ?? ''} onChange={(e) => set({ insurance: e.target.value })} />
              <TextField
                label="Vet"
                value={pet.vet?.name ?? ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  if (e.target.value === '+add') navigate('/settings/vet')
                  else set({ vet: allVets.find((v) => v.name === e.target.value) })
                }}
                options={[{ value: '', label: '—' }, ...allVets.map((v) => ({ value: v.name, label: vetLabel(v) })), { value: '+add', label: 'Add a vet…' }]}
              />
              <TextField label="Allergies (comma-separated)" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </>
          )}
        </Card>

        <Button type="submit" full size="large" disabled={!pet.name.trim()}>
          {existing ? 'Save' : `Add ${pet.name.trim() || 'pet'}`}
        </Button>
        {!existing && <p className="text-center text-body-s text-text-secondary">Papers can come later — just hand them to Boo.</p>}
      </form>
    </StackScreen>
  )
}

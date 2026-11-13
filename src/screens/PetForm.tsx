import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import { PetAvatar } from '../components/PetAvatar'
import { TextField } from '../components/TextField'
import { StackScreen } from '../components/ui'
import { newId, petById, useApp } from '../data/useApp'
import type { Pet, Species } from '../data/types'

const SPECIES: Species[] = ['dog', 'cat', 'small mammal', 'bird', 'reptile', 'fish', 'other']

/** Add your pet (new) or Edit profile (existing). */
export function PetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pets, addPet, updatePet } = useApp()
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
      weightUnit: ['dog', 'cat'].includes(pet.species) ? 'kg' : 'g',
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

  return (
    <StackScreen title={existing ? 'Edit profile' : 'Add your pet'} withTabBar={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="mt-16 flex flex-col gap-8"
      >
        <button type="button" onClick={() => photoInput.current?.click()} className="press mx-auto mb-8 flex flex-col items-center gap-8">
          <PetAvatar pet={pet.name ? pet : undefined} size="hero" />
          <span className="text-body-s font-medium text-accent-primary">{pet.photo ? 'Change photo' : 'Add a photo'}</span>
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

        <TextField label="Name" required value={pet.name} onChange={(e) => set({ name: e.target.value })} placeholder="Rocky" autoComplete="off" />
        <TextField
          label="Species"
          value={pet.species}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => set({ species: e.target.value as Species })}
          options={SPECIES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
        />
        <TextField label="Breed" value={pet.breed ?? ''} onChange={(e) => set({ breed: e.target.value })} placeholder="Labrador Retriever" />
        <TextField label="Date of birth" type="date" value={pet.birthDate ?? ''} onChange={(e) => set({ birthDate: e.target.value })} />
        {existing && (
          <>
            <TextField label="Allergies (comma-separated)" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            <TextField label="Microchip" value={pet.microchip ?? ''} onChange={(e) => set({ microchip: e.target.value })} />
            <TextField label="Insurance" value={pet.insurance ?? ''} onChange={(e) => set({ insurance: e.target.value })} />
            <TextField label="Vet name" value={pet.vet?.name ?? ''} onChange={(e) => set({ vet: { name: e.target.value, phone: pet.vet?.phone ?? '' } })} />
            <TextField label="Vet phone" type="tel" value={pet.vet?.phone ?? ''} onChange={(e) => set({ vet: { name: pet.vet?.name ?? '', phone: e.target.value } })} />
          </>
        )}

        <div className="mt-16">
          <Button type="submit" full size="large" disabled={!pet.name.trim()}>
            {existing ? 'Save' : `Add ${pet.name.trim() || 'pet'}`}
          </Button>
        </div>
        {!existing && <p className="text-center text-body-s text-text-secondary">Papers can come later — just hand them to Boo.</p>}
      </form>
    </StackScreen>
  )
}

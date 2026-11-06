import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Field, PetAvatar, StackScreen, inputClass } from '../components/ui'
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
        className="mt-4 flex flex-col gap-2"
      >
        <button type="button" onClick={() => photoInput.current?.click()} className="press mx-auto mb-2 flex flex-col items-center gap-2">
          <PetAvatar pet={pet.name ? pet : undefined} size={96} />
          <span className="text-[14px] font-medium text-accent">{pet.photo ? 'Change photo' : 'Add a photo'}</span>
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

        <Field label="Name">
          <input required className={inputClass} value={pet.name} onChange={(e) => set({ name: e.target.value })} placeholder="Rocky" autoComplete="off" />
        </Field>
        <Field label="Species">
          <select className={inputClass} value={pet.species} onChange={(e) => set({ species: e.target.value as Species })}>
            {SPECIES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Breed">
          <input className={inputClass} value={pet.breed ?? ''} onChange={(e) => set({ breed: e.target.value })} placeholder="Labrador Retriever" />
        </Field>
        <Field label="Date of birth">
          <input type="date" className={inputClass} value={pet.birthDate ?? ''} onChange={(e) => set({ birthDate: e.target.value })} />
        </Field>
        {existing && (
          <>
            <Field label="Allergies (comma-separated)">
              <input className={inputClass} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </Field>
            <Field label="Microchip">
              <input className={inputClass} value={pet.microchip ?? ''} onChange={(e) => set({ microchip: e.target.value })} />
            </Field>
            <Field label="Insurance">
              <input className={inputClass} value={pet.insurance ?? ''} onChange={(e) => set({ insurance: e.target.value })} />
            </Field>
            <Field label="Vet name">
              <input className={inputClass} value={pet.vet?.name ?? ''} onChange={(e) => set({ vet: { name: e.target.value, phone: pet.vet?.phone ?? '' } })} />
            </Field>
            <Field label="Vet phone">
              <input type="tel" className={inputClass} value={pet.vet?.phone ?? ''} onChange={(e) => set({ vet: { name: pet.vet?.name ?? '', phone: e.target.value } })} />
            </Field>
          </>
        )}

        <div className="mt-4">
          <Button type="submit" full disabled={!pet.name.trim()}>
            {existing ? 'Save' : `Add ${pet.name.trim() || 'pet'}`}
          </Button>
        </div>
        {!existing && <p className="text-center text-[13px] text-ink-2">Papers can come later — just hand them to Boo.</p>}
      </form>
    </StackScreen>
  )
}

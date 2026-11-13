import { useNavigate } from 'react-router'
import { Card } from '../components/Card'
import { IconButton } from '../components/IconButton'
import { ListRow } from '../components/ListRow'
import { useApp } from '../data/useApp'
import { ageShort } from '../lib/dates'
import { petStatus } from '../lib/tasks'

/** Figma "11 · Pets": "Your pack" with a + button, the pet list with a status on the right, then "Add a pet". */
export function PetList() {
  const navigate = useNavigate()
  const { pets, tasks } = useApp()
  const addPet = () => navigate('/pets/new')

  const rows = pets.map((p) => ({ pet: p, status: petStatus(tasks, p.id) }))
  const due = rows.filter((r) => r.status.due).length
  const caption = [
    `${pets.length} pet${pets.length === 1 ? '' : 's'}`,
    due > 0 && `${due} ${due === 1 ? 'has' : 'have'} something due`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      {/* Figma "Screen title": caption over the title, the + button on the baseline */}
      <header className="flex items-end gap-8 pt-32 pb-16">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="text-body-s text-text-secondary">{caption}</p>
          <h1 className="font-display text-display font-medium">Your pack</h1>
        </div>
        <IconButton variant="primary" icon="plus" label="Add a pet" onClick={addPet} className="-mr-2 -mb-2" />
      </header>

      <div className="flex flex-col gap-16">
        <Card variant="list" className="overflow-hidden">
          {rows.map(({ pet, status }) => (
            <ListRow
              key={pet.id}
              pet={pet}
              title={pet.name}
              subtitle={<span className="block truncate">{[pet.breed ?? pet.species, ageShort(pet.birthDate)].filter(Boolean).join(' · ')}</span>}
              value={<span className={status.overdue ? 'text-status-waiting-text' : undefined}>{status.label}</span>}
              trailing="chevron"
              onClick={() => navigate(`/pets/${pet.id}`)}
            />
          ))}
        </Card>

        <Card variant="list" className="overflow-hidden">
          <ListRow icon="plus" title="Add a pet" subtitle="or snap a vet paper" trailing="chevron" onClick={addPet} />
        </Card>
      </div>
    </div>
  )
}

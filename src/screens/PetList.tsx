import { useNavigate } from 'react-router'
import { Icon } from '../components/Icon'
import { Card, PetAvatar } from '../components/ui'
import { useApp } from '../data/useApp'
import { addDays, age, relative, today } from '../lib/dates'

export function PetList() {
  const navigate = useNavigate()
  const { pets, tasks } = useApp()
  const t = today()

  return (
    <div className="pt-safe min-h-dvh px-16 pb-[144px]">
      <header className="flex min-h-[48px] items-center">
        <h1 className="font-display text-display font-medium">Pets</h1>
      </header>

      <div className="mt-16 flex flex-col gap-8">
        {pets.map((p) => {
          const next = tasks
            .filter((x) => x.petId === p.id && !x.doneAt && x.kind !== 'chore' && x.date <= addDays(t, 60))
            .sort((a, b) => a.date.localeCompare(b.date))[0]
          return (
            <Card key={p.id} onClick={() => navigate(`/pets/${p.id}`)} className="flex items-center gap-12">
              <PetAvatar pet={p} size={56} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-body-l font-medium">{p.name}</p>
                <p className="truncate text-body-s text-text-secondary">{[p.breed ?? p.species, age(p.birthDate)].filter(Boolean).join(' · ')}</p>
                {next && (
                  <p className={`truncate text-body-s font-medium ${next.date < t ? 'text-status-waiting-text' : 'text-accent-primary'}`}>
                    {next.title} {relative(next.date)}
                  </p>
                )}
              </div>
              <Icon name="chevron" size={20} className="text-text-tertiary" />
            </Card>
          )
        })}

        <button
          type="button"
          onClick={() => navigate('/pets/new')}
          className="press flex min-h-control-64 items-center justify-center gap-8 rounded-24 text-body font-medium text-accent-primary border border-dashed border-surface-subtle"
        >
          <Icon name="plus" size={20} />
          Add a pet
        </button>
      </div>
    </div>
  )
}

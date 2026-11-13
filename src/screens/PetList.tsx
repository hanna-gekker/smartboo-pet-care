import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { useApp } from '../data/useApp'
import { addDays, age, relative, today } from '../lib/dates'

export function PetList() {
  const navigate = useNavigate()
  const { pets, tasks } = useApp()
  const t = today()

  return (
    <div className="pt-safe min-h-dvh px-16 pb-tab-bar-room">
      <header className="flex min-h-control-56 items-center">
        <h1 className="font-display text-display font-medium">Pets</h1>
      </header>

      <Card variant="list" className="mt-16 overflow-hidden">
        {pets.map((p) => {
          const next = tasks
            .filter((x) => x.petId === p.id && !x.doneAt && x.kind !== 'chore' && x.date <= addDays(t, 60))
            .sort((a, b) => a.date.localeCompare(b.date))[0]
          return (
            <ListRow
              key={p.id}
              pet={p}
              title={p.name}
              subtitle={
                <>
                  <span className="block truncate">{[p.breed ?? p.species, age(p.birthDate)].filter(Boolean).join(' · ')}</span>
                  {next && (
                    <span className={`block truncate font-medium ${next.date < t ? 'text-status-waiting-text' : 'text-accent-primary'}`}>
                      {next.title} {relative(next.date)}
                    </span>
                  )}
                </>
              }
              trailing="chevron"
              onClick={() => navigate(`/pets/${p.id}`)}
            />
          )
        })}
      </Card>

      <Button full variant="secondary" icon="plus" onClick={() => navigate('/pets/new')} className="mt-12">
        Add a pet
      </Button>
    </div>
  )
}

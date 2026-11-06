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
    <div className="pt-safe min-h-dvh px-gutter pb-36">
      <header className="flex min-h-12 items-center">
        <h1 className="font-display text-[28px] font-bold">Pets</h1>
      </header>

      <div className="mt-4 flex flex-col gap-2">
        {pets.map((p) => {
          const next = tasks
            .filter((x) => x.petId === p.id && !x.doneAt && x.kind !== 'chore' && x.date <= addDays(t, 60))
            .sort((a, b) => a.date.localeCompare(b.date))[0]
          return (
            <Card key={p.id} onClick={() => navigate(`/pets/${p.id}`)} className="flex items-center gap-3">
              <PetAvatar pet={p} size={56} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[17px] font-semibold">{p.name}</p>
                <p className="truncate text-[14px] text-ink-2">{[p.breed ?? p.species, age(p.birthDate)].filter(Boolean).join(' · ')}</p>
                {next && (
                  <p className={`truncate text-[13px] font-medium ${next.date < t ? 'text-warn' : 'text-accent'}`}>
                    {next.title} {relative(next.date)}
                  </p>
                )}
              </div>
              <Icon name="chevron" size={20} className="text-ink-3" />
            </Card>
          )
        })}

        <button
          type="button"
          onClick={() => navigate('/pets/new')}
          className="press flex min-h-16 items-center justify-center gap-2 rounded-md text-[15px] font-semibold text-accent border border-dashed border-line"
        >
          <Icon name="plus" size={20} />
          Add a pet
        </button>
      </div>
    </div>
  )
}

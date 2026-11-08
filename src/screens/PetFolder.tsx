import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Icon, type IconName } from '../components/Icon'
import { Button, Card, Chip, PetAvatar, SectionTitle, StackScreen } from '../components/ui'
import { petById, useApp } from '../data/useApp'
import type { PetRecord, RecordType } from '../data/types'
import { age, formatDay, relative, today } from '../lib/dates'

const filters: { key: 'all' | RecordType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'health', label: 'Health' },
  { key: 'meds', label: 'Meds' },
  { key: 'vaccine', label: 'Vaccines' },
  { key: 'weight', label: 'Weight' },
  { key: 'document', label: 'Documents' },
]

const recordIcon: Record<RecordType, IconName> = {
  health: 'heart',
  meds: 'pill',
  vaccine: 'syringe',
  weight: 'scale',
  document: 'doc',
  note: 'sparkle',
}

const NO_VACCINES = ['fish', 'reptile', 'bird']

export function PetFolder() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { pets, records, vaccines, meds, documents } = useApp()
  const [filter, setFilter] = useState<'all' | RecordType>('all')
  const [query, setQuery] = useState('')
  const pet = petById(pets, id)

  if (!pet) {
    return (
      <StackScreen title="Pet">
        <p className="mt-32 text-center text-text-secondary">This pet isn’t here anymore.</p>
      </StackScreen>
    )
  }

  const t = today()
  const petVax = vaccines.filter((v) => v.petId === pet.id).sort((a, b) => (a.due ?? '').localeCompare(b.due ?? ''))
  const nextVax = petVax.find((v) => v.due && v.due >= t)
  const medsNow = meds.filter((m) => m.petId === pet.id && (!m.until || m.until >= t))
  const weights = records.filter((r) => r.petId === pet.id && r.type === 'weight' && r.value !== undefined).sort((a, b) => a.date.localeCompare(b.date))
  const lastWeight = weights.at(-1)

  const history = records
    .filter((r) => r.petId === pet.id)
    .filter((r) => filter === 'all' || r.type === filter)
    .filter((r) => !query || `${r.title} ${r.detail ?? ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <StackScreen
      title=""
      right={
        <Button variant="secondary" icon="share" onClick={() => navigate(`/share?pet=${pet.id}`)} className="!min-h-control-44 !px-16">
          Share
        </Button>
      }
    >
      {/* Header */}
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="rounded-[42%] bg-accent-primary-subtle p-4">
          <div className="overflow-hidden rounded-[40%]">
            <PetAvatar pet={pet} size={112} />
          </div>
        </div>
        <h1 className="mt-12 font-display text-display font-medium">{pet.name}</h1>
        <p className="text-body text-text-secondary">{[pet.species[0].toUpperCase() + pet.species.slice(1), pet.breed, age(pet.birthDate)].filter(Boolean).join(' · ')}</p>
      </div>

      {/* Key facts */}
      <SectionTitle>Key facts</SectionTitle>
      <div className="grid grid-cols-2 gap-8">
        {!NO_VACCINES.includes(pet.species) && (
          <Tile icon="syringe" label="Vaccines" value={nextVax ? `${nextVax.name.split(' (')[0]} ${relative(nextVax.due!)}` : petVax.length ? 'All up to date' : 'Not known yet'} warn={!petVax.length} />
        )}
        <Tile icon="pill" label="Meds now" value={medsNow.length ? medsNow.map((m) => m.name).join(', ') : 'None'} />
        {lastWeight && (
          <Tile icon="scale" label="Weight" value={`${lastWeight.value} ${pet.weightUnit}`}>
            <Sparkline values={weights.map((w) => w.value!)} />
          </Tile>
        )}
        <Tile icon="alert" label="Allergies" value={pet.allergies.length ? pet.allergies.join(', ') : 'None known'} />
        {pet.vet && (
          <a href={`tel:${pet.vet.phone}`} className="press col-span-2 flex min-h-control-64 items-center gap-12 rounded-24 bg-surface-card p-16 ring-1 ring-surface-subtle">
            <span className="flex size-control-40 items-center justify-center rounded-full bg-accent-primary text-text-on-accent">
              <Icon name="phone" size={20} />
            </span>
            <span className="flex-1">
              <span className="block text-caption font-medium text-text-secondary">Vet</span>
              <span className="block text-body font-medium">{pet.vet.name}</span>
            </span>
            <span className="text-body-s font-medium text-accent-primary">Call</span>
          </a>
        )}
      </div>

      {/* History */}
      <SectionTitle>History</SectionTitle>
      <div role="tablist" className="swipe-row -mx-16 flex gap-8 px-16">
        {filters.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>
      <label className="mt-12 flex min-h-control-44 items-center gap-8 rounded-full bg-surface-card px-16 ring-1 ring-surface-subtle">
        <Icon name="search" size={18} className="text-text-tertiary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history" className="min-h-control-44 flex-1 bg-transparent text-body outline-none placeholder:text-text-tertiary" />
      </label>
      <ol className="mt-12">
        {history.map((r) => (
          <HistoryItem key={r.id} record={r} unit={pet.weightUnit} docTitle={documents.find((d) => d.id === r.documentId && r.type !== 'document')?.title} />
        ))}
        {history.length === 0 && <p className="py-32 text-center text-body text-text-secondary">Nothing here yet.</p>}
      </ol>

      {/* Profile */}
      <SectionTitle>Profile</SectionTitle>
      <Card className="!py-4">
        {[
          ['Species', pet.species],
          ['Breed', pet.breed],
          ['Born', pet.birthDate && formatDay(pet.birthDate, { month: 'long', day: 'numeric', year: 'numeric' })],
          ['Microchip', pet.microchip],
          ['Insurance', pet.insurance],
          ['Vet', pet.vet?.name],
        ].map(([label, value]) => (
          <div key={label} className="flex min-h-control-44 items-center justify-between border-b border-surface-subtle py-8 text-body last:border-0">
            <span className="text-text-secondary">{label}</span>
            <span className="max-w-[60%] truncate text-right">{value || '—'}</span>
          </div>
        ))}
      </Card>
      <Button full variant="ghost" onClick={() => navigate(`/pets/${pet.id}/edit`)} className="mt-8">
        Edit profile
      </Button>
    </StackScreen>
  )
}

function Tile({ icon, label, value, warn, children }: { icon: IconName; label: string; value: string; warn?: boolean; children?: ReactNode }) {
  return (
    <div className="flex min-h-[96px] flex-col rounded-24 bg-surface-card p-12 ring-1 ring-surface-subtle">
      <div className="flex items-center gap-4 text-text-secondary">
        <Icon name={icon} size={16} />
        <span className="text-caption font-medium">{label}</span>
      </div>
      <p className={`mt-4 line-clamp-2 text-body font-medium ${warn ? 'text-status-waiting-text' : ''}`}>{value}</p>
      {children}
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${max === min ? 10 : 18 - ((v - min) / (max - min)) * 16}`).join(' ')
  return (
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="mt-auto h-[20px] w-full text-accent-primary" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryItem({ record, unit, docTitle }: { record: PetRecord; unit: string; docTitle?: string }) {
  return (
    <li className="flex gap-12 py-8">
      <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-accent-primary-subtle text-accent-primary">
        <Icon name={recordIcon[record.type]} size={18} />
      </span>
      <div className="min-w-0 flex-1 border-b border-surface-subtle pb-8">
        <div className="flex items-baseline justify-between gap-8">
          <p className="text-body font-medium">{record.type === 'weight' ? `${record.value} ${unit}` : record.title}</p>
          <span className="shrink-0 text-caption text-text-tertiary">{formatDay(record.date, { month: 'short', day: 'numeric', year: '2-digit' })}</span>
        </div>
        {record.detail && <p className="text-body-s text-text-secondary">{record.detail}</p>}
        {docTitle && (
          <p className="mt-2 flex items-center gap-4 text-body-s text-accent-primary">
            <Icon name="doc" size={14} />
            From: {docTitle}
          </p>
        )}
      </div>
    </li>
  )
}

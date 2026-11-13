import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Icon, type IconName } from '../components/Icon'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { PetAvatar } from '../components/PetAvatar'
import { TextField } from '../components/TextField'
import { Chip, SectionTitle, StackScreen } from '../components/ui'
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
  health: 'heart-pulse',
  meds: 'pill',
  vaccine: 'syringe',
  weight: 'weight',
  document: 'file-text',
  note: 'sparkle-ai',
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
        <Button variant="secondary" icon="share" onClick={() => navigate(`/share?pet=${pet.id}`)}>
          Share
        </Button>
      }
    >
      {/* Header */}
      <div className="mt-8 flex flex-col items-center text-center">
        <PetAvatar pet={pet} size="hero" />
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
          <Tile icon="weight" label="Weight" value={`${lastWeight.value} ${pet.weightUnit}`}>
            <Sparkline values={weights.map((w) => w.value!)} />
          </Tile>
        )}
        <Tile icon="shield-alert" label="Allergies" value={pet.allergies.length ? pet.allergies.join(', ') : 'None known'} />
        {pet.vet && (
          <Card variant="list" className="col-span-2 overflow-hidden">
            <ListRow icon="phone" label="Vet" title={pet.vet.name} trailing={{ label: 'Call', icon: 'phone' }} href={`tel:${pet.vet.phone}`} />
          </Card>
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
      <TextField label="Search history" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history" trailingIcon="search" className="mt-12" />
      <ol className="mt-12">
        {history.map((r) => (
          <HistoryItem key={r.id} record={r} unit={pet.weightUnit} docTitle={documents.find((d) => d.id === r.documentId && r.type !== 'document')?.title} />
        ))}
        {history.length === 0 && <p className="py-32 text-center text-body text-text-secondary">Nothing here yet.</p>}
      </ol>

      {/* Profile */}
      <SectionTitle>Profile</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        {[
          ['Species', pet.species],
          ['Breed', pet.breed],
          ['Born', pet.birthDate && formatDay(pet.birthDate, { month: 'long', day: 'numeric', year: 'numeric' })],
          ['Microchip', pet.microchip],
          ['Insurance', pet.insurance],
          ['Vet', pet.vet?.name],
        ].map(([label, value]) => (
          <ListRow key={label} title={label} value={value || '—'} />
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
    <div className="flex min-h-avatar-80 flex-col gap-4 rounded-24 bg-surface-card p-12">
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
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="mt-auto h-icon-20 w-full shrink-0 pt-4 text-accent-primary" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryItem({ record, unit, docTitle }: { record: PetRecord; unit: string; docTitle?: string }) {
  return (
    <li className="flex gap-12 py-8">
      <span className="flex size-control-40 shrink-0 items-center justify-center rounded-full bg-accent-primary-subtle text-accent-primary ring-1 ring-inset ring-icon-circle-ring">
        <Icon name={recordIcon[record.type]} size={20} />
      </span>
      <div className="min-w-0 flex-1 border-b border-surface-subtle pb-8">
        <div className="flex items-baseline justify-between gap-8">
          <p className="text-body font-medium">{record.type === 'weight' ? `${record.value} ${unit}` : record.title}</p>
          <span className="shrink-0 text-caption text-text-tertiary">{formatDay(record.date, { month: 'short', day: 'numeric', year: '2-digit' })}</span>
        </div>
        {record.detail && <p className="text-body-s text-text-secondary">{record.detail}</p>}
        {docTitle && (
          <p className="mt-2 flex items-center gap-4 text-body-s text-accent-primary">
            <Icon name="file-text" size={14} />
            From: {docTitle}
          </p>
        )}
      </div>
    </li>
  )
}

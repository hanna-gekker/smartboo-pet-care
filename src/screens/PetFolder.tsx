import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AttentionCard } from '../components/AttentionCard'
import { BooBubble } from '../components/BooBubble'
import { BooHint } from '../components/BooHint'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { PetAvatar } from '../components/PetAvatar'
import { TextField } from '../components/TextField'
import { Chip, SectionTitle, StackScreen, TextLink } from '../components/ui'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { PetRecord, RecordType } from '../data/types'
import { ageLong, daysBetween, formatDay, today } from '../lib/dates'
import { petColor } from '../lib/petColors'
import { vaccineSummary } from '../lib/vaccines'
import { recordIcon } from '../lib/records'
import { RecordDetail } from './RecordDetail'
import { getsVaccines, speciesLabel } from '../lib/species'

const filters: { key: 'all' | RecordType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'health', label: 'Health' },
  { key: 'meds', label: 'Meds' },
  { key: 'vaccine', label: 'Vaccines' },
  { key: 'weight', label: 'Weight' },
  { key: 'document', label: 'Documents' },
]



export function PetFolder() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { pets, records, vaccines, meds, documents, tasks, toggleTask } = useApp()
  const [filter, setFilter] = useState<'all' | RecordType>('all')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [openRecord, setOpenRecord] = useState<string | null>(null)
  const openBoo = useUi((s) => s.openBoo)
  const historyRef = useRef<HTMLDivElement>(null)
  const pet = petById(pets, id)

  if (!pet) {
    return (
      <StackScreen title="Pet">
        <p className="mt-32 text-center text-text-secondary">This pet isn’t here anymore.</p>
      </StackScreen>
    )
  }

  const t = today()
  const petVax = vaccines.filter((v) => v.petId === pet.id)
  const vax = vaccineSummary(petVax, t)
  const medsNow = meds.filter((m) => m.petId === pet.id && (!m.until || m.until >= t))
  const weights = records.filter((r) => r.petId === pet.id && r.type === 'weight' && r.value !== undefined).sort((a, b) => a.date.localeCompare(b.date))
  const lastWeight = weights.at(-1)
  const weightText = (v: number) => `${v} ${pet.weightUnit}`
  const claim = tasks.filter((x) => x.petId === pet.id && x.kind === 'insurance' && !x.doneAt).sort((a, b) => a.date.localeCompare(b.date))[0]
  // Mark done on the Attention card: the overdue vaccine tasks (as Done on Today)
  const overdueVaxTasks = tasks.filter((x) => x.petId === pet.id && x.kind === 'vaccine' && !x.doneAt && x.date < t)
  const callVet = pet.vet
    ? () => {
        window.location.href = `tel:${pet.vet!.phone}`
      }
    : undefined
  // A new pet (Figma "Empty · Pet folder · new pet"): no records, vaccines or meds yet
  const allRecords = records.filter((r) => r.petId === pet.id)
  const isNew = allRecords.length === 0 && petVax.length === 0 && medsNow.length === 0
  const showHistory = (f: RecordType) => {
    setFilter(f)
    historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const history = records
    .filter((r) => r.petId === pet.id)
    .filter((r) => filter === 'all' || r.type === filter)
    .filter((r) => !query || `${r.title} ${r.detail ?? ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date) || (b.time ?? '').localeCompare(a.time ?? ''))

  return (
    <StackScreen title="">
      {/* Header: the photo in its flower, the name, a line of facts and Share records */}
      <div className="mt-16 flex flex-col items-center text-center">
        <PetAvatar pet={pet} size="hero" petals={petColor(pet, pets)} onAddPhoto={pet.photo ? undefined : () => navigate(`/pets/${pet.id}/edit`)} />
        <h1 className="mt-8 font-display text-display font-medium">{pet.name}</h1>
        <p className="mt-8 text-body-s text-text-secondary">
          {[speciesLabel(pet.species), pet.breed, ageLong(pet.birthDate), lastWeight && weightText(lastWeight.value!)].filter(Boolean).join(' · ')}
        </p>
        <Button variant="secondary" icon="share" onClick={() => navigate(`/share?pet=${pet.id}`)} className="mt-24">
          Share records
        </Button>
      </div>

      {/* Shown while the overdue vaccine tasks are open; Mark done closes them (the vaccine records stay as the
          papers say until a new paper comes in) */}
      {vax.attention && overdueVaxTasks.length > 0 && (
        <div className="mt-16">
          <AttentionCard
            icon="syringe"
            title={vax.attention}
            detail={vax.attentionDetail}
            actions={
              <>
                {callVet && <Button onClick={callVet}>Book vet</Button>}
                <Button variant="secondary" onClick={() => overdueVaxTasks.forEach((x) => toggleTask(x.id))}>
                  Mark done
                </Button>
              </>
            }
          />
        </div>
      )}

      {/* Health: one list of key facts (Figma 12) */}
      <SectionTitle>Health</SectionTitle>
      {isNew && getsVaccines(pet.species) ? (
        <BooHint
          actions={
            <Button icon="camera" onClick={() => openBoo('snap')}>
              Snap a vet paper
            </Button>
          }
        >
          I don’t know {pet.name}’s shots yet. Snap the last vet paper?
        </BooHint>
      ) : (
        <Card variant="list" className="overflow-hidden">
          {getsVaccines(pet.species) && (
            <ListRow
              icon="syringe"
              label="Vaccines"
              title={petVax.length ? vax.line : 'Not known yet'}
              subtitle={vax.overdueLine && <span className="text-status-waiting-text">{vax.overdueLine}</span>}
              trailing="chevron"
              onClick={() => navigate(`/pets/${pet.id}/vaccines`)}
            />
          )}
          <ListRow
            icon="pill"
            label="Meds now"
            title={medsNow.length ? medsNow.map((m) => `${m.name} ${m.dose}`).join(', ') : 'None'}
            subtitle={medsNow.length === 1 ? courseLine(medsNow[0].start, medsNow[0].until, t) : undefined}
            trailing="chevron"
            onClick={() => showHistory('meds')}
          />
          {lastWeight && (
            <ListRow
              icon="weight"
              label="Weight"
              title={weightText(lastWeight.value!)}
              subtitle={weightChange(weights, pet.weightUnit)}
              value={<Sparkline values={weights.map((w) => w.value!)} />}
              trailing="chevron"
              onClick={() => showHistory('weight')}
            />
          )}
          <ListRow
            icon="shield-alert"
            label="Allergies"
            title={pet.allergies.length ? pet.allergies.join(', ') : 'None known'}
            trailing="chevron"
            onClick={() => navigate(`/pets/${pet.id}/edit`)}
          />
          {pet.vet && (
            <ListRow icon="stethoscope" label="Vet" title={pet.vet.name} subtitle={pet.vet.clinic} trailing={{ label: 'Call', icon: 'phone' }} href={`tel:${pet.vet.phone}`} />
          )}
          {pet.insurance && (
            <ListRow
              icon="file-text"
              label="Insurance"
              title={pet.insurance.split(' · ')[0]}
              subtitle={claim ? `${claim.title} · file by ${formatDay(claim.date)}` : undefined}
              trailing="chevron"
              onClick={() => navigate(`/pets/${pet.id}/edit`)}
            />
          )}
        </Card>
      )}

      {/* History */}
      <div ref={historyRef} className="scroll-mt-16">
        <SectionTitle action={allRecords.length > 0 && <TextLink onClick={() => setSearching((v) => !v)}>Search</TextLink>}>History</SectionTitle>
      </div>
      {allRecords.length === 0 ? (
        <Card className="py-24 text-center text-body-s text-text-secondary">Papers, weights and notes will show up here by date.</Card>
      ) : (
        <>
          {searching && (
            <TextField label="Search history" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history" trailingIcon="search" className="mb-12" autoFocus />
          )}
          <div role="tablist" className="swipe-row -mx-16 -my-4 flex gap-8 px-16 py-4">
            {filters.map((f) => (
              <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </Chip>
            ))}
          </div>
          {history.length > 0 ? (
            <Card variant="list" className="mt-12 overflow-hidden">
              <ol>
                {history.map((r) => (
                  <HistoryItem
                    key={r.id}
                    record={r}
                    unit={pet.weightUnit}
                    clinic={documents.find((d) => d.id === r.documentId)?.clinic}
                    before={r.type === 'weight' ? weights.filter((w) => w.date < r.date).at(-1) : undefined}
                    onOpen={() => setOpenRecord(r.id)}
                  />
                ))}
              </ol>
            </Card>
          ) : query ? (
            /* Search with no results (Figma "Empty · Search"): Boo says so, one way back */
            <div className="mt-12">
              <BooBubble
                pose="reading"
                action={
                  <Button full size="large" variant="secondary" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                }
              >
                I couldn’t find “{query}” in {pet.name}’s records.
              </BooBubble>
            </div>
          ) : (
            <p className="py-32 text-center text-body text-text-secondary">Nothing here yet.</p>
          )}
        </>
      )}

      {/* Profile */}
      <SectionTitle action={<TextLink onClick={() => navigate(`/pets/${pet.id}/edit`)}>Edit</TextLink>}>Profile</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        {[
          ['Species', speciesLabel(pet.species)],
          ['Breed', pet.breed],
          ['Born', pet.birthDate && formatDay(pet.birthDate, { month: 'short', day: 'numeric', year: 'numeric' })],
          ['Microchip', pet.microchip],
          ['Insurance', pet.insurance],
          ['Vet', pet.vet && [pet.vet.name, pet.vet.clinic].filter(Boolean).join(' · ')],
        ].map(([label, value]) => (
          /* An empty fact is an Add link to Edit (Figma "new pet") */
          <ListRow
            key={label}
            title={label}
            value={value || <span className="font-medium text-accent-primary">Add</span>}
            onClick={value ? undefined : () => navigate(`/pets/${pet.id}/edit`)}
          />
        ))}
      </Card>
      <RecordDetail recordId={openRecord} onClose={() => setOpenRecord(null)} />
    </StackScreen>
  )
}

/** "Day 12 of 30 · ends Nov 22" (Meds now), or "ends Nov 22" when the start isn't known. */
function courseLine(start: string | undefined, until: string | undefined, t: string): string | undefined {
  if (!until) return undefined
  const ends = `ends ${formatDay(until)}`
  if (!start) return ends
  return `Day ${daysBetween(start, t) + 1} of ${daysBetween(start, until) + 1} · ${ends}`
}

/** "↓ 0.4 lb since Sep" against the weight before the last one. */
function weightChange(weights: PetRecord[], unit: string): string | undefined {
  const [prev, last] = weights.slice(-2)
  if (!prev || !last) return undefined
  const diff = Math.round((last.value! - prev.value!) * 10) / 10
  const since = formatDay(prev.date, { month: 'short' })
  return diff === 0 ? `No change since ${since}` : `${diff < 0 ? '↓' : '↑'} ${Math.abs(diff)} ${unit} since ${since}`
}

/** Figma Summary row Trailing=Sparkline: a 56 × 24 line in accent/primary, 2px, with a dot on the latest weight. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  // Drawn in its own 56 × 24 space (not stretched), 3 in from the edges so the line and the dot aren't cut
  const xy = values.map((v, i) => [3 + (i / (values.length - 1)) * 50, max === min ? 12 : 21 - ((v - min) / (max - min)) * 18] as const)
  const [lx, ly] = xy[xy.length - 1]
  return (
    <svg viewBox="0 0 56 24" className="block h-icon-24 w-[56px] text-accent-primary" aria-hidden="true">
      <polyline points={xy.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="currentColor" />
    </svg>
  )
}

function HistoryItem({ record, unit, clinic, before, onOpen }: { record: PetRecord; unit: string; clinic?: string; before?: PetRecord; onOpen: () => void }) {
  // Figma "Timeline item": what it is, a grey line saying where it came from, the date on the right
  let title = record.title
  let line = record.detail
  if (record.type === 'weight') {
    title = `Weight · ${record.value} ${unit}`
    if (before) {
      const diff = Math.round((record.value! - before.value!) * 10) / 10
      line = `${diff > 0 ? '+' : diff < 0 ? '−' : '±'}${Math.abs(diff)} ${unit} since ${formatDay(before.date, { month: 'short' })}`
    }
  } else if (record.type === 'document') line = ['Document', clinic].filter(Boolean).join(' · ')
  else if (!record.detail && record.documentId) line = [clinic, 'from vet paper'].filter(Boolean).join(' · ')
  else if (record.type === 'health' && !record.documentId && record.detail) line = `Health note · ${record.detail}`
  const sameYear = record.date.slice(0, 4) === today().slice(0, 4)
  return (
    <li>
      <button type="button" onClick={onOpen} className="focus-inset flex w-full gap-16 px-24 py-16 text-left active:bg-surface-subtle">
        <span className="chip-category flex size-control-40 shrink-0 items-center justify-center rounded-full text-icon-category-on-chip">
          <Icon name={recordIcon[record.type]} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-8">
            <p className="text-body font-medium">{title}</p>
            <span className="shrink-0 text-caption text-text-secondary">{formatDay(record.date, sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {line && <p className="text-body-s text-text-secondary">{line}</p>}
        </div>
      </button>
    </li>
  )
}

// Vaccines — Figma "13 · Vaccines · Rocky": every vaccine with when it was given and when it is due, linked to
// the vet paper it came from. Opened from Pet folder → Health → Vaccines and from a vaccine reminder.

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AttentionCard } from '../components/AttentionCard'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { SheetHeader } from '../components/BooSheet'
import { StackScreen } from '../components/ui'
import type { Vaccine } from '../data/types'
import { petById, useApp } from '../data/useApp'
import { formatDay } from '../lib/dates'
import { byDue, isOverdue, vaccineSummary } from '../lib/vaccines'

const long = (day: string) => formatDay(day, { month: 'short', day: 'numeric', year: 'numeric' })

export function Vaccines() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { pets, vaccines, documents } = useApp()
  const [source, setSource] = useState<Vaccine>()
  const pet = petById(pets, id)
  if (!pet) {
    return (
      <StackScreen title="Vaccines">
        <p className="mt-32 text-center text-text-secondary">This pet isn’t here anymore.</p>
      </StackScreen>
    )
  }

  const vax = vaccines.filter((v) => v.petId === pet.id).sort(byDue)
  const { overdue } = vaccineSummary(vax)
  const papers = new Set(vax.map((v) => v.documentId).filter(Boolean)).size
  const doc = source && documents.find((d) => d.id === source.documentId)

  return (
    <StackScreen title={`${pet.name}’s vaccines`}>
      <div className="mt-8 flex flex-col gap-16">
        {overdue.length > 0 && (
          <AttentionCard
            title={`${overdue.length} ${overdue.length === 1 ? 'vaccine is' : 'vaccines are'} overdue.${pet.vet ? ` Book a visit with ${pet.vet.name}?` : ''}`}
          />
        )}

        {vax.length > 0 ? (
          <Card variant="list" className="overflow-hidden">
            {vax.map((v) => (
              <ListRow
                key={v.id}
                title={v.name}
                subtitle={`given ${long(v.given)}`}
                value={
                  v.due ? (
                    isOverdue(v) ? (
                      <span className="flex flex-col text-status-waiting-text">
                        <span>due {formatDay(v.due)}</span>
                        <span>overdue</span>
                      </span>
                    ) : (
                      <span className="flex flex-col">
                        <span>due</span>
                        <span>{long(v.due)}</span>
                      </span>
                    )
                  ) : undefined
                }
                trailing={v.documentId ? 'chevron' : undefined}
                onClick={v.documentId ? () => setSource(v) : undefined}
              />
            ))}
          </Card>
        ) : (
          <p className="py-32 text-center text-body text-text-secondary">Nothing here yet.</p>
        )}

        <div className="flex gap-8 [&>*]:flex-1">
          {pet.vet && <Button onClick={() => {
                window.location.href = `tel:${pet.vet!.phone}`
              }}>Book vet</Button>}
          <Button variant="secondary" icon="share" onClick={() => navigate(`/share?pet=${pet.id}`)}>
            Share
          </Button>
        </div>
        {papers > 0 && (
          <p className="text-center text-caption text-text-secondary">
            From {papers} vet {papers === 1 ? 'paper' : 'papers'} · tap a vaccine to see the source
          </p>
        )}
      </div>

      <BottomSheet open={!!source} onClose={() => setSource(undefined)} label={source?.name ?? ''}>
        {source && (
          <div className="pb-24">
            <SheetHeader title={source.name} pose="reading" />
            {doc && (
              <Card variant="list" className="mt-16 overflow-hidden">
                <ListRow icon="file-text" title={doc.title} subtitle={[doc.clinic, long(doc.date)].filter(Boolean).join(' · ')} />
              </Card>
            )}
          </div>
        )}
      </BottomSheet>
    </StackScreen>
  )
}

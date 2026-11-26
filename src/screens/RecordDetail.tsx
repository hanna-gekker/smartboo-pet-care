// Opens one record in the record sheet (Pet folder → History, Schedule → Happened): reads it from the store,
// lets the owner change a symptom's answers, share it, open the vet paper it came from, or delete it (with Undo).

import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { BottomSheet } from '../components/BottomSheet'
import { RecordSheet } from '../components/RecordSheet'
import { petById, useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import type { Pet, PetRecord } from '../data/types'
import { answersLine, SYMPTOM_CHOICES } from '../lib/boo'
import { formatDay, formatTime } from '../lib/dates'
import { recordIcon, recordKind } from '../lib/records'

const canShare = () => Capacitor.isNativePlatform() || typeof navigator.share === 'function'

export function RecordDetail({ recordId, onClose }: { recordId: string | null; onClose: () => void }) {
  const { records, pets, documents, addRecord, removeRecord, updateRecord } = useApp()
  const { showToast } = useUi()
  // A tap on "From a vet paper" shows the paper's own record in the same sheet
  const [shownId, setShownId] = useState<string | null>(null)
  const id = shownId ?? recordId
  const record = records.find((r) => r.id === id)
  const pet = record && petById(pets, record.petId)
  const close = () => {
    setShownId(null)
    onClose()
  }
  if (!recordId || !record || !pet) return null

  const doc = record.documentId ? documents.find((d) => d.id === record.documentId) : undefined
  const docRecord = doc && record.type !== 'document' ? records.find((r) => r.type === 'document' && r.documentId === doc.id) : undefined
  const title = titleOf(record, pet)
  const time = record.time ? formatTime(record.time) : ''
  const day = formatDay(record.date, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const details = record.answers?.length ? undefined : record.type === 'weight' ? undefined : record.detail

  return (
    <BottomSheet open onClose={close} label={title}>
      <RecordSheet
        icon={recordIcon[record.type]}
        kind={recordKind[record.type]}
        title={title}
        pet={pet}
        when={[day, time].filter(Boolean).join(' · ')}
        said={record.said}
        saidWhen={[formatDay(record.date), time].filter(Boolean).join(', ')}
        question={record.question}
        choices={record.question ? SYMPTOM_CHOICES : undefined}
        answers={record.answers}
        onAnswer={(answers) =>
          updateRecord(record.id, {
            answers: answers.length ? answers : undefined,
            detail: answers.length ? answersLine(answers) : undefined,
          })
        }
        details={details}
        source={
          docRecord && doc
            ? {
                title: doc.title,
                subtitle: [doc.clinic, formatDay(doc.date)].filter(Boolean).join(' · '),
                onOpen: () => setShownId(docRecord.id),
              }
            : undefined
        }
        onShare={canShare() ? () => void share(record, pet, title, details) : undefined}
        onDelete={() => {
          removeRecord(record.id)
          showToast(`Deleted from ${pet.name}’s history`, () => addRecord(record))
          close()
        }}
      />
    </BottomSheet>
  )
}

function titleOf(r: PetRecord, pet: Pet) {
  return r.type === 'weight' && r.value !== undefined ? `Weight · ${r.value} ${pet.weightUnit}` : r.title
}

async function share(r: PetRecord, pet: Pet, title: string, details?: string) {
  const text = [
    `${pet.name} · ${title}`,
    [formatDay(r.date, { month: 'long', day: 'numeric', year: 'numeric' }), r.time && formatTime(r.time)].filter(Boolean).join(', '),
    details,
    r.answers?.length ? answersLine(r.answers) : undefined,
    r.said && `“${r.said}”`,
  ]
    .filter(Boolean)
    .join('\n')
  try {
    await Share.share({ title: `${pet.name} · ${title}`, text })
  } catch {
    // Closed the share sheet
  }
}

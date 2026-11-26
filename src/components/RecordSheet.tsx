// Record sheet — one record from a pet's History or Schedule → Happened, opened in a bottom sheet
// (Figma ✏️ Drafts → "Record detail sheet"). What it is, the pet and when, the owner's own words to Boo,
// Boo's follow-up question with the answers, the details, the vet paper it came from, then Share and Delete.
// Each block shows only when there is something in it. Texts and data come in through props.

import type { ReactNode } from 'react'
import type { Pet } from '../data/types'
import { SYMPTOM_CHOICES } from '../lib/boo'
import { Button } from './Button'
import { Icon, type IconName } from './Icon'
import { ListRow } from './ListRow'
import { PetAvatar } from './PetAvatar'
import { Chip } from './ui'

export type RecordSheetProps = {
  icon: IconName
  /** The small accent line over the title, e.g. "Health note" */
  kind: string
  title: string
  pet: Pet
  /** The day and time, e.g. "Fri, Oct 30 · 8:40 AM" */
  when: string
  /** The owner's words to Boo, word for word */
  said?: string
  /** Under the words, e.g. "Oct 30, 8:41 AM" */
  saidWhen?: string
  /** Boo's follow-up question, with the answers to pick (rows of choices; one per row) */
  question?: string
  choices?: string[][]
  answers?: string[]
  onAnswer?: (answers: string[]) => void
  details?: string
  /** The vet paper this record came from */
  source?: { title: string; subtitle?: string; onOpen: () => void }
  onShare?: () => void
  onDelete: () => void
}

export function RecordSheet({ icon, kind, title, pet, when, said, saidWhen, question, choices, answers = [], onAnswer, details, source, onShare, onDelete }: RecordSheetProps) {
  return (
    <div className="flex flex-col gap-24 pt-8 pb-24">
      <div className="flex items-center gap-12">
        <span className="chip-category flex size-control-40 shrink-0 items-center justify-center rounded-full text-icon-category-on-chip">
          <Icon name={icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body-s text-accent-primary">{kind}</p>
          <h2 className="font-display text-title font-medium text-text-primary">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-12 rounded-16 bg-surface-panel p-16 ring-1 ring-inset ring-border-card">
        <PetAvatar pet={pet} size="sm" />
        <div className="min-w-0">
          <p className="text-body font-medium text-text-primary">{pet.name}</p>
          <p className="text-body-s text-text-secondary">{when}</p>
        </div>
      </div>

      {said && (
        <Block label="What you said">
          <div className="flex flex-col gap-8 rounded-16 bg-surface-canvas p-16">
            <p className="text-body text-text-primary">“{said}”</p>
            {saidWhen && <p className="text-caption text-text-secondary">Told Boo · {saidWhen}</p>}
          </div>
        </Block>
      )}

      {question && (
        <Block label="Boo asked">
          <p className="text-body text-text-primary">{question}</p>
          {choices && onAnswer && <AnswerChips choices={choices} answers={choices.map((row) => row.find((c) => answers.includes(c)))} onAnswer={(a) => onAnswer(a.filter(Boolean) as string[])} />}
        </Block>
      )}

      {details && (
        <Block label="Details">
          <p className="text-body text-text-primary">{details}</p>
        </Block>
      )}

      {source && (
        <Block label="From a vet paper">
          <div className="-mx-24">
            <ListRow icon="file-text" title={source.title} subtitle={source.subtitle} trailing="chevron" onClick={source.onOpen} />
          </div>
        </Block>
      )}

      <div className="flex flex-col gap-8">
        {onShare && (
          <Button full size="large" variant="secondary" icon="share" onClick={onShare}>
            Share
          </Button>
        )}
        <Button full variant="ghost" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-8">
      <h3 className="text-caption font-medium text-text-secondary">{label}</h3>
      {children}
    </section>
  )
}

/** Answer chips: a row of choices per question, one pick per row; tapping the picked one again clears it.
 *  `answers[i]` is the pick in row i. */
export function AnswerChips({ choices = SYMPTOM_CHOICES, answers, onAnswer }: { choices?: string[][]; answers: (string | undefined)[]; onAnswer: (answers: (string | undefined)[]) => void }) {
  return (
    <div className="mt-8 flex flex-col gap-8">
      {choices.map((row, i) => (
        <div key={i} role="radiogroup" className="flex flex-wrap gap-8">
          {row.map((c) => (
            <Chip
              key={c}
              role="radio"
              active={answers[i] === c}
              onClick={() => {
                const next = choices.map((_, j) => answers[j])
                next[i] = answers[i] === c ? undefined : c
                onAnswer(next)
              }}
            >
              {c}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  )
}

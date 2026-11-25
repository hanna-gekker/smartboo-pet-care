// Share records — Figma 15 "Who is it for?" → 16 "Which pets?" → 17 PDF preview → 17a the iOS share sheet.
// The preview and the PDF come from one builder (lib/shareRecord.ts), so what you see is what they get.

import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { AttentionCard } from '../components/AttentionCard'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { ListRow } from '../components/ListRow'
import { Logo } from '../components/Logo'
import { PetAvatar } from '../components/PetAvatar'
import { StackScreen } from '../components/ui'
import { useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import { sharePdf } from '../lib/pdf'
import { buildRecord, petLine, SETS, type SetKey } from '../lib/shareRecord'
import { joinNames } from '../lib/vaccines'

export function Share() {
  const [params] = useSearchParams()
  const app = useApp()
  const showToast = useUi((s) => s.showToast)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [set, setSet] = useState<SetKey>('boarding')
  const [chosen, setChosen] = useState<string[]>(params.get('pet') ? [params.get('pet')!] : [])
  const [making, setMaking] = useState(false)

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const setInfo = SETS.find((s) => s.key === set)!
  // Keep the order of the pack, not the order of taps
  const picked = app.pets.filter((p) => chosen.includes(p.id)).map((p) => p.id)

  // Figma 16: an overdue vaccine on a boarding record gets a heads-up
  const overdueByPet = app.pets
    .filter((p) => picked.includes(p.id))
    .map((p) => ({ name: p.name, overdue: petLine(p, app).overdue }))
    .filter((x) => x.overdue.length > 0)
  const overdueCount = overdueByPet.reduce((n, x) => n + x.overdue.length, 0)
  // "Rocky's rabies & DHPP are overdue — the boarding may ask for proof." (a name in capitals stays as it is)
  const word = (v: string) => (/[A-Z]/.test(v.slice(1)) ? v : v.toLowerCase())
  const overdueNote = overdueByPet.length
    ? `${joinNames(overdueByPet.map((x) => `${x.name}’s ${joinNames(x.overdue.map(word))}`))} ${overdueCount === 1 ? 'is' : 'are'} overdue — the boarding may ask for proof.`
    : undefined

  const record = step === 3 ? buildRecord(set, picked, app) : undefined

  return (
    <StackScreen
      title={step === 1 ? 'Share records' : step === 2 ? setInfo.title : 'Preview'}
      withTabBar={false}
      onBack={step > 1 ? () => setStep((step - 1) as 1 | 2) : undefined}
      footer={
        step === 1 ? (
          <Button full size="large" onClick={() => setStep(2)}>
            Next · pick pets
          </Button>
        ) : step === 2 ? (
          <Button full size="large" disabled={!picked.length} onClick={() => setStep(3)}>
            {picked.length ? `Make PDF · ${picked.length} ${picked.length === 1 ? 'pet' : 'pets'}` : 'Make PDF'}
          </Button>
        ) : (
          record && (
            <div className="flex flex-col gap-8">
              <Button
                full
                size="large"
                icon="share"
                loading={making}
                onClick={async () => {
                  setMaking(true)
                  try {
                    const names = app.pets.filter((p) => picked.includes(p.id)).map((p) => p.name)
                    await sharePdf(record, `${names.join('-')} · ${record.title}.pdf`)
                  } catch {
                    showToast('Couldn’t make the PDF. Try again.')
                  } finally {
                    setMaking(false)
                  }
                }}
              >
                Share PDF
              </Button>
              <p className="text-center text-caption text-text-secondary">Opens the iOS share sheet — Mail, Messages, AirDrop…</p>
            </div>
          )
        )
      }
    >
      {step === 1 && (
        <>
          <h2 className="mt-16 font-display text-title font-medium">Who is it for?</h2>
          <Card variant="list" className="mt-16 overflow-hidden" role="radiogroup" aria-label="Who is it for?">
            {SETS.map((s) => (
              <ListRow key={s.key} icon={s.icon} iconTone="soft" title={s.title} subtitle={s.what} selected={s.key === set} onClick={() => setSet(s.key)} />
            ))}
          </Card>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="mt-16 font-display text-title font-medium">Which pets?</h2>
          <Card variant="list" className="mt-16 overflow-hidden">
            {app.pets.map((p) => (
              <button
                key={p.id}
                type="button"
                role="checkbox"
                aria-checked={chosen.includes(p.id)}
                onClick={() => toggle(p.id)}
                className="press focus-inset flex w-full items-center gap-12 p-16 text-left active:bg-surface-subtle"
              >
                {/* Figma 16: laid out like a Task row — the 24 circle 18 from the edge, a 40 photo, 12 between */}
                <span className="mx-2">
                  <Checkbox checked={chosen.includes(p.id)} />
                </span>
                <PetAvatar pet={p} size="sm" />
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-body font-medium">{p.name}</span>
                  <span className="text-body-s text-text-secondary">{petLine(p, app).text}</span>
                </span>
              </button>
            ))}
          </Card>
          {set === 'boarding' && overdueNote && (
            <div className="mt-16">
              <AttentionCard title={overdueNote} />
            </div>
          )}
        </>
      )}

      {step === 3 && record && (
        <>
          {/* Figma 17: the paper as it will look */}
          <Card className="mt-16 flex flex-col gap-16 p-24 text-caption ring-1 ring-inset ring-border-control">
            <div className="flex items-center justify-between gap-16">
              <Logo />
              <span className="text-caption text-text-secondary">{record.date}</span>
            </div>
            <h2 className="font-display text-title font-medium">{record.title}</h2>
            {record.pets.map((p) => (
              <div key={p.heading} className="flex flex-col gap-2">
                <p className="text-body font-medium text-text-primary">{p.heading}</p>
                {p.sections.map((s, i) => (
                  <div key={s.title ?? i} className={s.title ? 'mt-8' : ''}>
                    {s.title && <p className="text-caption font-medium text-text-secondary uppercase">{s.title}</p>}
                    {s.lines.map((l) => (
                      <p key={l.text} className={l.warn ? 'text-status-waiting-text' : 'text-text-secondary'}>
                        {l.text}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {record.contacts.lines.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-body font-medium text-text-primary">{record.contacts.title}</p>
                {record.contacts.lines.map((l) => (
                  <p key={l.text} className="text-text-secondary">
                    {l.text}
                  </p>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </StackScreen>
  )
}

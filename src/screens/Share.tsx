import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { ListRow } from '../components/ListRow'
import { PetAvatar } from '../components/PetAvatar'
import { StackScreen } from '../components/ui'
import { useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import { addDays, age, formatDay, today } from '../lib/dates'

type SetKey = 'boarding' | 'vet' | 'emergency'

const SETS: { key: SetKey; emoji: string; title: string; what: string }[] = [
  { key: 'boarding', emoji: '🏨', title: 'Boarding & groomer', what: 'Vaccines, vet, owner contacts' },
  { key: 'vet', emoji: '🩺', title: 'New vet', what: 'Everything: history, vaccines, meds, documents' },
  { key: 'emergency', emoji: '🚨', title: 'Emergency', what: 'Current meds, allergies, symptoms from the last 2 weeks, vet, weight' },
]

/** Share: pick a set → pick pets → PDF preview → iOS share sheet. */
export function Share() {
  const [params] = useSearchParams()
  const app = useApp()
  const showToast = useUi((s) => s.showToast)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [set, setSet] = useState<SetKey>('boarding')
  const [chosen, setChosen] = useState<string[]>(params.get('pet') ? [params.get('pet')!] : [])

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const setInfo = SETS.find((s) => s.key === set)!

  return (
    <StackScreen title={step === 1 ? 'Share records' : step === 2 ? 'Which pets?' : 'Preview'} withTabBar={false}>
      <p className="mt-4 text-body-s font-medium text-text-secondary">Step {step} of 3</p>

      {step === 1 && (
        <Card variant="list" className="mt-16 overflow-hidden">
          {SETS.map((s) => (
            <ListRow
              key={s.key}
              emoji={s.emoji}
              title={s.title}
              subtitle={s.what}
              trailing="chevron"
              onClick={() => {
                setSet(s.key)
                setStep(chosen.length ? 3 : 2)
              }}
            />
          ))}
        </Card>
      )}

      {step === 2 && (
        <>
          <Card variant="list" className="mt-16 overflow-hidden">
            {app.pets.map((p) => (
              <button
                key={p.id}
                type="button"
                role="checkbox"
                aria-checked={chosen.includes(p.id)}
                onClick={() => toggle(p.id)}
                className="press flex w-full items-center gap-16 border-t border-surface-subtle px-24 py-16 text-left first:border-t-0 active:bg-surface-subtle"
              >
                <PetAvatar pet={p} size="md" />
                <span className="flex-1 text-body font-medium">{p.name}</span>
                <Checkbox checked={chosen.includes(p.id)} />
              </button>
            ))}
          </Card>
          <div className="mt-24">
            <Button full size="large" disabled={!chosen.length} onClick={() => setStep(3)}>
              Preview PDF
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {/* A preview of the PDF. On the phone the PDF is generated with jsPDF and handed to the iOS share sheet. */}
          <Card className="mt-16 text-body-s">
            <p className="text-caption font-medium text-accent-primary uppercase">SmartBoo · {setInfo.title}</p>
            <p className="text-caption text-text-tertiary">Prepared {formatDay(today(), { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            {chosen.map((id) => {
              const p = app.pets.find((x) => x.id === id)
              if (!p) return null
              const vax = app.vaccines.filter((v) => v.petId === id)
              const meds = app.meds.filter((m) => m.petId === id && (!m.until || m.until >= today()))
              const weight = app.records.filter((r) => r.petId === id && r.type === 'weight').sort((a, b) => b.date.localeCompare(a.date))[0]
              const symptoms = app.records.filter((r) => r.petId === id && r.type === 'health' && r.date >= addDays(today(), -14))
              return (
                <div key={id} className="mt-16 border-t border-surface-subtle pt-12">
                  <p className="font-display text-body font-medium">{p.name}</p>
                  <p className="text-text-secondary">{[p.species, p.breed, age(p.birthDate), p.microchip && `Chip ${p.microchip}`].filter(Boolean).join(' · ')}</p>
                  {set !== 'emergency' && (
                    <PdfBlock title="Vaccines">{vax.length ? vax.map((v) => `${v.name} — given ${formatDay(v.given)}${v.due ? `, due ${formatDay(v.due, { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}`) : ['No vaccine records']}</PdfBlock>
                  )}
                  {set !== 'boarding' && <PdfBlock title="Current meds">{meds.length ? meds.map((m) => `${m.name} — ${m.dose}`) : ['None']}</PdfBlock>}
                  {set !== 'boarding' && <PdfBlock title="Allergies">{[p.allergies.join(', ') || 'None known']}</PdfBlock>}
                  {set === 'emergency' && <PdfBlock title="Symptoms, last 2 weeks">{symptoms.length ? symptoms.map((s) => `${formatDay(s.date)} — ${s.title}`) : ['None logged']}</PdfBlock>}
                  {set !== 'boarding' && weight && <PdfBlock title="Weight">{[`${weight.value} ${p.weightUnit} (${formatDay(weight.date)})`]}</PdfBlock>}
                  {p.vet && <PdfBlock title="Vet">{[`${p.vet.name} · ${p.vet.phone}`]}</PdfBlock>}
                </div>
              )
            })}
          </Card>
          <div className="mt-24">
            <Button
              full
              size="large"
              icon="share"
              onClick={async () => {
                const text = `${setInfo.title} records for ${chosen.map((id) => app.pets.find((p) => p.id === id)?.name).join(', ')}`
                if (navigator.share) {
                  try {
                    await navigator.share({ title: 'SmartBoo records', text })
                  } catch {
                    // closed the share sheet
                  }
                } else {
                  showToast('The share sheet opens in the iPhone app')
                }
              }}
            >
              Share PDF
            </Button>
          </div>
        </>
      )}
    </StackScreen>
  )
}

function PdfBlock({ title, children }: { title: string; children: string[] }) {
  return (
    <div className="mt-8">
      <p className="text-caption font-medium text-text-secondary uppercase">{title}</p>
      {children.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

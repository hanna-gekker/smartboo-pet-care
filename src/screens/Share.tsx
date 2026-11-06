import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Icon } from '../components/Icon'
import { Button, Card, PetAvatar, StackScreen } from '../components/ui'
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
      <p className="mt-1 text-[13px] font-medium text-ink-2">Step {step} of 3</p>

      {step === 1 && (
        <div className="mt-4 flex flex-col gap-2">
          {SETS.map((s) => (
            <Card
              key={s.key}
              onClick={() => {
                setSet(s.key)
                setStep(chosen.length ? 3 : 2)
              }}
              className="flex items-center gap-3"
            >
              <span className="text-[28px]" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-[16px] font-semibold">{s.title}</span>
                <span className="block text-[14px] text-ink-2">{s.what}</span>
              </span>
              <Icon name="chevron" size={20} className="text-ink-3" />
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <>
          <div className="mt-4 flex flex-col gap-2">
            {app.pets.map((p) => {
              const on = chosen.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(p.id)}
                  className={`press flex min-h-16 items-center gap-3 rounded-md bg-surface p-3 ring-1 ${on ? 'ring-2 ring-accent' : 'ring-line'}`}
                >
                  <PetAvatar pet={p} size={44} />
                  <span className="flex-1 text-left text-[16px] font-semibold">{p.name}</span>
                  <span className={`flex size-7 items-center justify-center rounded-full ${on ? 'bg-accent text-on-accent' : 'ring-2 ring-line'}`}>{on && <Icon name="check" size={16} />}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-6">
            <Button full disabled={!chosen.length} onClick={() => setStep(3)}>
              Preview PDF
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {/* A preview of the PDF. On the phone the PDF is generated with jsPDF and handed to the iOS share sheet. */}
          <div className="mt-4 rounded-sm bg-surface p-5 text-[13px] shadow-[0_4px_24px_-8px_var(--scrim)] ring-1 ring-line">
            <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">SmartBoo · {setInfo.title}</p>
            <p className="text-[11px] text-ink-3">Prepared {formatDay(today(), { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            {chosen.map((id) => {
              const p = app.pets.find((x) => x.id === id)
              if (!p) return null
              const vax = app.vaccines.filter((v) => v.petId === id)
              const meds = app.meds.filter((m) => m.petId === id && (!m.until || m.until >= today()))
              const weight = app.records.filter((r) => r.petId === id && r.type === 'weight').sort((a, b) => b.date.localeCompare(a.date))[0]
              const symptoms = app.records.filter((r) => r.petId === id && r.type === 'health' && r.date >= addDays(today(), -14))
              return (
                <div key={id} className="mt-4 border-t border-line pt-3">
                  <p className="font-display text-[16px] font-bold">{p.name}</p>
                  <p className="text-ink-2">{[p.species, p.breed, age(p.birthDate), p.microchip && `Chip ${p.microchip}`].filter(Boolean).join(' · ')}</p>
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
          </div>
          <div className="mt-6">
            <Button
              full
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
    <div className="mt-2">
      <p className="text-[11px] font-semibold text-ink-2 uppercase">{title}</p>
      {children.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { TextField } from '../components/TextField'
import { SectionTitle, StackScreen } from '../components/ui'
import { useApp } from '../data/useApp'
import { RED_FLAG_NOTE } from '../lib/boo'

export function Settings() {
  const navigate = useNavigate()
  const { pets, settings, updateSettings, loadSample, startFresh } = useApp()
  const vets = [...new Map(pets.filter((p) => p.vet).map((p) => [p.vet!.name, p.vet!])).values()]

  return (
    <StackScreen title="Settings">
      <SectionTitle>Vets</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        {vets.length === 0 && <p className="px-24 py-16 text-body text-text-secondary">Add a vet in a pet’s profile.</p>}
        {vets.map((v) => (
          <ListRow key={v.name} icon="phone" title={v.name} trailing={{ label: 'Call', icon: 'phone' }} href={`tel:${v.phone}`} />
        ))}
      </Card>

      <SectionTitle>Reminders</SectionTitle>
      <Card>
        <TextField
          label="Remind me before vaccines"
          value={String(settings.remindDaysBefore)}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => updateSettings({ remindDaysBefore: Number(e.target.value) })}
          options={[3, 7, 14, 30].map((d) => ({ value: String(d), label: d === 7 ? '1 week' : d === 14 ? '2 weeks' : d === 30 ? '1 month' : `${d} days` }))}
        />
      </Card>

      <SectionTitle>Boo and privacy</SectionTitle>
      <Card>
        <label className="flex min-h-control-44 items-center justify-between gap-12 text-body">
          <span>
            Let Boo read papers and phrases
            <span className="block text-body-s text-text-secondary">Sent to an AI service to be read, never kept.</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={settings.booConsent}
            onChange={(e) => updateSettings({ booConsent: e.target.checked })}
            className="size-icon-24 shrink-0 accent-accent-primary"
          />
        </label>
        <p className="mt-12 border-t border-surface-subtle pt-12 text-body-s text-text-secondary">Privacy policy — coming with the web version.</p>
      </Card>

      <SectionTitle>About</SectionTitle>
      <Card>
        <p className="text-body">SmartBoo · version 0.1</p>
        <p className="mt-4 text-body-s text-text-secondary">{RED_FLAG_NOTE}</p>
        <p className="mt-4 text-body-s text-text-secondary">Your records live on this phone. Deleting the app deletes them.</p>
      </Card>

      <SectionTitle>For testing</SectionTitle>
      <div className="flex flex-col gap-8">
        <Button full variant="secondary" onClick={loadSample}>
          Load sample pets
        </Button>
        <Button
          full
          variant="secondary"
          onClick={async () => {
            await startFresh()
            navigate('/welcome', { replace: true })
          }}
          className="!text-status-waiting-text"
        >
          Start fresh (show Welcome)
        </Button>
      </div>
    </StackScreen>
  )
}

import { useNavigate } from 'react-router'
import { Card, SectionTitle, StackScreen } from '../components/ui'
import { useApp } from '../data/useApp'
import { RED_FLAG_NOTE } from '../lib/boo'

export function Settings() {
  const navigate = useNavigate()
  const { pets, settings, updateSettings, loadSample, startFresh } = useApp()
  const vets = [...new Map(pets.filter((p) => p.vet).map((p) => [p.vet!.name, p.vet!])).values()]

  return (
    <StackScreen title="Settings">
      <SectionTitle>Vets</SectionTitle>
      <Card className="!py-4">
        {vets.length === 0 && <p className="py-12 text-body text-text-secondary">Add a vet in a pet’s profile.</p>}
        {vets.map((v) => (
          <a key={v.name} href={`tel:${v.phone}`} className="press flex min-h-[48px] items-center justify-between border-b border-surface-subtle py-8 last:border-0">
            <span className="text-body">{v.name}</span>
            <span className="text-body-s font-medium text-accent-primary">Call</span>
          </a>
        ))}
      </Card>

      <SectionTitle>Reminders</SectionTitle>
      <Card>
        <label className="flex min-h-control-44 items-center justify-between gap-12 text-body">
          Remind me before vaccines
          <select
            value={settings.remindDaysBefore}
            onChange={(e) => updateSettings({ remindDaysBefore: Number(e.target.value) })}
            className="min-h-control-44 rounded-16 bg-surface-canvas px-8 text-body ring-1 ring-surface-subtle"
          >
            {[3, 7, 14, 30].map((d) => (
              <option key={d} value={d}>
                {d === 7 ? '1 week' : d === 14 ? '2 weeks' : d === 30 ? '1 month' : `${d} days`}
              </option>
            ))}
          </select>
        </label>
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
            className="size-icon-24 shrink-0 accent-[var(--accent-primary)]"
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
        <button type="button" onClick={loadSample} className="press min-h-[48px] rounded-full bg-surface-card text-body font-medium ring-1 ring-surface-subtle">
          Load sample pets
        </button>
        <button
          type="button"
          onClick={async () => {
            await startFresh()
            navigate('/welcome', { replace: true })
          }}
          className="press min-h-[48px] rounded-full bg-surface-card text-body font-medium text-status-waiting-text ring-1 ring-surface-subtle"
        >
          Start fresh (show Welcome)
        </button>
      </div>
    </StackScreen>
  )
}

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
      <Card className="!py-1">
        {vets.length === 0 && <p className="py-3 text-[15px] text-ink-2">Add a vet in a pet’s profile.</p>}
        {vets.map((v) => (
          <a key={v.name} href={`tel:${v.phone}`} className="press flex min-h-12 items-center justify-between border-b border-line py-2 last:border-0">
            <span className="text-[15px]">{v.name}</span>
            <span className="text-[14px] font-medium text-accent">Call</span>
          </a>
        ))}
      </Card>

      <SectionTitle>Reminders</SectionTitle>
      <Card>
        <label className="flex min-h-11 items-center justify-between gap-3 text-[15px]">
          Remind me before vaccines
          <select
            value={settings.remindDaysBefore}
            onChange={(e) => updateSettings({ remindDaysBefore: Number(e.target.value) })}
            className="min-h-11 rounded-sm bg-bg px-2 text-[15px] ring-1 ring-line"
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
        <label className="flex min-h-11 items-center justify-between gap-3 text-[15px]">
          <span>
            Let Boo read papers and phrases
            <span className="block text-[13px] text-ink-2">Sent to an AI service to be read, never kept.</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={settings.booConsent}
            onChange={(e) => updateSettings({ booConsent: e.target.checked })}
            className="size-6 shrink-0 accent-[var(--accent)]"
          />
        </label>
        <p className="mt-3 border-t border-line pt-3 text-[14px] text-ink-2">Privacy policy — coming with the web version.</p>
      </Card>

      <SectionTitle>About</SectionTitle>
      <Card>
        <p className="text-[15px]">SmartBoo · version 0.1</p>
        <p className="mt-1 text-[14px] text-ink-2">{RED_FLAG_NOTE}</p>
        <p className="mt-1 text-[14px] text-ink-2">Your records live on this phone. Deleting the app deletes them.</p>
      </Card>

      <SectionTitle>For testing</SectionTitle>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={loadSample} className="press min-h-12 rounded-full bg-surface text-[15px] font-medium ring-1 ring-line">
          Load sample pets
        </button>
        <button
          type="button"
          onClick={async () => {
            await startFresh()
            navigate('/welcome', { replace: true })
          }}
          className="press min-h-12 rounded-full bg-surface text-[15px] font-medium text-warn ring-1 ring-line"
        >
          Start fresh (show Welcome)
        </button>
      </div>
    </StackScreen>
  )
}

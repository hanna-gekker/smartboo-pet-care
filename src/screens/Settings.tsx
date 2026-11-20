import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { TextField } from '../components/TextField'
import { SectionTitle, StackScreen } from '../components/ui'
import { useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import { RED_FLAG_NOTE } from '../lib/boo'
import { checkPermission, isNative, openAppSettings, pendingCount, planReminders, sendTestReminder, type Permission } from '../lib/reminders'

export function Settings() {
  const navigate = useNavigate()
  const { pets, tasks, settings, updateSettings, loadSample, startFresh, showToast } = { ...useApp(), ...useUi() }
  // Notifications: what the person chose in iOS and how many reminders are waiting. Read again on coming back
  // to the app (e.g. from the iPhone Settings, where notifications may have been turned on).
  const [permission, setPermission] = useState<Permission>()
  const [count, setCount] = useState(0)
  useEffect(() => {
    const read = async () => {
      setPermission(await checkPermission())
      setCount(isNative() ? await pendingCount() : planReminders(tasks, pets, settings.remindDaysBefore).length)
    }
    void read()
    const onShow = () => document.visibilityState === 'visible' && void read()
    document.addEventListener('visibilitychange', onShow)
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [tasks, pets, settings.remindDaysBefore])
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
      <Card variant="list" className="mb-8 overflow-hidden">
        {permission === 'denied' ? (
          <ListRow icon="bell" title="Notifications" subtitle="Off · I can't remind you" trailing={{ label: 'Open Settings' }} onClick={openAppSettings} />
        ) : (
          <ListRow icon="bell" title="Notifications" value={permission === 'granted' ? 'On' : 'Not asked yet'} />
        )}
        <ListRow icon="calendar" title="Reminders" value={count ? `${count} set` : 'No reminders yet'} />
      </Card>
      <Card>
        <TextField
          label="Remind me before"
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
          icon="bell"
          onClick={async () => {
            const p = await sendTestReminder(tasks, pets, settings.remindDaysBefore)
            setPermission(p)
            showToast(p === 'granted' ? (isNative() ? 'Test reminder in 1 minute — lock the phone' : 'Reminders only show in the iPhone app') : 'Notifications are off')
          }}
        >
          Send a test reminder in 1 minute
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

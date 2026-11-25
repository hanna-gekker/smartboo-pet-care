// Settings — Figma "18 · Settings" (and "18b · Settings · Dark"): your profile, vets, reminders, appearance, about.
// "For testing" stays at the bottom until the demo.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ListRow } from '../components/ListRow'
import { PickerRow } from '../components/PickerRow'
import { SegmentedControl } from '../components/SegmentedControl'
import { SectionTitle, StackScreen } from '../components/ui'
import type { Theme, Vet } from '../data/types'
import { useApp } from '../data/useApp'
import { useUi } from '../data/useUi'
import { formatPhone } from '../lib/phone'
import { askPermission, checkPermission, DAILY_DEFAULT, isNative, openAppSettings, sendTestReminder, type Permission } from '../lib/reminders'

const BEFORE = [3, 7, 14, 30].map((d) => ({ value: String(d), label: `${d === 7 ? '1 week' : d === 14 ? '2 weeks' : d === 30 ? '1 month' : `${d} days`} before` }))
const DAILY = [
  { value: 'off', label: 'Off' },
  // Every hour from 6:00 AM to 9:00 PM, written as in Figma: "8:00 AM"
  ...Array.from({ length: 16 }, (_, i) => i + 6).map((h) => ({ value: `${String(h).padStart(2, '0')}:00`, label: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}` })),
]
const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function Settings() {
  const navigate = useNavigate()
  const { pets, tasks, settings, updateSettings, loadSample, startFresh, showToast } = { ...useApp(), ...useUi() }
  // What the person chose for notifications in iOS. Read again on coming back to the app (e.g. from the iPhone
  // Settings, where notifications may have been turned on).
  const [permission, setPermission] = useState<Permission>()
  useEffect(() => {
    const read = async () => setPermission(await checkPermission())
    void read()
    const onShow = () => document.visibilityState === 'visible' && void read()
    document.addEventListener('visibilitychange', onShow)
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [])

  // The primary vet comes from the pets' profiles; vets added here follow it
  const fromPets = [...new Map(pets.filter((p) => p.vet?.name).map((p) => [p.vet!.name, p.vet!])).values()]
  const vets: Vet[] = [...fromPets, ...(settings.vets ?? [])]
  const owner = settings.owner

  return (
    <StackScreen title="Settings">
      <Card variant="list" className="mt-16 overflow-hidden">
        <ListRow
          icon="user"
          iconTone="soft"
          title={owner?.name || 'Your profile'}
          subtitle={owner?.phone ? formatPhone(owner.phone) : 'Add your name and phone'}
          trailing="chevron"
          onClick={() => navigate('/settings/profile')}
        />
      </Card>

      <SectionTitle>Vets</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        {vets.map((v, i) => (
          <ListRow
            key={`${v.name}-${i}`}
            icon="stethoscope"
            iconTone={i === 0 ? 'accent' : 'soft'}
            label={i === 0 ? 'Primary vet' : undefined}
            title={v.name}
            subtitle={v.clinic}
            trailing={{ label: 'Call', icon: 'phone' }}
            href={`tel:${v.phone}`}
          />
        ))}
        <ListRow icon="plus" iconTone="soft" title="Add a vet" subtitle="emergency or specialist" trailing="chevron" onClick={() => navigate('/settings/vet')} />
      </Card>

      <SectionTitle>Reminders</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        <PickerRow
          icon="bell"
          title="Vaccines & rechecks"
          options={BEFORE}
          value={String(settings.remindDaysBefore)}
          onChange={(v) => updateSettings({ remindDaysBefore: Number(v) })}
        />
        <PickerRow icon="calendar" title="Daily tasks" options={DAILY} value={settings.dailyTime ?? DAILY_DEFAULT} onChange={(v) => updateSettings({ dailyTime: v })} />
        <ListRow
          icon="bell"
          iconTone="soft"
          title="Notifications"
          subtitle={permission === 'granted' ? 'On' : permission === 'denied' ? 'Off' : permission ? 'Not asked yet' : undefined}
          trailing={permission === 'denied' ? { label: 'Open Settings' } : 'chevron'}
          onClick={async () => {
            // Never asked: ask now. Asked before: only the iPhone Settings can change it.
            if (permission === 'prompt') setPermission(await askPermission())
            else openAppSettings()
          }}
        />
      </Card>

      <SectionTitle>Appearance</SectionTitle>
      <SegmentedControl label="Appearance" tone="quiet" options={THEMES} value={settings.theme ?? 'system'} onChange={(theme) => updateSettings({ theme })} />

      <SectionTitle>About</SectionTitle>
      <Card variant="list" className="overflow-hidden">
        <ListRow icon="stethoscope" iconTone="soft" title="Boo keeps your pet’s records." subtitle="It isn’t a vet." />
        <ListRow icon="home" iconTone="soft" title="Privacy" subtitle="Your records stay on this phone" trailing="chevron" onClick={() => navigate('/settings/privacy')} />
        <ListRow icon="sparkle-ai" iconTone="soft" title="AI consent" subtitle={settings.booConsent ? 'On' : 'Off'} trailing="chevron" onClick={() => navigate('/settings/ai')} />
        <ListRow icon="check" iconTone="soft" title="Version" subtitle="0.1 · demo" />
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
            const p = await sendTestReminder(tasks, pets, settings)
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

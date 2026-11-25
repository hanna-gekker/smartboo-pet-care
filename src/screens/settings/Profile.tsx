// Your profile — Figma "18a · Your profile": photo, Name, Phone, Email (optional), Save.

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PhotoPick } from '../../components/PhotoPick'
import { TextField } from '../../components/TextField'
import { StackScreen } from '../../components/ui'
import type { Owner } from '../../data/types'
import { useApp } from '../../data/useApp'
import { formatPhone } from '../../lib/phone'

export function Profile() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useApp()
  // The phone is shown as "(415) 555-0193" (Figma), however it was saved
  const [owner, setOwner] = useState<Owner>(() => (settings.owner ? { ...settings.owner, phone: formatPhone(settings.owner.phone) } : { name: '', phone: '' }))
  const set = (patch: Partial<Owner>) => setOwner((o) => ({ ...o, ...patch }))
  const ready = owner.name.trim() !== '' && owner.phone.trim() !== ''

  return (
    <StackScreen title="Your profile" withTabBar={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!ready) return
          updateSettings({ owner: { ...owner, name: owner.name.trim(), phone: owner.phone.trim(), email: owner.email?.trim() || undefined } })
          navigate(-1)
        }}
        className="mt-16 flex flex-col gap-16"
      >
        <PhotoPick photo={owner.photo} onPick={(photo) => set({ photo })} />
        <Card className="flex flex-col gap-8">
          <TextField label="Name" required value={owner.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" />
          <TextField label="Phone" required type="tel" trailingIcon="phone" value={owner.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" />
          <TextField label="Email" type="email" placeholder="Optional" value={owner.email ?? ''} onChange={(e) => set({ email: e.target.value })} autoComplete="email" />
        </Card>
        <Button full type="submit" disabled={!ready}>
          Save
        </Button>
      </form>
    </StackScreen>
  )
}

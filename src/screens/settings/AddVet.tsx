// Add a vet — Settings → Vets → "Add a vet · emergency or specialist": Name, Clinic, Phone, Save.
// Built like Your profile (Figma 18a); Figma has no frame of its own for it.

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { TextField } from '../../components/TextField'
import { StackScreen } from '../../components/ui'
import type { Vet } from '../../data/types'
import { useApp } from '../../data/useApp'

export function AddVet() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useApp()
  const [vet, setVet] = useState<Vet>({ name: '', clinic: '', phone: '' })
  const set = (patch: Partial<Vet>) => setVet((v) => ({ ...v, ...patch }))
  const ready = vet.name.trim() !== '' && vet.phone.trim() !== ''

  return (
    <StackScreen title="Add a vet" withTabBar={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!ready) return
          const added: Vet = { name: vet.name.trim(), clinic: vet.clinic?.trim() || undefined, phone: vet.phone.trim() }
          updateSettings({ vets: [...(settings.vets ?? []), added] })
          navigate(-1)
        }}
        className="mt-16 flex flex-col gap-16"
      >
        <Card className="flex flex-col gap-8">
          <TextField label="Name" required value={vet.name} onChange={(e) => set({ name: e.target.value })} autoComplete="off" />
          <TextField label="Clinic" value={vet.clinic ?? ''} onChange={(e) => set({ clinic: e.target.value })} autoComplete="organization" />
          <TextField label="Phone" required type="tel" trailingIcon="phone" value={vet.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="off" />
        </Card>
        <Button full type="submit" disabled={!ready}>
          Save
        </Button>
      </form>
    </StackScreen>
  )
}

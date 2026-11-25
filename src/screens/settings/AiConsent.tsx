// Settings → About → AI consent: whether Boo may send papers and phrases to the AI service.

import { Card } from '../../components/Card'
import { Switch } from '../../components/Switch'
import { StackScreen } from '../../components/ui'
import { useApp } from '../../data/useApp'

export function AiConsent() {
  const { settings, updateSettings } = useApp()
  return (
    <StackScreen title="AI consent">
      <Card className="mt-16">
        <Switch
          label="Let Boo read papers and phrases"
          hint="Sent to an AI service to be read, never kept."
          checked={settings.booConsent}
          onChange={(booConsent) => updateSettings({ booConsent })}
        />
      </Card>
    </StackScreen>
  )
}

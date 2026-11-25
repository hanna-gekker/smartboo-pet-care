// Settings → About → Privacy.

import { Card } from '../../components/Card'
import { StackScreen } from '../../components/ui'

export function Privacy() {
  return (
    <StackScreen title="Privacy">
      <Card className="mt-16">
        <p className="text-body text-text-primary">Your records live on this phone. Deleting the app deletes them.</p>
        <p className="mt-12 border-t border-surface-subtle pt-12 text-body-s text-text-secondary">Privacy policy — coming with the web version.</p>
      </Card>
    </StackScreen>
  )
}

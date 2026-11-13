// /components — a check page for the base components, like a component board in Figma.
// Only in development (npm run dev); the finished app doesn't include it.
//
// /components                → light and dark side by side, each an iPhone-wide frame (390)
// /components?theme=light|dark → the board itself in one theme

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Button, type ButtonSize, type ButtonVariant } from '../components/Button'
import { Card } from '../components/Card'
import { IconButton, type IconButtonVariant } from '../components/IconButton'
import { TabBar, type Tab } from '../components/TabBar'
import { TextField } from '../components/TextField'

export default function ComponentsPage() {
  const theme = new URLSearchParams(window.location.search).get('theme')
  return theme === 'light' || theme === 'dark' ? <Board theme={theme} /> : <Frames />
}

/** Two iPhone-wide frames: light and dark. */
function Frames() {
  return (
    <div className="flex min-h-dvh flex-wrap justify-center gap-24 p-16">
      {(['light', 'dark'] as const).map((t) => (
        <Frame key={t} theme={t} />
      ))}
    </div>
  )
}

function Frame({ theme }: { theme: 'light' | 'dark' }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source === ref.current?.contentWindow && typeof e.data?.boardHeight === 'number') setHeight(e.data.boardHeight)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])
  return (
    <div className="flex flex-col gap-8">
      <p className="text-caption font-medium text-text-secondary">{theme === 'light' ? 'Light' : 'Dark'} · 390</p>
      <iframe ref={ref} title={`Components, ${theme}`} src={`/components?theme=${theme}`} width={390} height={height} className="rounded-24 ring-1 ring-surface-subtle" />
    </div>
  )
}

function Board({ theme }: { theme: 'light' | 'dark' }) {
  const root = useRef<HTMLDivElement>(null)

  // The theme is set on <html>, exactly like a manual switch in the app would do.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Tell the outer page how tall the board is, so its frame has no inner scroll.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const send = () => window.parent.postMessage({ boardHeight: el.scrollHeight }, window.location.origin)
    const observer = new ResizeObserver(send)
    observer.observe(el)
    send()
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={root} className="flex flex-col gap-32 px-16 py-24">
      <Section title="Button" note="Primary · Secondary · Ghost × Medium · Large">
        {(['primary', 'secondary', 'ghost'] as ButtonVariant[]).map((variant) => (
          <Group key={variant} label={variant}>
            {(['medium', 'large'] as ButtonSize[]).map((size) => (
              <Row key={size} label={size}>
                <Button variant={variant} size={size}>
                  Done
                </Button>
                <Button variant={variant} size={size} icon="phone">
                  Book vet
                </Button>
              </Row>
            ))}
            <Row label="pressed · focus">
              <Button variant={variant} data-state="pressed">
                Done
              </Button>
              <Button variant={variant} data-state="focus">
                Done
              </Button>
            </Row>
            <Row label="disabled · loading">
              <Button variant={variant} disabled>
                Done
              </Button>
              <Button variant={variant} loading>
                Done
              </Button>
            </Row>
          </Group>
        ))}
        <Group label="tap → loads 2 s, a second tap does nothing">
          <TapCounter />
        </Group>
      </Section>

      <Section title="Icon button" note="Primary · Secondary · Soft × 40 · 56. Tap area is 44 even for 40.">
        {(['primary', 'secondary', 'soft'] as IconButtonVariant[]).map((variant) => (
          <Row key={variant} label={variant}>
            <IconButton variant={variant} icon="mic" label="Talk to Boo" />
            <IconButton variant={variant} icon="mic" label="Talk to Boo" size={56} />
            <IconButton variant={variant} icon="mic" label="Talk to Boo" data-state="pressed" />
            <IconButton variant={variant} icon="mic" label="Talk to Boo" data-state="focus" />
            <IconButton variant={variant} icon="mic" label="Talk to Boo" disabled />
          </Row>
        ))}
        <p className="text-caption text-text-secondary">default 40 · 56 · pressed · focus · disabled</p>
      </Section>

      <Section title="Card" note="Plain · List · Tappable">
        <Card>
          <p className="text-body font-medium">Plain</p>
          <p className="text-body-s text-text-secondary">Padding 16, radius 24</p>
        </Card>
        <Card variant="list">
          {['Rocky', 'Milo', 'Cleo'].map((name) => (
            <p key={name} className="border-b border-surface-subtle px-16 py-12 text-body last:border-0">
              {name}
            </p>
          ))}
        </Card>
        <Card onClick={() => {}}>
          <p className="text-body font-medium">Tappable</p>
          <p className="text-body-s text-text-secondary">Press it</p>
        </Card>
        <Card onClick={() => {}} data-state="pressed">
          <p className="text-body font-medium">Tappable · pressed</p>
        </Card>
        <Card onClick={() => {}} data-state="focus">
          <p className="text-body font-medium">Tappable · focus</p>
        </Card>
      </Section>

      <Section title="Form field" note="Default · Focused · Needs check · Error · Disabled">
        <TextField label="Name" defaultValue="Rocky" />
        <TextField label="Name" defaultValue="Rocky" data-state="focus" />
        <TextField label="Breed" placeholder="Labrador Retriever" hint="Hint" />
        <TextField label="Born" type="date" defaultValue="2021-03-14" needsCheck />
        <TextField label="Name" defaultValue="" error="Message" />
        <TextField label="Name" defaultValue="Rocky" disabled />
        <TextField
          label="Species"
          defaultValue="dog"
          options={[
            { value: 'dog', label: 'Dog' },
            { value: 'cat', label: 'Cat' },
          ]}
        />
      </Section>

      <Section title="Tab bar" note="Active: Today · Schedule · Pets · none (Settings)">
        {(['today', 'schedule', 'pets', undefined] as (Tab | undefined)[]).map((active) => (
          <TabBar key={active ?? 'none'} active={active} onBoo={() => {}} docked={false} />
        ))}
      </Section>
    </div>
  )
}

/** Checks loading: the action runs once, however fast you tap. */
function TapCounter() {
  const [count, setCount] = useState(0)
  return (
    <Row label={`ran ${count}×`}>
      <Button
        onClick={async () => {
          setCount((c) => c + 1)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }}
      >
        Save
      </Button>
    </Row>
  )
}

function Section({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-12">
      <div>
        <h2 className="font-display text-title font-medium">{title}</h2>
        <p className="text-body-s text-text-secondary">{note}</p>
      </div>
      {children}
    </section>
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-caption font-medium text-text-secondary uppercase">{label}</p>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {children}
      <span className="text-caption text-text-tertiary">{label}</span>
    </div>
  )
}

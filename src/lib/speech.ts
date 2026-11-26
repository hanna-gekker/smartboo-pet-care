// Talk: turns what you say into text. On the iPhone it uses Apple's speech recognition (on the phone itself when
// it can, so the voice stays there; otherwise the way keyboard dictation does). In a browser it uses the Web Speech
// API where there is one. Either way it listens until stop(), through pauses: when a session ends on its own
// (a pause, a time limit), a new one starts and keeps what was already said in front of it.

import { Capacitor, type PluginListenerHandle } from '@capacitor/core'
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition'

export type ListenEvents = {
  /** Everything heard so far */
  onText: (text: string) => void
  /** A long silence before anything was said */
  onNothing: () => void
  /** Microphone or speech recognition access is off (iPhone Settings) */
  onDenied: () => void
  /** This device or browser can't listen */
  onUnavailable: () => void
}

const LANGUAGE = 'en-US'
const native = () => Capacitor.isNativePlatform()

/** Whether Talk can work here at all (the iPhone app, or a browser with speech recognition). */
export const canListen = () => native() || Boolean(webRecognition())

/** Starts listening. `hints` are words to expect, such as the pets' names. Returns stop(). */
export function listen(events: ListenEvents, hints: string[] = []): { stop: () => void } {
  return native() ? listenNative(events, hints) : listenWeb(events)
}

// --- iPhone ---

function listenNative(events: ListenEvents, hints: string[]) {
  let stopped = false
  let kept = '' // said in the sessions before this one
  let current = '' // said in this session
  let heardThisSession = false
  let quietSessions = 0
  let onDevice = false
  const handles: Promise<PluginListenerHandle>[] = []
  const text = () => [kept, current].filter(Boolean).join(' ').trim()
  const end = (then: () => void) => {
    if (stopped) return
    stopped = true
    void SpeechRecognition.stop().catch(() => {})
    then()
  }

  const start = async (attempt = 0): Promise<void> => {
    if (stopped) return
    heardThisSession = false
    try {
      await SpeechRecognition.start({
        language: LANGUAGE,
        partialResults: true,
        contextualStrings: hints,
        // The newer on-device recogniser (iOS 26+), with the keyboard dictation model
        ...(onDevice && { useOnDeviceRecognition: true, iosTranscriber: 'dictation' as const }),
      })
    } catch {
      // The last session may still be closing: try again a moment later, then give up
      if (attempt < 3) setTimeout(() => void start(attempt + 1), 400)
      else end(events.onUnavailable)
    }
  }

  void (async () => {
    const { speechRecognition } = await SpeechRecognition.requestPermissions().catch(() => ({ speechRecognition: 'denied' as const }))
    if (stopped) return
    if (speechRecognition !== 'granted') return end(events.onDenied)
    const { available } = await SpeechRecognition.available().catch(() => ({ available: false }))
    if (!available) return end(events.onUnavailable)
    onDevice = (await SpeechRecognition.isOnDeviceRecognitionAvailable({ language: LANGUAGE }).catch(() => ({ available: false }))).available
    if (stopped) return

    handles.push(
      SpeechRecognition.addListener('partialResults', (e) => {
        const said = e.matches?.[0]?.trim()
        if (stopped || !said) return
        current = said
        heardThisSession = true
        quietSessions = 0
        events.onText(text())
      }),
      SpeechRecognition.addListener('listeningState', (e) => {
        if (stopped || (e.state ?? e.status) !== 'stopped') return
        kept = text()
        current = ''
        if (!heardThisSession) {
          // The newer recogniser sometimes ends without a word on some phones: switch to the classic one
          if (onDevice) onDevice = false
          else quietSessions++
        }
        // Two quiet sessions and nothing said yet → "I didn't catch that"
        if (!kept && quietSessions >= 2) return end(events.onNothing)
        setTimeout(() => void start(), 250)
      }),
      SpeechRecognition.addListener('error', (e) => {
        if (stopped) return
        if (e.code === 'MICROPHONE_PERMISSION_DENIED') end(events.onDenied)
        else if (e.code === 'RECOGNIZER_UNAVAILABLE' || e.code === 'UNSUPPORTED_LOCALE') end(events.onUnavailable)
        // Anything else ends the session; "listeningState: stopped" starts the next one
      }),
    )
    await Promise.all(handles)
    await start()
  })()

  return {
    stop: () => {
      if (!stopped) {
        stopped = true
        void SpeechRecognition.stop().catch(() => {})
      }
      for (const h of handles) void h.then((x) => x.remove())
    },
  }
}

// --- Browser ---

function listenWeb(events: ListenEvents) {
  const Rec = webRecognition()
  if (!Rec) {
    events.onUnavailable()
    return { stop: () => {} }
  }
  let stopped = false
  let kept = ''
  let current = ''
  const rec = new Rec()
  rec.lang = LANGUAGE
  rec.interimResults = true
  rec.continuous = true
  rec.onresult = (e) => {
    current = Array.from(e.results).map((r) => r[0].transcript).join(' ')
    events.onText([kept, current].filter(Boolean).join(' ').trim())
  }
  rec.onerror = (e) => {
    if (stopped || e?.error === 'aborted') return
    // A long silence before anything was said → Boo says so; after something was said, just listen on
    if (e?.error === 'no-speech') {
      if (!kept && !current) {
        stopped = true
        events.onNothing()
      }
      return
    }
    // Anything else (microphone blocked, no speech service) means this browser can't listen
    stopped = true
    events.onUnavailable()
  }
  rec.onend = () => {
    if (stopped) return
    kept = [kept, current].filter(Boolean).join(' ').trim()
    current = ''
    try {
      rec.start()
    } catch {
      // Already listening again
    }
  }
  rec.start()
  return {
    stop: () => {
      stopped = true
      rec.stop()
    },
  }
}

function webRecognition() {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => WebRec) | undefined
}

type WebRec = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void
  onerror: (e?: { error?: string }) => void
  onend: () => void
  start: () => void
  stop: () => void
}

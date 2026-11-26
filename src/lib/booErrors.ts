// What Boo says when something goes wrong (PRODUCT.md "When something goes wrong", Figma 8e–8i).
// Every case has a second way that doesn't need the AI.

export type BooErrorCase = 'blurry' | 'not-paper' | 'camera-off' | 'offline' | 'not-heard' | 'mic-off' | 'limit' | 'failed'

export const BOO_ERRORS: Record<BooErrorCase, { input: 'paper' | 'voice'; message: string; primary: string; secondary: string }> = {
  blurry: { input: 'paper', message: "This photo is a bit blurry, so I can't read it well. Try again in good light?", primary: 'Retake photo', secondary: 'Choose another' },
  'not-paper': { input: 'paper', message: "I couldn't find pet records on this one. Is it a vet paper?", primary: 'Try another', secondary: 'Add by hand' },
  'camera-off': { input: 'paper', message: 'Camera access is off. You can turn it on in Settings, or pick a photo instead.', primary: 'Open Settings', secondary: 'Choose a photo' },
  offline: { input: 'paper', message: "You're offline. I'll read this paper as soon as you're back online.", primary: 'Got it', secondary: 'Add by hand' },
  'not-heard': { input: 'voice', message: "Sorry, I didn't catch that. Want to try again?", primary: 'Talk again', secondary: 'Type instead' },
  'mic-off': { input: 'voice', message: 'Microphone access is off. You can turn it on in Settings, or type instead.', primary: 'Open Settings', secondary: 'Type instead' },
  // Boo's server: the daily limit is used up, or it didn't answer (texts approved Nov 26)
  limit: { input: 'paper', message: "That's all I can read today. I'll be back tomorrow — or add it by hand.", primary: 'Add by hand', secondary: 'Got it' },
  failed: { input: 'paper', message: 'Something went wrong on my side. Try again in a minute?', primary: 'Try again', secondary: 'Add by hand' },
}

/** Thrown by Boo's client when it can't use a paper or a phrase, or the server can't answer. */
export class BooPaperError extends Error {
  readonly kind: Extract<BooErrorCase, 'blurry' | 'not-paper' | 'offline' | 'limit' | 'failed'>
  constructor(kind: Extract<BooErrorCase, 'blurry' | 'not-paper' | 'offline' | 'limit' | 'failed'>) {
    super(kind)
    this.kind = kind
  }
}

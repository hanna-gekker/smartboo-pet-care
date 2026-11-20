// What Boo says when something goes wrong (PRODUCT.md "When something goes wrong", Figma 8e–8i).
// Every case has a second way that doesn't need the AI.

export type BooErrorCase = 'blurry' | 'not-paper' | 'camera-off' | 'offline' | 'not-heard'

export const BOO_ERRORS: Record<BooErrorCase, { input: 'paper' | 'voice'; message: string; primary: string; secondary: string }> = {
  blurry: { input: 'paper', message: "This photo is a bit blurry, so I can't read it well. Try again in good light?", primary: 'Retake photo', secondary: 'Choose another' },
  'not-paper': { input: 'paper', message: "I couldn't find pet records on this one. Is it a vet paper?", primary: 'Try another', secondary: 'Add by hand' },
  'camera-off': { input: 'paper', message: 'Camera access is off. You can turn it on in Settings, or pick a photo instead.', primary: 'Open Settings', secondary: 'Choose a photo' },
  offline: { input: 'paper', message: "You're offline. I'll read this paper as soon as you're back online.", primary: 'Got it', secondary: 'Add by hand' },
  'not-heard': { input: 'voice', message: "Sorry, I didn't catch that. Want to try again?", primary: 'Talk again', secondary: 'Type instead' },
}

/** Thrown by readPaper when Boo can't use the paper. */
export class BooPaperError extends Error {
  readonly kind: Extract<BooErrorCase, 'blurry' | 'not-paper' | 'offline'>
  constructor(kind: Extract<BooErrorCase, 'blurry' | 'not-paper' | 'offline'>) {
    super(kind)
    this.kind = kind
  }
}

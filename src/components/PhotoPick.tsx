// Photo pick — Figma 18a "Your profile": a 110 circle on surface/card with a camera icon, and "Add a photo"
// under it. With a photo: the photo fills the circle and the link says "Change photo".
// The picked photo is made small (320 px JPEG) and kept as text in the data file, so it survives a restart.

import { useRef } from 'react'
import { Icon } from './Icon'
import type { ShowState } from './showState'

type PhotoPickProps = {
  photo?: string
  onPick: (dataUrl: string) => void
  /** What VoiceOver reads, e.g. "Add a photo of you". Defaults to the link text. */
  'aria-label'?: string
  'data-state'?: ShowState
}

const SIDE = 320

async function shrink(file: File): Promise<string> {
  const img = await createImageBitmap(file)
  const scale = Math.min(1, SIDE / Math.min(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85)
}

export function PhotoPick({ photo, onPick, 'aria-label': ariaLabel, 'data-state': state }: PhotoPickProps) {
  const input = useRef<HTMLInputElement>(null)
  const text = photo ? 'Change photo' : 'Add a photo'
  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel ?? text}
        onClick={() => input.current?.click()}
        data-state={state}
        className="press mx-auto flex flex-col items-center gap-12 rounded-24"
      >
        <span className="shadow-card flex size-[110px] items-center justify-center overflow-hidden rounded-full bg-surface-card text-accent-primary">
          {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <Icon name="camera" size={24} />}
        </span>
        <span className="text-body-s font-medium text-accent-primary">{text}</span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onPick(await shrink(file))
        }}
      />
    </>
  )
}

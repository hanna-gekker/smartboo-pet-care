// SmartBoo logo — Figma "Logo / Type=Wordmark, Color=Blue" (the app header on Today and Schedule): the word
// "SmartBoo" alone, "Smart" in text/primary and "Boo" in accent/primary, both following the theme.
// In Figma the letters are a traced shape too heavy to inline (~240 KB), so it ships as two sharp 3× pictures
// exported from Figma in the Light and Dark modes; the theme picks one (CSS in base.css).

import dark from '../assets/logo/wordmark-dark.webp'
import light from '../assets/logo/wordmark-light.webp'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span role="img" aria-label="SmartBoo" className={`inline-flex h-[32px] w-[86px] shrink-0 ${className}`}>
      <img src={light} alt="" draggable={false} className="only-light size-full select-none" />
      <img src={dark} alt="" draggable={false} className="only-dark size-full select-none" />
    </span>
  )
}

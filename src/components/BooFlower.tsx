// Boo's "jelly flower" — Figma "Boo · Jelly flower" (144 × 144 box, centre 71.91), face G8.
// Eight glossy petals around a soft core, with a face: round eyes with two glints each, a small smile and blush.
// The colours are the Boo palette in base.css (--boo-*), light and dark; they follow the phone's theme.
// Parts are separate groups so they can move on their own: .boo-flower (the petals), .boo-core (the face),
// .boo-eyes (squash for a blink) and .boo-glints (they slide to look left or right).
// Drawing only: BooCharacter adds the glow, the halos and the motion; Logo uses it still.

const C = 71.91
const PETAL_R = 18.577
// Petal centres: every 45°, starting at the top, 37.15 from the centre
const petals = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4
  return { x: C + 37.153 * Math.sin(a), y: C - 37.153 * Math.cos(a) }
})

export function BooFlower({ id, shadow = true }: { id: string; shadow?: boolean }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-shadow`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(71.91 134.23) scale(40.75 5.99)">
          <stop style={{ stopColor: 'var(--boo-shadow)', stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: 'var(--boo-shadow)', stopOpacity: 0 }} />
        </radialGradient>
        {/* One petal gradient set in petal-local units (centre 0,0), reused by every petal */}
        <radialGradient id={`${id}-petal`} cx="-4.46" cy="-7.43" r="31.58" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--boo-petal-1)' }} />
          <stop offset="0.42" style={{ stopColor: 'var(--boo-petal-2)' }} />
          <stop offset="0.82" style={{ stopColor: 'var(--boo-petal-3)' }} />
          <stop offset="1" style={{ stopColor: 'var(--boo-petal-4)' }} />
        </radialGradient>
        <radialGradient id={`${id}-rim`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.7" style={{ stopColor: 'var(--boo-rim)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: 'var(--boo-rim)', stopOpacity: 0.55 }} />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="0.5" cy="0.5" r="0.5">
          <stop style={{ stopColor: 'var(--boo-gloss)', stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: 'var(--boo-gloss)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}-face-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.707" style={{ stopColor: 'var(--boo-face-glow-1)' }} />
          <stop offset="0.736" style={{ stopColor: 'var(--boo-face-glow-2)' }} />
          <stop offset="0.793" style={{ stopColor: 'var(--boo-face-glow-3)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}-core`} cx="66.35" cy="60.79" r="55.61" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--boo-core-1)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--boo-core-2)' }} />
          <stop offset="0.85" style={{ stopColor: 'var(--boo-core-3)' }} />
          <stop offset="1" style={{ stopColor: 'var(--boo-core-4)' }} />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx={C} cy="134.23" rx="40.75" ry="5.99" fill={`url(#${id}-shadow)`} />}

      <g className="boo-flower">
        {petals.map((p, i) => (
          <g key={i} transform={`translate(${p.x.toFixed(3)} ${p.y.toFixed(3)})`}>
            <circle r={PETAL_R} fill={`url(#${id}-petal)`} />
            <circle r={PETAL_R} fill={`url(#${id}-rim)`} />
            <ellipse cx="-6.13" cy="-7.43" rx="7.8" ry="4.83" transform="rotate(-28 -6.13 -7.43)" fill={`url(#${id}-gloss)`} />
          </g>
        ))}
      </g>

      <g className="boo-core">
        <circle cx={C} cy={C} r="48.66" fill={`url(#${id}-face-glow)`} />
        <circle cx={C} cy={C} r="34.757" fill={`url(#${id}-core)`} />
        <circle cx={C} cy={C} r="34.757" fill={`url(#${id}-rim)`} />
        <ellipse cx="60.44" cy="58.01" rx="14.6" ry="9.04" transform="rotate(-28 60.44 58.01)" fill={`url(#${id}-gloss)`} />
        {/* Blush */}
        <ellipse cx="52.5" cy="77" rx="6.5" ry="3.75" opacity="0.5" style={{ fill: 'var(--boo-blush)' }} />
        <ellipse cx="91.51" cy="77" rx="6.5" ry="3.75" opacity="0.5" style={{ fill: 'var(--boo-blush)' }} />
        {/* Eyes stay put; only the glints move (gaze) */}
        <g className="boo-eyes">
          <circle cx="62.8" cy="68.5" r="6.3" style={{ fill: 'var(--boo-ink)' }} />
          <circle cx="81.2" cy="68.5" r="6.3" style={{ fill: 'var(--boo-ink)' }} />
        </g>
        <g className="boo-glints" style={{ fill: 'var(--boo-gloss)' }}>
          <circle cx="65.07" cy="66.11" r="2.02" />
          <circle cx="83.47" cy="66.11" r="2.02" />
          <circle cx="60.91" cy="71.34" r="0.94" />
          <circle cx="79.31" cy="71.34" r="0.94" />
        </g>
        <path d="M67.61 78.5C70.24 81.17 73.76 81.17 76.39 78.5" strokeWidth="1.9" strokeLinecap="round" fill="none" style={{ stroke: 'var(--boo-ink)' }} />
      </g>
    </>
  )
}

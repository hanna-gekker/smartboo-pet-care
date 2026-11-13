// Glass card — Figma "Glass card" (Welcome): a frosted card with a photo, a line and a small caption.
// The glass itself (see-through fill, blur behind, ai/* gradient edge) is the .glass class in base.css.

type GlassCardProps = {
  /** Photo, 40 × 40, round. */
  image: string
  title: string
  caption: string
}

export function GlassCard({ image, title, caption }: GlassCardProps) {
  return (
    <div className="glass flex max-w-full items-center gap-12 rounded-24 py-12 pr-[18px] pl-12">
      <img src={image} alt="" className="size-avatar-40 shrink-0 rounded-full object-cover" draggable={false} />
      <div className="flex min-w-0 flex-col gap-2 text-left">
        <p className="text-caption font-medium text-text-primary">{title}</p>
        <p className="text-caption text-text-secondary">{caption}</p>
      </div>
    </div>
  )
}

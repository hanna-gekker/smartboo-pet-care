// Small date helpers. Dates are stored as local "YYYY-MM-DD" strings.

const pad = (n: number) => String(n).padStart(2, '0')

export function toDay(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function today(): string {
  return toDay(new Date())
}

export function addDays(day: string, n: number): string {
  const d = fromDay(day)
  d.setDate(d.getDate() + n)
  return toDay(d)
}

export function addMonths(day: string, n: number): string {
  const d = fromDay(day)
  d.setMonth(d.getMonth() + n)
  return toDay(d)
}

export function daysBetween(a: string, b: string): number {
  return Math.round((fromDay(b).getTime() - fromDay(a).getTime()) / 86_400_000)
}

/** Monday-first week that contains the day */
export function weekOf(day: string): string[] {
  const d = fromDay(day)
  const shift = (d.getDay() + 6) % 7
  const monday = addDays(day, -shift)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function formatDay(day: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  return fromDay(day).toLocaleDateString('en-US', opts)
}

export function formatTime(time?: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: m ? '2-digit' : undefined })
}

/** "today", "tomorrow", "in 5 days", "in 3 weeks", "in 5 months", "2 days ago" */
export function relative(day: string, from = today()): string {
  const n = daysBetween(from, day)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n === -1) return 'yesterday'
  if (n < 0) return `${-n} days ago`
  if (n < 14) return `in ${n} days`
  if (n < 60) return `in ${Math.round(n / 7)} weeks`
  return `in ${Math.round(n / 30)} months`
}

export function age(birthDate?: string): string {
  if (!birthDate) return ''
  const months = Math.floor(daysBetween(birthDate, today()) / 30.44)
  if (months < 12) return `${months} mo`
  const years = Math.floor(months / 12)
  return `${years} yr${years > 1 ? 's' : ''}`
}

/** Short age, as in the Pets list: "7 y", "5 mo". */
export function ageShort(birthDate?: string): string {
  if (!birthDate) return ''
  const months = Math.floor(daysBetween(birthDate, today()) / 30.44)
  return months < 12 ? `${months} mo` : `${Math.floor(months / 12)} y`
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

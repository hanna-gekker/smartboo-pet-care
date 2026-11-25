/** "+14155550193" or "4155550193" → "(415) 555-0193". Anything that isn't a US number is shown as typed. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const us = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (us.length !== 10) return phone
  return `(${us.slice(0, 3)}) ${us.slice(3, 6)}-${us.slice(6)}`
}

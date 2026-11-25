// The shared record as a PDF (Share → "Share PDF", Figma 17 → 17a): US Letter, the SmartBoo wordmark and the date,
// the record's title, a block per pet, then "Vet & owner". On the iPhone it is saved to the app's cache and handed to
// the iOS share sheet (Mail, Messages, AirDrop, Files); in the browser it goes to the Web Share sheet or downloads.
// jsPDF loads only when a PDF is made.
//
// A PDF is printed paper, always light, whatever the app's theme: its colours are the Light values of our tokens
// (jsPDF can't read CSS variables). Keep them in step with tokens.css.

import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import wordmark from '../assets/logo/wordmark-light.webp'
import type { ShareRecord } from './shareRecord'
import { isNative } from './reminders'

const INK = '#1D2150' // text/primary = navy/900
const MUTED = '#5D6185' // text/secondary = navy/600
const ACCENT = '#5068DD' // accent/primary = indigo/550
const WARN = '#C42648' // status/waiting-text = rose/700

/** The webp wordmark as a PNG for jsPDF (which reads PNG and JPEG). */
async function wordmarkPng(): Promise<{ data: string; w: number; h: number }> {
  const img = new Image()
  img.src = wordmark
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d')!.drawImage(img, 0, 0)
  return { data: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }
}

export async function makePdf(record: ShareRecord): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 56
  let y = M

  const ensure = (h: number) => {
    if (y + h > H - M) {
      doc.addPage()
      y = M
    }
  }
  const text = (s: string, size: number, color: string, style: 'normal' | 'bold' = 'normal', gap = 4) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(color)
    for (const line of doc.splitTextToSize(s, W - 2 * M) as string[]) {
      ensure(size * 1.3)
      doc.text(line, M, y + size)
      y += size * 1.3
    }
    y += gap
  }

  // Header: the wordmark on the left, the date on the right
  const logo = await wordmarkPng()
  const lh = 22
  doc.addImage(logo.data, 'PNG', M, y, (logo.w / logo.h) * lh, lh)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(MUTED)
  doc.text(record.date, W - M, y + 15, { align: 'right' })
  y += lh + 24

  text(record.title, 22, INK, 'bold', 14)

  for (const pet of record.pets) {
    ensure(40)
    text(pet.heading, 13, INK, 'bold', 4)
    for (const s of pet.sections) {
      if (s.title) text(s.title.toUpperCase(), 8, MUTED, 'bold', 2)
      for (const l of s.lines) text(l.text, 10.5, l.warn ? WARN : MUTED, 'normal', 1)
      y += 6
    }
    y += 10
  }

  if (record.contacts.lines.length) {
    text(record.contacts.title!, 13, INK, 'bold', 4)
    for (const l of record.contacts.lines) text(l.text, 10.5, MUTED, 'normal', 1)
  }

  // A quiet footer on every page
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(ACCENT)
    doc.text('Made with SmartBoo · Boo keeps your pet’s records. It isn’t a vet.', M, H - 28)
  }
  return doc.output('blob')
}

const base64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(blob)
  })

/** Makes the PDF and opens the share sheet. Returns false when the person closed it or nothing could share. */
export async function sharePdf(record: ShareRecord, fileName: string): Promise<boolean> {
  const blob = await makePdf(record)
  if (isNative()) {
    const { uri } = await Filesystem.writeFile({ path: fileName, data: await base64(blob), directory: Directory.Cache })
    try {
      await Share.share({ title: record.title, url: uri, dialogTitle: record.title })
      return true
    } catch {
      return false // closed the share sheet
    }
  }
  const file = new File([blob], fileName, { type: 'application/pdf' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: record.title })
      return true
    } catch {
      return false
    }
  }
  // No share sheet (desktop browsers): download it
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  return true
}

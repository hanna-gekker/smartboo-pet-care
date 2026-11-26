// Renders the test papers from papers.mjs into evals/boo/out/ (ignored by git; run again any time):
// PDFs as printed, photos as if snapped on a table with a phone (angle, shadow, blur, JPEG).
// Needs Google Chrome (headless) and sharp (installed with the project).
//
// Run: node evals/boo/make-papers.mjs

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { PAPERS } from './papers.mjs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = 'evals/boo/out'
const SRC = path.join(OUT, 'src')
fs.mkdirSync(SRC, { recursive: true })

const chrome = (...args) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-pdf-header-footer', ...args], { stdio: 'ignore' })

const htmlFor = (p) => (p.from ? PAPERS.find((x) => x.file === p.from).html : p.html)

async function screenshot(p) {
  const html = path.resolve(SRC, `${p.file}.html`)
  const png = path.resolve(SRC, `${p.file}.png`)
  fs.writeFileSync(html, htmlFor(p))
  chrome(`--screenshot=${png}`, '--window-size=1275,1650', `file://${html}`)
  return png
}

/** The page lying on a table, shot with a phone. */
async function photo(png, out, { angle = 0, shadow = false, blur = 0, scale = 1 } = {}) {
  const W = 1500, H = 1900
  let pageImg = sharp(png).resize(Math.round(1275 * 0.95 * scale))
  pageImg = sharp(await pageImg.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer())
  const meta = await pageImg.metadata()
  const table = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
    <linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a7825c"/><stop offset="1" stop-color="#8a6747"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#t)"/></svg>`
  const layers = [{ input: await pageImg.toBuffer(), left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }]
  if (shadow) {
    layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
      <radialGradient id="s" cx="0.9" cy="0.05" r="1.1"><stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="0.6" stop-color="#000" stop-opacity="0.12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#s)"/></svg>`), left: 0, top: 0 })
  }
  let img = sharp(Buffer.from(table)).composite(layers)
  img = sharp(await img.png().toBuffer())
  if (blur) img = img.blur(blur)
  await img.jpeg({ quality: 78 }).toFile(out)
}

for (const p of PAPERS) {
  const out = path.join(OUT, p.file)
  if (p.file.endsWith('.pdf')) {
    const html = path.resolve(SRC, `${p.file}.html`)
    fs.writeFileSync(html, htmlFor(p))
    chrome(`--print-to-pdf=${path.resolve(out)}`, `file://${html}`)
  } else {
    await photo(await screenshot(p), out, p.photo)
  }
  console.log('✓', p.file, '—', p.note)
}

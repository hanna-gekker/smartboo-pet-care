// The iOS launch screen (splash): the surface/canvas colour of each theme with Boo (idle) in the middle, no text.
// Writes into the Xcode asset catalog:
//   SplashBackground.colorset — surface/canvas, light and dark (from src/styles/tokens.css)
//   Splash.imageset           — Boo at 180 pt (1x/2x/3x), the dark picture for the dark theme
// LaunchScreen.storyboard fills the screen with the colour and centres Boo.
// A full-screen 2732 px picture was not drawn by iOS at launch, so the picture stays small.
// Run with `npm run assets` (also makes the app icon from assets/icon-only.png).
const sharp = require('sharp')
const fs = require('fs')

const css = fs.readFileSync('src/styles/tokens.css', 'utf8')
const hex = (name) => css.match(new RegExp(`--${name}: (#[0-9A-F]{6})`, 'i'))[1]
const CATALOG = 'ios/App/App/Assets.xcassets'
const PT = 180 // close to Boo on Welcome

const rgb = (h) => {
  const n = parseInt(h.slice(1), 16)
  const c = (v) => ((v & 255) / 255).toFixed(3)
  return { red: c(n >> 16), green: c(n >> 8), blue: c(n), alpha: '1.000' }
}
const color = (h, dark) => ({
  ...(dark && { appearances: [{ appearance: 'luminosity', value: 'dark' }] }),
  color: { 'color-space': 'srgb', components: rgb(h) },
  idiom: 'universal',
})

;(async () => {
  // surface/canvas: neutral/80 in light, lavender/940 in dark
  fs.mkdirSync(`${CATALOG}/SplashBackground.colorset`, { recursive: true })
  fs.writeFileSync(
    `${CATALOG}/SplashBackground.colorset/Contents.json`,
    JSON.stringify({ colors: [color(hex('neutral-80')), color(hex('lavender-940'), true)], info: { author: 'xcode', version: 1 } }, null, 2) + '\n',
  )

  const dir = `${CATALOG}/Splash.imageset`
  fs.mkdirSync(dir, { recursive: true })
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.png')) fs.rmSync(`${dir}/${f}`)
  const images = []
  for (const [src, suffix, dark] of [['idle', '', false], ['idle-dark', '-dark', true]]) {
    for (const scale of [1, 2, 3]) {
      const filename = `splash-boo${suffix}@${scale}x.png`
      await sharp(`src/assets/boo/${src}.webp`).resize(PT * scale, PT * scale).png().toFile(`${dir}/${filename}`)
      images.push({ ...(dark && { appearances: [{ appearance: 'luminosity', value: 'dark' }] }), filename, idiom: 'universal', scale: `${scale}x` })
    }
  }
  fs.writeFileSync(`${dir}/Contents.json`, JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2) + '\n')
})()

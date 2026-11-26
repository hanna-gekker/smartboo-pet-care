// POST /api/boo — Boo's only server piece (Cloudflare Pages Function).
//
// Body (JSON), one of:
//   { "type": "paper",  "mediaType": "image/jpeg" | … | "application/pdf", "data": "<base64>" }
//   { "type": "phrase", "text": "Rocky weighs 25 lb", "context": { today, pets, vaccines, records } }
// Header: X-Boo-Device — an anonymous id the app makes once (no personal data); used only for the daily limit.
// Answer: { "paper": … } or { "phrase": … } (forms in server/boo), or { "error": "…" } with a 4xx/5xx status.
//
// The AI key is the Cloudflare secret ANTHROPIC_API_KEY and never reaches the app.
// Papers and phrases are not stored or logged: only daily counters per device (KV, kept 2 days).

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import { PAPER_MEDIA, PAPER_SYSTEM, Paper, paperBlock } from '../../server/boo/paper.ts'
import { PHRASE_SYSTEM, Phrase, PhraseContext, phraseMessage } from '../../server/boo/phrase.ts'

type Env = { ANTHROPIC_API_KEY: string; BOO_LIMITS?: KVNamespace }

const MODEL = 'claude-opus-5-5'
const PER_DEVICE_PER_DAY = 50
const ALL_DEVICES_PER_DAY = 1000 // a ceiling on the whole bill, whatever happens
const MAX_PAPER_BYTES = 10 * 1024 * 1024 // the app shrinks photos well below this

// The web version, its previews, the iPhone app (Capacitor) and local development
const ALLOWED_ORIGIN = /^(https:\/\/([a-z0-9-]+\.)?smartboo-pet-care\.pages\.dev|capacitor:\/\/localhost|http:\/\/localhost(:\d+)?)$/

const Body = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paper'), mediaType: z.enum(PAPER_MEDIA), data: z.string().min(1) }),
  z.object({ type: z.literal('phrase'), text: z.string().min(1).max(1000), context: PhraseContext }),
])

const cors = (origin: string | null): Record<string, string> =>
  origin && ALLOWED_ORIGIN.test(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Boo-Device', 'Access-Control-Max-Age': '86400', Vary: 'Origin' }
    : {}

export const onRequestOptions: PagesFunction<Env> = ({ request }) => new Response(null, { status: 204, headers: cors(request.headers.get('Origin')) })

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin')
  const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...cors(origin) } })

  // Only our own pages and app (a browser on another site can't call Boo)
  if (origin && !ALLOWED_ORIGIN.test(origin)) return reply({ error: 'origin' }, 403)
  const device = request.headers.get('X-Boo-Device') ?? ''
  if (!/^[a-z0-9-]{8,64}$/i.test(device)) return reply({ error: 'device' }, 400)
  if (!env.ANTHROPIC_API_KEY) return reply({ error: 'not-configured' }, 503)

  const parsed = Body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return reply({ error: 'bad-request' }, 400)
  const body = parsed.data
  if (body.type === 'paper' && body.data.length * 0.75 > MAX_PAPER_BYTES) return reply({ error: 'too-big' }, 413)

  if (!(await withinLimits(env.BOO_LIMITS, device))) return reply({ error: 'limit' }, 429)

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 60_000 })
  try {
    if (body.type === 'paper') {
      const response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        // A refusal is retried on another model by Anthropic itself
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'medium', format: betaZodOutputFormat(Paper) },
        system: [{ type: 'text', text: PAPER_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: [paperBlock(body.mediaType, body.data), { type: 'text', text: 'Read this paper.' }] }],
      })
      if (!response.parsed_output) return reply({ error: response.stop_reason === 'refusal' ? 'refused' : 'unreadable' }, 422)
      return reply({ paper: response.parsed_output })
    }

    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(Phrase) },
      system: [{ type: 'text', text: PHRASE_SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: phraseMessage(body.text, body.context) }],
    })
    if (!response.parsed_output) return reply({ error: response.stop_reason === 'refusal' ? 'refused' : 'unclear' }, 422)
    // Never point at a pet, vaccine or record the app didn't send
    return reply({ phrase: onlyKnownIds(response.parsed_output, body.context) })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return reply({ error: 'busy' }, 503)
    if (error instanceof Anthropic.APIError) return reply({ error: 'ai', status: error.status }, 502)
    return reply({ error: 'ai' }, 502)
  }
}

/** Daily counters: per device and for everyone together. Without KV (local runs) there is no limit. */
async function withinLimits(kv: KVNamespace | undefined, device: string) {
  if (!kv) return true
  const day = new Date().toISOString().slice(0, 10)
  const keys = [`d:${day}:${device}`, `all:${day}`]
  const [mine, all] = await Promise.all(keys.map(async (k) => Number((await kv.get(k)) ?? 0)))
  if (mine >= PER_DEVICE_PER_DAY || all >= ALL_DEVICES_PER_DAY) return false
  await Promise.all([kv.put(keys[0], String(mine + 1), { expirationTtl: 172800 }), kv.put(keys[1], String(all + 1), { expirationTtl: 172800 })])
  return true
}

function onlyKnownIds(p: Phrase, ctx: PhraseContext): Phrase {
  const pets = new Set(ctx.pets.map((x) => x.id))
  const vaccines = new Set(ctx.vaccines.map((x) => x.id))
  const records = new Set(ctx.records.map((x) => x.id))
  return {
    ...p,
    petIds: p.petIds.filter((id) => pets.has(id)),
    question: p.question && {
      ...p.question,
      vaccineIds: p.question.vaccineIds.filter((id) => vaccines.has(id)),
      recordIds: p.question.recordIds.filter((id) => records.has(id)),
    },
  }
}

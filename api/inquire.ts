import { InquirySchema } from '../src/utils/schema'

export default async function handler(req: Request): Promise<Response> {
  const t0 = Date.now()

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method Not Allowed. Use POST /api/inquire.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const rawBody = await req.json()
    const parsed = InquirySchema.safeParse(rawBody)

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Zod Schema Validation Failed',
          issues: parsed.error.issues,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const receiptId = `INQ-${Date.now().toString(36).toUpperCase()}`
    return new Response(
      JSON.stringify({
        ok: true,
        receiptId,
        timestamp: new Date().toISOString(),
        transport: 'vercel-edge-fn',
        latencyMs: Math.max(4, Date.now() - t0),
        validatedPayload: parsed.data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Malformed JSON request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

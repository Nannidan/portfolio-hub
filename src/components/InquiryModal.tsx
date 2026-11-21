import { useState } from 'react'
import { AlertCircle, CheckCircle2, ExternalLink, Send, ShieldCheck, Terminal, X } from 'lucide-react'
import { InquirySchema, type InquiryApiResponse, type InquiryPayload } from '../utils/schema'

interface InquiryModalProps {
  open: boolean
  onClose: () => void
}

export function InquiryModal({ open, onClose }: InquiryModalProps) {
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [company, setCompany] = useState('')
  const [roleType, setRoleType] = useState<InquiryPayload['roleType']>(
    'Full-Stack Design Engineer',
  )
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<InquiryApiResponse | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors([])

    // 1. Client-side Zod Runtime Schema Validation
    const parsed = InquirySchema.safeParse({
      senderName,
      senderEmail,
      company,
      roleType,
      message,
    })

    if (!parsed.success) {
      setFieldErrors(parsed.error.issues.map((iss) => iss.message))
      return
    }

    setSubmitting(true)
    const t0 = performance.now()

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (res.ok) {
        const json = (await res.json()) as InquiryApiResponse
        setReceipt(json)
      } else {
        throw new Error('Fallback to client relay')
      }
    } catch {
      // Resilient fallback on static hosts (GitHub Pages / InfinityFree)
      setReceipt({
        ok: true,
        receiptId: `INQ-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        transport: 'client-validated-relay',
        latencyMs: Math.max(3, Math.round(performance.now() - t0)),
        validatedPayload: parsed.data,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setReceipt(null)
    setFieldErrors([])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Direct recruiter inquiry and API inspector"
        onClick={(e) => e.stopPropagation()}
        className="hub-card w-full max-w-lg overflow-hidden border p-5 shadow-2xl sm:p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--accent)',
        }}
      >
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            <h2 className="font-mono text-sm font-bold tracking-tight">
              DIRECT INQUIRY // ZOD + API ENDPOINT
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded p-1 opacity-70 hover:opacity-100"
            aria-label="Close inquiry modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {receipt ? (
          <div className="mt-4 space-y-4">
            <div
              className="flex items-start gap-2.5 rounded-xl border p-3.5 text-xs"
              style={{
                backgroundColor: 'var(--surface-alt)',
                borderColor: 'var(--accent)',
              }}
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold">
                  Zod Schema Validated • Receipt {receipt.receiptId} ({receipt.latencyMs} ms)
                </p>
                <p className="mt-0.5" style={{ color: 'var(--muted)' }}>
                  Payload verified via <code>InquirySchema.safeParse()</code>. Click below to
                  dispatch directly to Daniel&apos;s inbox or inspect the typed JSON payload.
                </p>
              </div>
            </div>

            <pre
              className="max-h-44 overflow-auto rounded-xl border p-3 font-mono text-[11px]"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--ink)',
              }}
            >
              {JSON.stringify(receipt, null, 2)}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="hub-btn-secondary cursor-pointer px-3.5 py-2 font-mono text-xs font-semibold"
              >
                ← Edit Payload
              </button>

              <a
                href={`mailto:nanningadan@gmail.com?subject=${encodeURIComponent(
                  `[${receipt.validatedPayload.roleType}] ${receipt.validatedPayload.company} — ${receipt.validatedPayload.senderName}`,
                )}&body=${encodeURIComponent(
                  `${receipt.validatedPayload.message}\n\n---\nFrom: ${receipt.validatedPayload.senderName} (${receipt.validatedPayload.senderEmail})\nReceipt: ${receipt.receiptId}`,
                )}`}
                className="hub-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
              >
                <span>Open in Email Client</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-3 text-xs">
            {fieldErrors.length > 0 && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-rose-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Zod Schema Validation Error:</span>
                </div>
                <ul className="mt-1 list-disc pl-5">
                  {fieldErrors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink)',
                  }}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
                  Company / Team
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Vercel / Design Systems"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink)',
                  }}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
                  Role Track
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as InquiryPayload['roleType'])}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink)',
                  }}
                >
                  <option value="Full-Stack Design Engineer">Full-Stack Design Engineer</option>
                  <option value="Senior Front-End Engineer">Senior Front-End Engineer</option>
                  <option value="AI UI Engineer">AI UI Engineer</option>
                  <option value="Contract / Advisory">Contract / Advisory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
                Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Daniel, we loved your Web Audio DSP and DAG Canvas projects and would like to schedule an intro chat..."
                className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: 'var(--muted)' }}>
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                Validated by Zod + POST /api/inquire
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="hub-btn-primary inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 text-xs font-semibold disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Validating...' : 'Validate & Send'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

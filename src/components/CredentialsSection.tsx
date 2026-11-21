import { Award, CheckCircle2, ExternalLink } from 'lucide-react'

interface CompletedBadge {
  title: string
  category: string
}

const COMPLETED_BADGES: CompletedBadge[] = [
  { title: 'Google Developer Program', category: 'Core Profile' },
  { title: 'AI-ML & Gemini Integration', category: 'Generative AI' },
  { title: 'Passkeys & Auth Architecture', category: 'Security' },
  { title: 'Kotlin Multiplatform', category: 'Cross-Platform' },
  { title: 'Modern UI & Compose Systems', category: 'UI Architecture' },
  { title: 'Accessibility & Inclusive UX', category: 'WCAG / A11y' },
  { title: 'UX & Large-Screen Adaptive UI', category: 'Design Systems' },
  { title: 'Agentic AI & Prompt Engineering', category: 'AI Studio' },
]

export function CredentialsSection() {
  return (
    <section
      aria-labelledby="credentials-heading"
      className="mt-8 rounded-xl border px-4 py-3.5 sm:px-5"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
          <h2
            id="credentials-heading"
            className="font-mono text-[11px] font-bold tracking-wider uppercase"
            style={{ color: 'var(--ink)' }}
          >
            Google for Developers — Earned Skill Badges
          </h2>
        </div>

        <a
          href="https://developers.google.com/profile"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: 'var(--accent)' }}
        >
          <span>Verified Profile</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {COMPLETED_BADGES.map((badge) => (
          <span
            key={badge.title}
            className="hub-pill inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs"
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderColor: 'var(--border)',
              color: 'var(--ink)',
            }}
          >
            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />
            <span className="font-medium">{badge.title}</span>
            <span
              className="font-mono text-[10px]"
              style={{ color: 'var(--muted)' }}
            >
              • {badge.category}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

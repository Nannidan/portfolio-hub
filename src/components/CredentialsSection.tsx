import { Award, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'

interface CredentialBadge {
  id: string
  title: string
  issuer: string
  track: string
  timeToEarn: string
  status: 'Verified Track' | 'Active Lab'
  url: string
}

const GOOGLE_BADGES: CredentialBadge[] = [
  {
    id: 'google-dev-program',
    title: 'Google Developer Program & Builders Hub Member',
    issuer: 'Google for Developers',
    track: 'Cloud • AI Studio • Web Platform',
    timeToEarn: 'Instant Profile Badge',
    status: 'Verified Track',
    url: 'https://developers.google.com/profile',
  },
  {
    id: 'gemini-agents-gear',
    title: 'Introduction to Agents & Google Agent Ecosystem (GEAR)',
    issuer: 'Google Cloud Skills Boost',
    track: 'Agentic AI Architecture & Tool Use',
    timeToEarn: '~45 min Free Skill Badge',
    status: 'Active Lab',
    url: 'https://www.cloudskillsboost.google/paths',
  },
  {
    id: 'prompt-design-vertex',
    title: 'Prompt Design in Vertex AI & Multimodal Studio',
    issuer: 'Google Cloud Skills Boost',
    track: 'Multimodal Prompt Engineering & Evaluation',
    timeToEarn: '~1.5 hr Free Skill Badge',
    status: 'Active Lab',
    url: 'https://www.cloudskillsboost.google/course_templates/976',
  },
  {
    id: 'web-dev-accessibility',
    title: 'Learn Accessibility (WCAG 2.1 & ARIA Engineering)',
    issuer: 'Google web.dev',
    track: 'Contrast, Focus Management & Assistive Tech',
    timeToEarn: 'Free Developer Course',
    status: 'Verified Track',
    url: 'https://web.dev/learn/accessibility',
  },
]

export function CredentialsSection() {
  return (
    <section
      aria-labelledby="credentials-heading"
      className="mt-12 rounded-2xl border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <span
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold"
            style={{ color: 'var(--accent)' }}
          >
            <Award className="h-4 w-4" />
            CONTINUOUS ENGINEERING &amp; GOOGLE DEVELOPER CREDENTIALS
          </span>
          <h2 id="credentials-heading" className="mt-1 text-lg font-bold tracking-tight">
            Google Developer Program &amp; Verifiable Skill Tracks
          </h2>
        </div>

        <a
          href="https://developers.google.com/profile"
          target="_blank"
          rel="noopener noreferrer"
          className="hub-btn-secondary inline-flex shrink-0 items-center gap-1.5 px-3.5 py-2 font-mono text-xs font-semibold"
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
          <span>Google Developer Profile</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {GOOGLE_BADGES.map((badge) => (
          <a
            key={badge.id}
            href={badge.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border p-4 transition-colors hover:border-[var(--accent)]"
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderColor: 'var(--border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1 font-mono text-[10px] font-bold"
                  style={{ color: 'var(--accent)' }}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {badge.issuer}
                </span>
                <ExternalLink
                  className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100"
                  style={{ color: 'var(--accent)' }}
                />
              </div>

              <h3 className="mt-2 text-xs font-bold leading-snug">{badge.title}</h3>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
                {badge.track}
              </p>
            </div>

            <div
              className="mt-3 flex items-center justify-between border-t pt-2 font-mono text-[10px]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              <span>{badge.status}</span>
              <span style={{ color: 'var(--accent-2)' }}>{badge.timeToEarn}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

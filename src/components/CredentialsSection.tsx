import { Award, ExternalLink } from 'lucide-react'

interface CompletedBadge {
  title: string
  category: string
  imageUrl: string
}

const COMPLETED_BADGES: CompletedBadge[] = [
  {
    title: 'Gemini Agent Ready (GEAR)',
    category: 'Nov 2026 • Agentic AI',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/community/gear/badge.svg',
  },
  {
    title: 'Developer Program Premium',
    category: 'Feb 2026 • Cloud & AI',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/community/innovators/cloud/innovators_plus/badge.svg',
  },
  {
    title: 'Antigravity Arcade: Code Launch',
    category: 'Nov 2026 • Solution Build',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/playlists/solutions/antigravity-arcade/action/badge.svg',
  },
  {
    title: 'Antigravity Arcade Architecture',
    category: 'Nov 2026 • Systems Solution',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/playlists/solutions/antigravity-arcade/view/badge.svg',
  },
  {
    title: 'Race Condition Solution',
    category: 'Nov 2026 • Concurrency',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/playlists/solutions/race-condition/view/badge.svg',
  },
  {
    title: 'Android Studio Developer',
    category: 'Jun 2025 • Native Tooling',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/activity/android/install-android-studio/badge.svg',
  },
  {
    title: 'AI-ML & Gemini Solutions',
    category: 'Nov 2026 • Generative AI',
    imageUrl:
      'https://developers.google.com/profile/badges/playlists/android/android-ai-overview/badge.svg',
  },
  {
    title: 'Google Developer Program',
    category: 'May 2025 • Verified Member',
    imageUrl:
      'https://www.gstatic.com/googledevelopers/profile/badges/profile/created-profile/created_profile.svg',
  },
]

export function CredentialsSection() {
  return (
    <section
      aria-labelledby="credentials-heading"
      className="mt-8 rounded-[2rem] border px-5 py-4 sm:px-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} />
          <h2
            id="credentials-heading"
            className="font-mono text-xs font-bold tracking-wider uppercase"
            style={{ color: 'var(--ink)' }}
          >
            Google for Developers — Verified Profile Badges
          </h2>
        </div>

        <a
          href="https://developers.google.com/profile/u/109506602101295425311"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-opacity hover:opacity-85"
          style={{
            backgroundColor: 'var(--surface-alt)',
            borderColor: 'var(--border)',
            color: 'var(--accent)',
          }}
        >
          <span>Verified Profile</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {COMPLETED_BADGES.map((badge) => (
          <a
            key={badge.title}
            href="https://developers.google.com/profile/u/109506602101295425311"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full border py-1.5 pr-4 pl-2 transition-transform hover:scale-[1.015]"
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderColor: 'var(--border)',
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border p-1 shadow-sm"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <img
                src={badge.imageUrl}
                alt={`${badge.title} Google Developer badge`}
                loading="lazy"
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div
                className="truncate text-xs font-semibold leading-tight"
                style={{ color: 'var(--ink)' }}
              >
                {badge.title}
              </div>
              <div
                className="mt-0.5 truncate font-mono text-[10px]"
                style={{ color: 'var(--muted)' }}
              >
                {badge.category}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

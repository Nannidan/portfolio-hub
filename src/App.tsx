import { useEffect, useState } from 'react'
import { FileText, Mail, Terminal } from 'lucide-react'
import { DynamicAvatar } from './components/DynamicAvatar'
import { ProjectCard } from './components/ProjectCard'
import { ThemeDock } from './components/ThemeDock'
import { PROJECTS, THEME_META } from './data/projects'
import type { BrightnessMode, ThemeId, VisualStyle } from './types/hub'

function GitHubIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = window.localStorage.getItem('hub-theme')
    return saved === 'slate' || saved === 'emerald' || saved === 'indigo' ? saved : 'slate'
  })
  const [mode, setMode] = useState<BrightnessMode>(() => {
    return window.localStorage.getItem('hub-mode') === 'light' ? 'light' : 'dark'
  })
  const [style, setStyle] = useState<VisualStyle>(() => {
    return window.localStorage.getItem('hub-style') === 'retro' ? 'retro' : 'modern'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.mode = mode
    root.dataset.style = style
    window.localStorage.setItem('hub-theme', theme)
    window.localStorage.setItem('hub-mode', mode)
    window.localStorage.setItem('hub-style', style)
  }, [theme, mode, style])

  const meta = THEME_META[theme]

  return (
    <div className="flex min-h-dvh flex-col justify-between">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:py-20">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <DynamicAvatar theme={theme} mode={mode} style={style} />

          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="hub-pill inline-flex items-center gap-2 border px-3 py-1 font-mono text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{meta.badge}</span>
              </div>

              <span
                className="hub-pill inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] font-semibold"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--accent-2)',
                  color: 'var(--accent-2)',
                }}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                OPEN TO FRONT-END &amp; AI UI ROLES
              </span>
            </div>

            <h1
              className={`pixel-heading mt-4 font-extrabold tracking-tight ${
                style === 'retro' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'
              }`}
            >
              {meta.headline}
            </h1>

            <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--muted)' }}>
              {meta.sub}
            </p>

            {/* Recruiter Quick-Action Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <a
                href="./resume.html"
                className="hub-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Resume</span>
              </a>
              <a
                href="mailto:NanningaDan@gmail.com"
                className="hub-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs font-semibold"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>NanningaDan@gmail.com</span>
              </a>
              <a
                href="https://github.com/Nannidan"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs font-semibold"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                <span>@Nannidan</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modular Project Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} style={style} />
          ))}
        </div>
      </main>

      <footer
        className="border-t"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 pr-20 text-xs sm:px-6"
          style={{ color: 'var(--muted)' }}
        >
          <span className="font-mono font-semibold" style={{ color: 'var(--ink)' }}>
            DANIEL NANNINGA // 2026
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="./resume.html"
              className="inline-flex items-center gap-1.5 font-mono font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--accent-2)' }}
            >
              <FileText className="h-3.5 w-3.5" />
              resume
            </a>
            <a
              href="mailto:NanningaDan@gmail.com"
              className="inline-flex items-center gap-1.5 font-mono font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--ink)' }}
            >
              NanningaDan@gmail.com
            </a>
            <a
              href="https://github.com/Nannidan/portfolio-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              portfolio-hub
            </a>
          </div>
        </div>
      </footer>

      <ThemeDock
        theme={theme}
        mode={mode}
        style={style}
        onSelectTheme={setTheme}
        onSelectMode={setMode}
        onSelectStyle={setStyle}
      />
    </div>
  )
}

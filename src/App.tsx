import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Crown,
  Flame,
  Gamepad2,
  Layers,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Terminal,
  X,
  Zap,
} from 'lucide-react'
import { DynamicAvatar } from './components/DynamicAvatar'

type ThemeId = 'cyberpunk' | 'mario' | 'kpop'
type BrightnessMode = 'dark' | 'light'
type VisualStyle = 'modern' | 'retro'

interface Project {
  id: string
  code: string
  title: string
  tagline: string
  description: string
  liveUrl: string
  repoUrl: string
  tags: string[]
  icon: 'synth' | 'forge'
}

const PROJECTS: Project[] = [
  {
    id: 'neonsynth',
    code: 'STAGE 01',
    title: 'NEONSYNTH // K-01',
    tagline: 'Browser Modular Synthesizer & Audio DSP',
    description:
      'Real-time Web Audio API synthesizer with live 60fps AnalyserNode FFT visualizer, local MP3 DSP routing, YouTube deck, shareable patch URLs, 4 persistent themes, and interactive demo checkout.',
    liveUrl: 'https://neonsynth-playground.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/neonsynth-playground',
    tags: ['React 19', 'TypeScript', 'Web Audio API', 'Tailwind v4', 'Framer Motion'],
    icon: 'synth',
  },
  {
    id: 'forge-ui',
    code: 'STAGE 02',
    title: 'FORGE // UI',
    tagline: 'Component Workbench & AI Prompt Studio',
    description:
      'Interactive React + Tailwind v4 design-token studio featuring Default/Loading/Disabled state simulation, live WCAG 2.1 contrast auditing, localStorage Component Vault CRUD, Undo/Redo history, and 3-format code export.',
    liveUrl: 'https://forge-ui-studio.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/forge-ui-studio',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'WCAG A11y', 'localStorage CRUD'],
    icon: 'forge',
  },
]

const THEME_META: Record<
  ThemeId,
  { label: string; badge: string; headline: string; sub: string }
> = {
  cyberpunk: {
    label: 'Cyberpunk',
    badge: 'NETRUNNER // PORTFOLIO HUB',
    headline: 'Select a live module to jack in.',
    sub: 'High-contrast interactive web apps engineered with React 19, TypeScript, and Tailwind CSS v4.',
  },
  mario: {
    label: 'Super Mario',
    badge: 'WORLD 1-1 // STAGE SELECT',
    headline: 'Choose a world to jump into!',
    sub: 'Power-up your review: launch a live interactive web app below or inspect the source code.',
  },
  kpop: {
    label: 'KPop Demon Hunters',
    badge: 'HUNTER STAGE // ENCORE MODE',
    headline: 'Pick your spotlight & slay the demo.',
    sub: 'Stage-ready front-end engineering blending razor-sharp UI systems with interactive browser APIs.',
  },
}

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = window.localStorage.getItem('hub-theme')
    return saved === 'cyberpunk' || saved === 'mario' || saved === 'kpop' ? saved : 'cyberpunk'
  })
  const [mode, setMode] = useState<BrightnessMode>(() => {
    return window.localStorage.getItem('hub-mode') === 'light' ? 'light' : 'dark'
  })
  const [style, setStyle] = useState<VisualStyle>(() => {
    return window.localStorage.getItem('hub-style') === 'retro' ? 'retro' : 'modern'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.mode = mode
    root.dataset.style = style
    window.localStorage.setItem('hub-theme', theme)
    window.localStorage.setItem('hub-mode', mode)
    window.localStorage.setItem('hub-style', style)
  }, [theme, mode, style])

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [menuOpen])

  const meta = THEME_META[theme]

  return (
    <div className="flex min-h-dvh flex-col justify-between">
      {/* Main Splash Content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:py-20">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <DynamicAvatar theme={theme} mode={mode} style={style} />

          <div className="max-w-2xl">
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
          </div>
        </div>

        {/* Project Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.id} className="hub-card flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="hub-pill inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-mono text-[11px] font-bold"
                    style={{
                      backgroundColor: 'var(--surface-alt)',
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                    }}
                  >
                    {project.icon === 'synth' ? (
                      <Cpu className="h-3 w-3" />
                    ) : (
                      <Layers className="h-3 w-3" />
                    )}
                    {project.code}
                  </span>

                  <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-2)' }} />
                </div>

                <h2
                  className={`pixel-heading mt-4 font-bold tracking-tight ${
                    style === 'retro' ? 'text-base' : 'text-2xl'
                  }`}
                >
                  {project.title}
                </h2>

                <p className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--accent-2)' }}>
                  {project.tagline}
                </p>

                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="hub-tag rounded-md border px-2 py-0.5 font-mono text-[11px]"
                      style={{
                        backgroundColor: 'var(--surface-alt)',
                        borderColor: 'var(--border)',
                        color: 'var(--ink)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="mt-7 flex flex-wrap items-center gap-2.5 border-t pt-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-btn-primary inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold"
                >
                  <span>Launch App</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-btn-secondary inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-mono text-xs font-semibold"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Source</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 pr-20 text-xs sm:px-6"
          style={{ color: 'var(--muted)' }}
        >
          <span className="font-mono font-semibold" style={{ color: 'var(--ink)' }}>
            DANIEL NANNINGA // 2026
          </span>
          <a
            href="https://github.com/Nannidan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            <Code2 className="h-3.5 w-3.5" />
            github.com/Nannidan
          </a>
        </div>
      </footer>

      {/* Floating Theme Popup Bubble Menu */}
      <div
        ref={menuRef}
        className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
      >
        {menuOpen && (
          <div
            role="dialog"
            aria-label="Theme and style settings"
            className="hub-card w-64 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Style &amp; Theme
              </span>
              <button
                type="button"
                aria-label="Close theme menu"
                onClick={() => setMenuOpen(false)}
                className="p-1 opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5">
              <span className="block font-mono text-[10px] uppercase" style={{ color: 'var(--muted)' }}>
                Theme
              </span>
              {(
                [
                  { id: 'cyberpunk', icon: Zap },
                  { id: 'mario', icon: Crown },
                  { id: 'kpop', icon: Flame },
                ] as const
              ).map(({ id, icon: Icon }) => {
                const active = theme === id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTheme(id)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition-all ${
                      active ? 'hub-btn-primary' : 'hub-btn-secondary'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{THEME_META[id].label}</span>
                  </button>
                )
              })}
            </div>

            <div
              className="mt-3.5 grid grid-cols-2 gap-2 border-t pt-3"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                type="button"
                onClick={() => setStyle((s) => (s === 'modern' ? 'retro' : 'modern'))}
                className="hub-btn-secondary inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold"
              >
                {style === 'retro' ? (
                  <>
                    <Gamepad2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span>8-Bit</span>
                  </>
                ) : (
                  <>
                    <Monitor className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span>Modern</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
                className="hub-btn-secondary inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold"
              >
                {mode === 'dark' ? (
                  <>
                    <Moon className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent-2)' }} />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent-2)' }} />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Open theme menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="hub-btn-primary flex h-13 w-13 items-center justify-center shadow-xl"
          style={{
            borderRadius: style === 'retro' ? '0px' : '9999px',
            boxShadow: style === 'retro' ? undefined : '0 10px 30px var(--glow)',
          }}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

import { ArrowUpRight, Code2, Cpu, Layers, Sparkles, Terminal } from 'lucide-react'

interface Project {
  id: string
  code: string
  title: string
  tagline: string
  description: string
  liveUrl: string
  repoUrl: string
  tags: string[]
  accent: string
  glow: string
  icon: 'synth' | 'forge'
}

const PROJECTS: Project[] = [
  {
    id: 'neonsynth',
    code: 'PROJECT 01',
    title: 'NEONSYNTH // K-01',
    tagline: 'Browser Modular Synthesizer & Audio DSP',
    description:
      'Real-time Web Audio API synthesizer with live 60fps AnalyserNode FFT visualizer, local MP3 DSP routing, YouTube deck, shareable patch URLs, 4 persistent themes, and interactive demo checkout.',
    liveUrl: 'https://neonsynth-playground.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/neonsynth-playground',
    tags: ['React 19', 'TypeScript', 'Web Audio API', 'Tailwind v4', 'Framer Motion'],
    accent: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    glow: 'hover:border-cyan-500/60 hover:shadow-[0_0_40px_-15px_rgba(6,182,212,0.45)]',
    icon: 'synth',
  },
  {
    id: 'forge-ui',
    code: 'PROJECT 02',
    title: 'FORGE // UI',
    tagline: 'Component Workbench & AI Prompt Studio',
    description:
      'Interactive React + Tailwind v4 design-token studio featuring Default/Loading/Disabled state simulation, live WCAG 2.1 contrast auditing, localStorage Component Vault CRUD, Undo/Redo history, and 3-format code export.',
    liveUrl: 'https://forge-ui-studio.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/forge-ui-studio',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'WCAG A11y', 'localStorage CRUD'],
    accent: 'text-violet-400 border-violet-500/40 bg-violet-500/10',
    glow: 'hover:border-violet-500/60 hover:shadow-[0_0_40px_-15px_rgba(139,92,246,0.45)]',
    icon: 'forge',
  },
]

export default function App() {
  return (
    <div
      className="flex min-h-dvh flex-col justify-between bg-[#05080f] text-zinc-100"
      style={{
        backgroundImage:
          'radial-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:py-20">
        {/* Header / Identity */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300">
            <Terminal className="h-3.5 w-3.5" />
            <span>DANIEL NANNINGA // FRONT-END &amp; UI PORTFOLIO</span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Select a live project to launch.
          </h1>

          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            Interactive web applications built with React 19, TypeScript, and Tailwind CSS v4.
            Launch any live demo below or inspect the source code directly on GitHub.
          </p>
        </div>

        {/* Project Selector Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={`group flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-zinc-950/85 p-6 backdrop-blur-md transition-all duration-200 ${project.glow}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${project.accent}`}
                  >
                    {project.icon === 'synth' ? (
                      <Cpu className="h-3 w-3" />
                    ) : (
                      <Layers className="h-3 w-3" />
                    )}
                    {project.code}
                  </span>

                  <Sparkles className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-cyan-400" />
                </div>

                <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white">
                  {project.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-cyan-300/90">{project.tagline}</p>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-zinc-800/80 pt-5">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-cyan-400 active:scale-95"
                >
                  <span>Launch App</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
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
      <footer className="border-t border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:px-6">
          <span className="font-mono text-zinc-400">DANIEL NANNINGA // 2026</span>
          <a
            href="https://github.com/Nannidan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-zinc-300 transition-colors hover:text-cyan-400"
          >
            <Code2 className="h-3.5 w-3.5" />
            github.com/Nannidan
          </a>
        </div>
      </footer>
    </div>
  )
}

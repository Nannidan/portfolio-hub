import { ArrowUpRight, Atom, BarChart3, Cpu, GitFork, Layers, Satellite } from 'lucide-react'
import type { Project, VisualStyle } from '../types/hub'

interface ProjectCardProps {
  project: Project
  style: VisualStyle
}

export function ProjectCard({ project, style }: ProjectCardProps) {
  return (
    <article className="hub-card flex flex-col justify-between p-6">
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
            ) : project.icon === 'ledger' ? (
              <BarChart3 className="h-3 w-3" />
            ) : project.icon === 'forge' ? (
              <Layers className="h-3 w-3" />
            ) : project.icon === 'nexus' ? (
              <GitFork className="h-3 w-3" />
            ) : project.icon === 'verlet' ? (
              <Atom className="h-3 w-3" />
            ) : (
              <Satellite className="h-3 w-3" />
            )}
            {project.code}
          </span>
        </div>

        <h2
          className={`mt-4 font-bold tracking-tight ${
            style === 'retro' ? 'font-mono text-lg' : 'text-2xl'
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
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
          <span>Source</span>
        </a>
      </div>
    </article>
  )
}

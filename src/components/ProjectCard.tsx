import { Activity, ArrowUpRight, BarChart3, Code2, Cpu, Layers, Satellite, Sparkles } from 'lucide-react'
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
            ) : project.icon === 'spectrum' ? (
              <Activity className="h-3 w-3" />
            ) : (
              <Satellite className="h-3 w-3" />
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
  )
}

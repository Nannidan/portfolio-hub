import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Mail,
  Moon,
  Palette,
  Search,
  Send,
  Sun,
  X,
} from 'lucide-react'
import { PROJECTS, THEME_META } from '../data/projects'
import type { BrightnessMode, ThemeId } from '../types/hub'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onOpenInquiry: () => void
  onSelectTheme: (theme: ThemeId) => void
  onSelectMode: (mode: BrightnessMode) => void
}

interface CommandItem {
  id: string
  group: string
  label: string
  hint: string
  action: () => void
}

export function CommandPalette({
  open,
  onClose,
  onOpenInquiry,
  onSelectTheme,
  onSelectMode,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const commands = useMemo<CommandItem[]>(() => {
    const projectCommands: CommandItem[] = PROJECTS.flatMap((p) => [
      {
        id: `launch-${p.id}`,
        group: 'Live Applications',
        label: `Launch ${p.title}`,
        hint: p.code,
        action: () => {
          window.open(p.liveUrl, '_blank', 'noopener,noreferrer')
          onClose()
        },
      },
      {
        id: `repo-${p.id}`,
        group: 'Source Repositories',
        label: `View Source: ${p.title}`,
        hint: 'GitHub',
        action: () => {
          window.open(p.repoUrl, '_blank', 'noopener,noreferrer')
          onClose()
        },
      },
    ])

    const quickActions: CommandItem[] = [
      {
        id: 'open-inquiry',
        group: 'Hiring & Contact',
        label: 'Send Direct Inquiry (Zod + Serverless API)',
        hint: 'POST /api/inquire',
        action: () => {
          onClose()
          onOpenInquiry()
        },
      },
      {
        id: 'open-resume',
        group: 'Hiring & Contact',
        label: 'Open Printable Engineering Resume',
        hint: 'PDF / Print',
        action: () => {
          window.location.href = './resume.html'
        },
      },
      {
        id: 'copy-email',
        group: 'Hiring & Contact',
        label: copiedEmail ? 'Copied nanningadan@gmail.com!' : 'Copy Email: nanningadan@gmail.com',
        hint: 'Clipboard',
        action: () => {
          void navigator.clipboard?.writeText('nanningadan@gmail.com')
          setCopiedEmail(true)
          window.setTimeout(() => {
            setCopiedEmail(false)
            onClose()
          }, 700)
        },
      },
      ...(['slate', 'emerald', 'indigo'] as ThemeId[]).map((t) => ({
        id: `theme-${t}`,
        group: 'Design System Theme',
        label: `Switch Palette: ${THEME_META[t].label}`,
        hint: 'Theme',
        action: () => {
          onSelectTheme(t)
          onClose()
        },
      })),
      {
        id: 'mode-dark',
        group: 'Design System Theme',
        label: 'Surface Mode: Dark',
        hint: 'Mode',
        action: () => {
          onSelectMode('dark')
          onClose()
        },
      },
      {
        id: 'mode-light',
        group: 'Design System Theme',
        label: 'Surface Mode: Light',
        hint: 'Mode',
        action: () => {
          onSelectMode('light')
          onClose()
        },
      },
    ]

    return [...quickActions, ...projectCommands]
  }, [copiedEmail, onClose, onOpenInquiry, onSelectMode, onSelectTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q),
    )
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      window.setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0,
        )
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault()
        filtered[activeIndex].action()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, filtered, onClose, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="hub-card w-full max-w-xl overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--accent)',
        }}
      >
        <div
          className="flex items-center gap-2.5 border-b px-4 py-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, project name, or theme (↑↓ to navigate, Enter to run)..."
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--ink)' }}
          />
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded p-1 opacity-70 hover:opacity-100"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs" style={{ color: 'var(--muted)' }}>
              No matching commands found.
            </p>
          ) : (
            filtered.map((item, idx) => {
              const active = idx === activeIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={item.action}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--surface-alt)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--ink)',
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.id === 'open-inquiry' ? (
                      <Send className="h-3.5 w-3.5 shrink-0" />
                    ) : item.id === 'open-resume' ? (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    ) : item.id === 'copy-email' ? (
                      copiedEmail ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                      )
                    ) : item.id.startsWith('theme-') ? (
                      <Palette className="h-3.5 w-3.5 shrink-0" />
                    ) : item.id === 'mode-dark' ? (
                      <Moon className="h-3.5 w-3.5 shrink-0" />
                    ) : item.id === 'mode-light' ? (
                      <Sun className="h-3.5 w-3.5 shrink-0" />
                    ) : item.id.startsWith('repo-') ? (
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate font-medium">{item.label}</span>
                  </div>
                  <span
                    className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--muted)',
                    }}
                  >
                    {item.hint}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div
          className="flex items-center justify-between border-t px-4 py-2 font-mono text-[10px]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <span>↑↓ Navigate • Enter Execute • Esc Close</span>
          <span>⌘K / Ctrl+K Global Shortcut</span>
        </div>
      </div>
    </div>
  )
}

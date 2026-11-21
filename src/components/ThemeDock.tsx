import { useEffect, useRef, useState } from 'react'
import { Crown, Flame, Gamepad2, Monitor, Moon, Palette, Sun, X, Zap } from 'lucide-react'
import { THEME_META } from '../data/projects'
import type { BrightnessMode, ThemeId, VisualStyle } from '../types/hub'

interface ThemeDockProps {
  theme: ThemeId
  mode: BrightnessMode
  style: VisualStyle
  onSelectTheme: (next: ThemeId) => void
  onSelectMode: (next: BrightnessMode) => void
  onSelectStyle: (next: VisualStyle) => void
}

export function ThemeDock({
  theme,
  mode,
  style,
  onSelectTheme,
  onSelectMode,
  onSelectStyle,
}: ThemeDockProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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

  return (
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
            <span className="font-mono text-xs font-bold tracking-wider" style={{ color: 'var(--accent)' }}>
              STYLE MATRIX
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close theme menu"
              className="cursor-pointer rounded p-1 opacity-70 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Theme Palette Selector */}
          <div className="mt-3 space-y-1.5">
            <span className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
              Universe Theme
            </span>
            {(['cyberpunk', 'mario', 'kpop'] as ThemeId[]).map((id) => {
              const active = theme === id
              const Icon = id === 'cyberpunk' ? Zap : id === 'mario' ? Crown : Flame
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectTheme(id)}
                  className="hub-pill flex w-full cursor-pointer items-center justify-between border px-3 py-2 text-left text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'var(--surface-alt)',
                    borderColor: active ? 'var(--accent)' : 'var(--border)',
                    color: active ? 'var(--accent-contrast)' : 'var(--ink)',
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {THEME_META[id].label}
                  </span>
                  {active && <span className="font-mono text-[10px]">ACTIVE</span>}
                </button>
              )
            })}
          </div>

          {/* Day / Night Mode Toggle */}
          <div className="mt-3.5 space-y-1.5">
            <span className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
              Lighting Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['dark', 'light'] as BrightnessMode[]).map((m) => {
                const active = mode === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onSelectMode(m)}
                    className="hub-pill flex cursor-pointer items-center justify-center gap-1.5 border px-2.5 py-1.5 font-mono text-xs font-semibold"
                    style={{
                      backgroundColor: active ? 'var(--accent)' : 'var(--surface-alt)',
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      color: active ? 'var(--accent-contrast)' : 'var(--ink)',
                    }}
                  >
                    {m === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                    <span className="capitalize">{m}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Modern / Retro Pixel Toggle */}
          <div className="mt-3.5 space-y-1.5">
            <span className="block font-mono text-[10px] font-semibold uppercase" style={{ color: 'var(--muted)' }}>
              Geometry &amp; Fonts
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['modern', 'retro'] as VisualStyle[]).map((s) => {
                const active = style === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSelectStyle(s)}
                    className="hub-pill flex cursor-pointer items-center justify-center gap-1.5 border px-2.5 py-1.5 font-mono text-xs font-semibold"
                    style={{
                      backgroundColor: active ? 'var(--accent)' : 'var(--surface-alt)',
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      color: active ? 'var(--accent-contrast)' : 'var(--ink)',
                    }}
                  >
                    {s === 'modern' ? <Monitor className="h-3.5 w-3.5" /> : <Gamepad2 className="h-3.5 w-3.5" />}
                    <span className="capitalize">{s}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-label="Toggle theme and visual style menu"
        className="hub-btn-primary flex h-12 w-12 cursor-pointer items-center justify-center shadow-xl"
      >
        <Palette className="h-5 w-5" />
      </button>
    </div>
  )
}

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Crown, Flame, Moon, Sparkles, Sun, Zap } from 'lucide-react'

type ThemeId = 'cyberpunk' | 'mario' | 'kpop'
type BrightnessMode = 'dark' | 'light'
type VisualStyle = 'modern' | 'retro'

interface DynamicAvatarProps {
  theme: ThemeId
  mode: BrightnessMode
  style: VisualStyle
}

const AVATAR_META: Record<
  ThemeId,
  { tag: string; popText: string; icon: typeof Zap }
> = {
  cyberpunk: { tag: 'NETRUNNER', popText: '+100 XP // SYNC', icon: Zap },
  mario: { tag: 'P1 · 1UP', popText: '1UP! ★ +200', icon: Crown },
  kpop: { tag: 'HUNTER', popText: 'STAGE READY ✨', icon: Flame },
}

export function DynamicAvatar({ theme, mode, style }: DynamicAvatarProps) {
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({})
  const [morphing, setMorphing] = useState(false)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [popKey, setPopKey] = useState<number | null>(null)
  const isFirstRender = useRef(true)

  const variant = style === 'retro' ? 'pixel' : 'modern'
  const src = `./avatar-${theme}-${variant}.jpg`
  const showFallback = Boolean(imgFailed[src])
  const { tag, popText, icon: ThemeIcon } = AVATAR_META[theme]

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setMorphing(true)
    const timer = window.setTimeout(() => setMorphing(false), 360)
    return () => window.clearTimeout(timer)
  }, [theme, mode, style])

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: Number((-y * 14).toFixed(1)), ry: Number((x * 14).toFixed(1)) })
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 })
  }

  function handleAvatarClick() {
    setMorphing(true)
    setPopKey(Date.now())
    window.setTimeout(() => setMorphing(false), 360)
  }

  return (
    <div className="avatar-float-wrap relative shrink-0 select-none">
      <div className="avatar-aura-ring" aria-hidden="true" />

      <button
        type="button"
        onClick={handleAvatarClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={`Daniel Nanninga avatar (${theme} ${mode} ${style}) — click to trigger emote`}
        title="Click avatar for theme emote"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className="avatar-shell block h-24 w-24 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 sm:h-28 sm:w-28"
      >
        <div className="avatar-frame h-full w-full">
          {showFallback ? (
            <div
              className="pixel-heading flex h-full w-full items-center justify-center text-2xl font-extrabold"
              style={{ color: 'var(--accent)' }}
            >
              DN
            </div>
          ) : (
            <img
              key={src}
              src={src}
              alt={`Daniel Nanninga ${theme} ${style} avatar`}
              onError={() => setImgFailed((prev) => ({ ...prev, [src]: true }))}
              className={`avatar-img ${morphing ? 'avatar-morphing' : ''}`}
            />
          )}

          <div className="avatar-overlay" aria-hidden="true" />
          <div className="avatar-scan-beam" aria-hidden="true" />

          {theme === 'cyberpunk' && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-1.5 h-2.5 w-2.5 border-t-2 border-l-2"
                style={{ borderColor: 'var(--accent)' }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-1.5 bottom-1.5 h-2.5 w-2.5 border-r-2 border-b-2"
                style={{ borderColor: 'var(--accent-2)' }}
              />
            </>
          )}

          {theme === 'mario' && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-1.5 h-1.5 w-1.5 bg-amber-300 shadow-[0_0_4px_#facc15]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-amber-300 shadow-[0_0_4px_#facc15]"
              />
            </>
          )}

          {theme === 'kpop' && (
            <Sparkles
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 left-1.5 h-3.5 w-3.5 animate-pulse text-amber-300"
            />
          )}
        </div>
      </button>

      {popKey !== null && (
        <span
          key={popKey}
          aria-hidden="true"
          className="avatar-pop-badge hub-pill pointer-events-none absolute -top-3 left-1/2 z-20 whitespace-nowrap border px-2 py-0.5 font-mono text-[10px] font-bold shadow-lg"
          style={{
            backgroundColor: 'var(--accent)',
            borderColor: 'var(--ink)',
            color: 'var(--accent-contrast)',
          }}
        >
          {popText}
        </span>
      )}

      <span
        title={mode === 'dark' ? 'Night mode active' : 'Day mode active'}
        className="hub-pill pointer-events-none absolute -top-1.5 -right-1.5 z-10 flex h-7 w-7 items-center justify-center border shadow-md"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--accent)',
          color: 'var(--accent-2)',
        }}
      >
        {mode === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>

      <span
        className="hub-pill pointer-events-none absolute -bottom-2.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap border px-2 py-0.5 font-mono text-[10px] font-bold shadow-md"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
        }}
      >
        <ThemeIcon className="h-2.5 w-2.5 shrink-0" />
        <span>{tag}</span>
      </span>
    </div>
  )
}

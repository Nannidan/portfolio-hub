import { useEffect, useRef, useState } from 'react'
import { Crown, Flame, Moon, Sparkles, Sun, Zap } from 'lucide-react'

type ThemeId = 'cyberpunk' | 'mario' | 'kpop'
type BrightnessMode = 'dark' | 'light'
type VisualStyle = 'modern' | 'retro'
type AvatarVariant = 'auto' | 'holo' | 'crt' | 'cyber' | 'noir' | 'pixel'

interface DynamicAvatarProps {
  theme: ThemeId
  mode: BrightnessMode
  style: VisualStyle
}

const VARIANTS: { id: AvatarVariant; label: string }[] = [
  { id: 'auto', label: 'AUTO' },
  { id: 'holo', label: 'HOLO' },
  { id: 'crt', label: 'CRT' },
  { id: 'cyber', label: 'NEON' },
  { id: 'noir', label: 'NOIR' },
  { id: 'pixel', label: '8-BIT' },
]

const AVATAR_META: Record<ThemeId, { tag: string; icon: typeof Zap }> = {
  cyberpunk: { tag: 'NETRUNNER', icon: Zap },
  mario: { tag: 'P1 · 1UP', icon: Crown },
  kpop: { tag: 'HUNTER', icon: Flame },
}

const THEME_PARTICLE_COLORS: Record<ThemeId, [string, string]> = {
  cyberpunk: ['#06b6d4', '#ff007f'],
  mario: ['#facc15', '#ef4444'],
  kpop: ['#ff2a85', '#a855f7'],
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
  color: string
  square: boolean
}

export function DynamicAvatar({ theme, mode, style }: DynamicAvatarProps) {
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({})
  const [hovered, setHovered] = useState(false)
  const [variantIdx, setVariantIdx] = useState(0)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const burstRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])

  const variant = VARIANTS[variantIdx]
  const { tag, icon: ThemeIcon } = AVATAR_META[theme]

  // Determine which base image is active:
  // - 'pixel' variant forces pixel-art
  // - 'auto' and other variants follow global style, and hover morphs to the opposite style
  const baseIsRetro = variant.id === 'pixel' ? true : style === 'retro'
  const showRetro = hovered && variant.id !== 'pixel' ? !baseIsRetro : baseIsRetro

  const modernFailed = Boolean(imgFailed['./avatar-modern.jpg'])
  const pixelFailed = Boolean(imgFailed['./avatar-pixel.jpg'])
  const bothFailed = modernFailed && pixelFailed

  // Trigger a canvas glitch/sparkle burst on theme, mode, style, variant, or hover changes
  useEffect(() => {
    burstRef.current = 1
    const canvas = canvasRef.current
    if (!canvas) return
    const [c1, c2] = THEME_PARTICLE_COLORS[theme]
    const isSquare = style === 'retro' || variant.id === 'pixel'
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4
      const speed = 0.6 + Math.random() * 1.4
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isSquare ? 3 : 2 + Math.random() * 1.5,
        alpha: 0.9,
        life: 0,
        maxLife: 24 + Math.random() * 18,
        color: i % 2 === 0 ? c1 : c2,
        square: isSquare,
      })
    }
  }, [theme, mode, style, variant.id, hovered])

  // Lightweight ambient + reactive Canvas FX loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let rafId = 0
    let frame = 0

    const render = () => {
      frame += 1
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const [c1, c2] = THEME_PARTICLE_COLORS[theme]
      const isSquare = style === 'retro' || variant.id === 'pixel' || showRetro

      // Spawn subtle ambient particles
      if (frame % (hovered ? 6 : 16) === 0 && particlesRef.current.length < 24) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: h + 4,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -(0.4 + Math.random() * 0.7),
          size: isSquare ? 2.5 : 1.8 + Math.random() * 1.4,
          alpha: mode === 'dark' ? 0.7 : 0.45,
          life: 0,
          maxLife: 45 + Math.random() * 35,
          color: Math.random() > 0.5 ? c1 : c2,
          square: isSquare,
        })
      }

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life += 1
        const progress = p.life / p.maxLife
        if (progress >= 1) return false

        ctx.save()
        ctx.globalAlpha = p.alpha * (1 - progress)
        ctx.fillStyle = p.color
        if (p.square) {
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
        return true
      })

      // Digital scan/glitch sweep during morph burst
      if (burstRef.current > 0.02) {
        const b = burstRef.current
        ctx.save()
        ctx.globalAlpha = b * 0.35
        const scanY = ((1 - b) * h) % h
        ctx.fillStyle = c1
        ctx.fillRect(0, scanY, w, 2)
        ctx.fillStyle = c2
        ctx.fillRect(0, (scanY + 6) % h, w, 1)
        ctx.restore()
        burstRef.current *= 0.88
      } else {
        burstRef.current = 0
      }

      rafId = window.requestAnimationFrame(render)
    }

    rafId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(rafId)
  }, [theme, mode, style, variant.id, hovered, showRetro])

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({
      rx: (0.5 - py) * 14,
      ry: (px - 0.5) * 14,
      gx: Math.round(px * 100),
      gy: Math.round(py * 100),
    })
  }

  const handlePointerLeave = () => {
    setHovered(false)
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })
  }

  const cycleVariant = () => {
    setVariantIdx((prev) => (prev + 1) % VARIANTS.length)
  }

  return (
    <div className="relative shrink-0 select-none">
      <button
        type="button"
        onClick={cycleVariant}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-label={`Daniel Nanninga dynamic avatar. Style variant: ${variant.label}. Click to cycle avatar style, hover to morph.`}
        title={`Hover to morph • Click to cycle FX (${variant.label})`}
        className="avatar-shell group block h-24 w-24 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-28 sm:w-28"
        style={{
          transform: hovered
            ? `perspective(500px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-2px) scale(1.03)`
            : undefined,
        }}
      >
        <div
          className="avatar-frame h-full w-full"
          data-variant={variant.id}
          style={
            {
              '--glare-x': `${tilt.gx}%`,
              '--glare-y': `${tilt.gy}%`,
            } as React.CSSProperties
          }
        >
          {bothFailed ? (
            <div
              className="pixel-heading flex h-full w-full items-center justify-center text-2xl font-extrabold"
              style={{ color: 'var(--accent)' }}
            >
              DN
            </div>
          ) : (
            <>
              {!modernFailed && (
                <img
                  src="./avatar-modern.jpg"
                  alt="Daniel Nanninga photorealistic avatar"
                  onError={() =>
                    setImgFailed((prev) => ({ ...prev, './avatar-modern.jpg': true }))
                  }
                  className={`avatar-img avatar-layer ${
                    !showRetro || pixelFailed ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              )}
              {!pixelFailed && (
                <img
                  src="./avatar-pixel.jpg"
                  alt="Daniel Nanninga pixel-art avatar"
                  onError={() =>
                    setImgFailed((prev) => ({ ...prev, './avatar-pixel.jpg': true }))
                  }
                  className={`avatar-img avatar-img-pixel avatar-layer ${
                    showRetro || modernFailed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />
              )}
            </>
          )}

          {/* Theme-correlated & variant-driven CSS/filter overlay */}
          <div className="avatar-overlay" aria-hidden="true" />
          <div className="avatar-glare" aria-hidden="true" />

          {/* Live Canvas particle & glitch-sweep layer */}
          <canvas
            ref={canvasRef}
            width={112}
            height={112}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Active style variant pill (top-left) */}
      {variant.id !== 'auto' && (
        <span
          className="hub-pill pointer-events-none absolute -top-1.5 -left-1.5 inline-flex items-center gap-0.5 border px-1.5 py-0.5 font-mono text-[9px] font-bold shadow-md"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--accent-2)',
            color: 'var(--accent-2)',
          }}
        >
          <Sparkles className="h-2.5 w-2.5 shrink-0" />
          <span>{variant.label}</span>
        </span>
      )}

      {/* Day / Night corner badge */}
      <span
        title={mode === 'dark' ? 'Night mode active' : 'Day mode active'}
        className="hub-pill pointer-events-none absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center border shadow-md"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--accent)',
          color: 'var(--accent-2)',
        }}
      >
        {mode === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>

      {/* Theme-correlated role tag */}
      <span
        className="hub-pill pointer-events-none absolute -bottom-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap border px-2 py-0.5 font-mono text-[10px] font-bold shadow-md"
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

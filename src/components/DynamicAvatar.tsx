import { useEffect, useRef, useState } from 'react'
import { Moon, Sparkles, Sun } from 'lucide-react'
import type { BrightnessMode, ThemeId, VisualStyle } from '../types/hub'

type AvatarVariant = 'auto' | 'holo' | 'crt' | 'cyber' | 'noir' | 'pixel'

interface DynamicAvatarProps {
  theme: ThemeId
  mode: BrightnessMode
  style: VisualStyle
}

const VARIANTS: { id: AvatarVariant; label: string }[] = [
  { id: 'auto', label: 'AUTO' },
  { id: 'holo', label: 'HOLO' },
  { id: 'crt', label: 'SCAN' },
  { id: 'cyber', label: 'DUO' },
  { id: 'noir', label: 'MONO' },
  { id: 'pixel', label: 'PIXEL' },
]

const THEME_PARTICLE_COLORS: Record<ThemeId, [string, string]> = {
  slate: ['#0ea5e9', '#38bdf8'],
  emerald: ['#10b981', '#34d399'],
  indigo: ['#6366f1', '#818cf8'],
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

  const baseIsRetro = variant.id === 'pixel' ? true : style === 'retro'
  const showRetro = hovered && variant.id !== 'pixel' ? !baseIsRetro : baseIsRetro

  const modernFailed = Boolean(imgFailed['./avatar-modern.jpg'])
  const pixelFailed = Boolean(imgFailed['./avatar-pixel.jpg'])
  const bothFailed = modernFailed && pixelFailed

  useEffect(() => {
    burstRef.current = 1
    const canvas = canvasRef.current
    if (!canvas) return
    const [c1, c2] = THEME_PARTICLE_COLORS[theme]
    const isSquare = style === 'retro' || variant.id === 'pixel'
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4
      const speed = 0.5 + Math.random() * 1.2
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isSquare ? 2.5 : 2,
        alpha: 0.75,
        life: 0,
        maxLife: 22 + Math.random() * 16,
        color: i % 2 === 0 ? c1 : c2,
        square: isSquare,
      })
    }
  }, [theme, mode, style, variant.id, hovered])

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

      if (frame % (hovered ? 8 : 20) === 0 && particlesRef.current.length < 18) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: h + 4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.35 + Math.random() * 0.6),
          size: isSquare ? 2.2 : 1.6 + Math.random() * 1.2,
          alpha: mode === 'dark' ? 0.55 : 0.35,
          life: 0,
          maxLife: 45 + Math.random() * 35,
          color: Math.random() > 0.5 ? c1 : c2,
          square: isSquare,
        })
      }

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

      if (burstRef.current > 0.02) {
        const b = burstRef.current
        ctx.save()
        ctx.globalAlpha = b * 0.28
        const scanY = ((1 - b) * h) % h
        ctx.fillStyle = c1
        ctx.fillRect(0, scanY, w, 1.5)
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
      rx: (0.5 - py) * 12,
      ry: (px - 0.5) * 12,
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
        aria-label={`Daniel Nanninga portrait. Visual filter: ${variant.label}. Click to cycle portrait treatment.`}
        title={`Hover to morph • Click to cycle filter (${variant.label})`}
        className="avatar-shell group block h-24 w-24 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-28 sm:w-28"
        style={{
          transform: hovered
            ? `perspective(500px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-2px) scale(1.02)`
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
              className="flex h-full w-full items-center justify-center font-mono text-2xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              DN
            </div>
          ) : (
            <>
              {!modernFailed && (
                <img
                  src="./avatar-modern.jpg"
                  alt="Daniel Nanninga studio portrait"
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
                  alt="Daniel Nanninga illustrated portrait"
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

          <div className="avatar-overlay" aria-hidden="true" />
          <div className="avatar-glare" aria-hidden="true" />

          <canvas
            ref={canvasRef}
            width={112}
            height={112}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        </div>
      </button>

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

      <span
        title={mode === 'dark' ? 'Dark mode active' : 'Light mode active'}
        className="hub-pill pointer-events-none absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center border shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--accent)',
        }}
      >
        {mode === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </span>
    </div>
  )
}

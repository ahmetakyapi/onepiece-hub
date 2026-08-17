'use client'

import { useEffect, useRef } from 'react'

/* Canvas boya alamayan bir yüzey — Tailwind sınıfı geçmez, gerçek renk ister.
   Bu yüzden token'lar çizimden önce bir kez hesaplanır; aktif temanın
   (`data-theme`) değerlerini alır. */
const CONFETTI_TOKENS = ['--gold', '--gold-bright', '--sea', '--sea-light', '--luffy', '--haki'] as const

function readPaletteColors(): string[] {
  const styles = getComputedStyle(document.documentElement)
  return CONFETTI_TOKENS.map((token) => {
    const channels = styles.getPropertyValue(token).trim()
    return channels ? `rgb(${channels})` : 'rgb(244 163 0)'
  })
}

interface Particle {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  gravity: number
  rotation: number
  rotationSpeed: number
  color: string
  opacity: number
  width: number
  height: number
}

/**
 * Canvas confetti burst — fires once on mount, then fades.
 */
export default function Confetti({ particleCount = 80 }: { particleCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = readPaletteColors()
    const particles: Particle[] = []
    const cx = canvas.width / 2
    const cy = canvas.height * 0.3

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 4
      particles.push({
        x: cx,
        y: cy,
        r: 0,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 4,
        gravity: 0.12,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        width: Math.random() * 8 + 4,
        height: Math.random() * 4 + 2,
      })
    }

    let animId: number

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      let alive = false
      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        p.dy += p.gravity
        p.dx *= 0.99
        p.rotation += p.rotationSpeed
        p.opacity -= 0.008

        if (p.opacity <= 0) continue
        alive = true

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate((p.rotation * Math.PI) / 180)
        ctx!.globalAlpha = p.opacity
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
        ctx!.restore()
      }

      if (alive) {
        animId = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden
    />
  )
}

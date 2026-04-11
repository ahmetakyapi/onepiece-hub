'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#f4a300', '#fbbf24', '#1e90ff', '#60b8ff', '#e74c3c', '#10b981']

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
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
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

'use client'

import { useEffect, useRef } from 'react'

/**
 * Floating bokeh particles — creates magical ocean depth.
 * Canvas-based for maximum performance. No Framer Motion overhead.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0

    const particles: {
      x: number
      y: number
      r: number
      dx: number
      dy: number
      opacity: number
      opacityDir: number
      color: string
    }[] = []

    const COLORS = [
      'rgba(244,163,0,',   // gold
      'rgba(30,144,255,',  // sea
      'rgba(251,191,36,',  // bright gold
      'rgba(96,184,255,',  // sea light
    ]

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
    }

    function createParticles() {
      const count = Math.min(Math.floor(width / 25), 60)
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.2 - 0.1,
          opacity: Math.random() * 0.5 + 0.1,
          opacityDir: (Math.random() - 0.5) * 0.008,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        p.opacity += p.opacityDir

        if (p.opacity <= 0.05 || p.opacity >= 0.6) p.opacityDir *= -1
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `${p.color}${p.opacity})`
        ctx!.fill()

        // Soft glow
        if (p.r > 1.5) {
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
          ctx!.fillStyle = `${p.color}${p.opacity * 0.15})`
          ctx!.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden
    />
  )
}

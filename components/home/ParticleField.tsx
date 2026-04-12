'use client'

import { useEffect, useRef } from 'react'

/**
 * Premium particle system — creates depth with organic floating particles
 * that react subtly to scroll position. Bokeh + connecting lines between
 * nearby particles for a constellation effect.
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

    type Particle = {
      x: number
      y: number
      r: number
      dx: number
      dy: number
      opacity: number
      opacityDir: number
      color: string
      hue: number
    }

    const particles: Particle[] = []

    const PALETTE = [
      { str: 'rgba(244,163,0,',  hue: 38 },   // gold
      { str: 'rgba(30,144,255,', hue: 210 },  // sea
      { str: 'rgba(251,191,36,', hue: 45 },   // bright gold
      { str: 'rgba(96,184,255,', hue: 210 },  // sea light
      { str: 'rgba(168,85,247,', hue: 270 },  // purple accent
    ]

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.scale(dpr, dpr)
    }

    function createParticles() {
      const count = Math.min(Math.floor(width / 30), 50)
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const pal = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 0.4,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.15 - 0.08,
          opacity: Math.random() * 0.4 + 0.08,
          opacityDir: (Math.random() - 0.5) * 0.006,
          color: pal.str,
          hue: pal.hue,
        })
      }
    }

    const CONNECTION_DISTANCE = 120

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.06 * Math.min(particles[i].opacity, particles[j].opacity)
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(96,184,255,${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        p.opacity += p.opacityDir

        if (p.opacity <= 0.04 || p.opacity >= 0.5) p.opacityDir *= -1
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // Core dot
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `${p.color}${p.opacity})`
        ctx!.fill()

        // Soft bokeh glow
        if (p.r > 1) {
          const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
          gradient.addColorStop(0, `${p.color}${p.opacity * 0.2})`)
          gradient.addColorStop(1, `${p.color}0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2)
          ctx!.fillStyle = gradient
          ctx!.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    const onResize = () => {
      resize()
      createParticles()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'

/**
 * Optimized particle system — reduces particle count on mobile,
 * pauses when not visible, uses squared distance to avoid sqrt.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0
    let isVisible = true

    type Particle = {
      x: number
      y: number
      r: number
      dx: number
      dy: number
      opacity: number
      opacityDir: number
      color: string
      hasBokeh: boolean
    }

    const particles: Particle[] = []

    const PALETTE = [
      'rgba(244,163,0,',
      'rgba(30,144,255,',
      'rgba(251,191,36,',
      'rgba(96,184,255,',
      'rgba(168,85,247,',
    ]

    const CONNECTION_DIST_SQ = 120 * 120
    const CONNECTION_DIST = 120

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function createParticles() {
      // Fewer particles on mobile — 12 is plenty for ambience
      const isMobile = width < 768
      const maxCount = isMobile ? 12 : 30
      const count = Math.min(Math.floor(width / 40), maxCount)
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const r = Math.random() * 2 + 0.4
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.15 - 0.08,
          opacity: Math.random() * 0.4 + 0.08,
          opacityDir: (Math.random() - 0.5) * 0.006,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          hasBokeh: r > 1.2,
        })
      }
    }

    // Skip connections on mobile — O(n²) is too expensive
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768

    function scheduleNext() {
      animId = requestAnimationFrame(draw)
    }

    function draw() {
      if (!isVisible) {
        // Actually stop the loop when not visible, restart via observer
        return
      }

      ctx!.clearRect(0, 0, width, height)

      const len = particles.length

      // Connections — skip on mobile to save CPU
      if (!isMobileDevice) {
        ctx!.lineWidth = 0.5
        for (let i = 0; i < len; i++) {
          const pi = particles[i]
          for (let j = i + 1; j < len; j++) {
            const pj = particles[j]
            const dx = pi.x - pj.x
            const dy = pi.y - pj.y
            const distSq = dx * dx + dy * dy

            if (distSq < CONNECTION_DIST_SQ) {
              // Use inverse square root approximation instead of sqrt
              const alpha = (1 - distSq / CONNECTION_DIST_SQ) * 0.06 * Math.min(pi.opacity, pj.opacity)
              ctx!.beginPath()
              ctx!.moveTo(pi.x, pi.y)
              ctx!.lineTo(pj.x, pj.y)
              ctx!.strokeStyle = `rgba(96,184,255,${alpha})`
              ctx!.stroke()
            }
          }
        }
      }

      // Particles
      for (let i = 0; i < len; i++) {
        const p = particles[i]
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

        // Bokeh glow — only on desktop for larger particles
        if (p.hasBokeh && !isMobileDevice) {
          const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
          gradient.addColorStop(0, `${p.color}${p.opacity * 0.2})`)
          gradient.addColorStop(1, `${p.color}0)`)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2)
          ctx!.fillStyle = gradient
          ctx!.fill()
        }
      }

      scheduleNext()
    }

    // IntersectionObserver — fully stop/start RAF when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        // Restart the loop when becoming visible again
        if (isVisible && !wasVisible) {
          draw()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    resize()
    createParticles()
    draw()

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        createParticles()
      }, 200)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      clearTimeout(resizeTimer)
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

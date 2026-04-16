import { cn } from '@/lib/utils'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useCallback, useEffect, useState } from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  tilt?: boolean
  glow?: boolean
}

export function GlassCard({ children, className, tilt = false, glow = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const effectiveTilt = tilt && !reducedMotion

  const rx = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })
  const ry = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!effectiveTilt || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [effectiveTilt, rx, ry, mouseX, mouseY])

  const onLeave = useCallback(() => {
    rx.set(0); ry.set(0)
    mouseX.set(0.5); mouseY.set(0.5)
  }, [rx, ry, mouseX, mouseY])

  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const shine  = useMotionTemplate`radial-gradient(400px circle at ${shineX} ${shineY}, rgba(244,163,0,0.20), rgba(30,144,255,0.12), transparent 70%)`

  return (
    <motion.div
      ref={ref}
      style={effectiveTilt ? { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('bento-card relative overflow-hidden', className)}
    >
      {(tilt || glow) && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ background: shine }}
        />
      )}
      {children}
    </motion.div>
  )
}

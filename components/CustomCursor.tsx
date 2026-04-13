'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Custom cursor — dot (direct) + slow ring (spring).
 * Only rendered on pointer:fine (desktop) devices.
 * Uses rAF-throttled mousemove for performance.
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [isPress, setIsPress] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const rafRef = useRef<number>(0)

  const dotX = useMotionValue(-200)
  const dotY = useMotionValue(-200)
  const ringX = useSpring(dotX, { stiffness: 140, damping: 16 })
  const ringY = useSpring(dotY, { stiffness: 140, damping: 16 })

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(pointer: coarse)').matches) { setIsTouch(true); return }

    let lastX = -200
    let lastY = -200
    let scheduled = false

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY

      if (!scheduled) {
        scheduled = true
        rafRef.current = requestAnimationFrame(() => {
          dotX.set(lastX)
          dotY.set(lastY)
          setVisible(true)

          // Hover detection
          const t = document.elementFromPoint(lastX, lastY) as HTMLElement | null
          setIsHover(!!t?.closest('a,button,[role="button"],[data-cursor="pointer"]'))

          scheduled = false
        })
      }
    }

    const onDown = () => setIsPress(true)
    const onUp = () => setIsPress(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [dotX, dotY])

  if (!mounted || isTouch) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-gold"
        style={{
          x: dotX, y: dotY,
          width: isPress ? 6 : 8, height: isPress ? 6 : 8,
          translateX: '-50%', translateY: '-50%',
          opacity: visible ? 1 : 0,
          transition: 'width 0.1s, height 0.1s, opacity 0.2s',
          mixBlendMode: 'difference',
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-gold/40"
        style={{
          x: ringX, y: ringY,
          width: isHover ? 40 : isPress ? 28 : 32,
          height: isHover ? 40 : isPress ? 28 : 32,
          translateX: '-50%', translateY: '-50%',
          opacity: visible ? 0.6 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />
    </>
  )
}

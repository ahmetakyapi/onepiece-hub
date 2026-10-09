'use client'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/* Kaydırma hızına duyarlı sonsuz şerit.
   Kendi hızında akar; kullanıcı kaydırdıkça hızlanır, yön değiştirince
   yön değiştirir ve hıza orantılı olarak hafifçe eğilir (skew).

   İçerik 4 kopya render edilir, `wrap(-25, -50)` ile kesintisiz döner.
   Hareket azaltmada durağan. */

type Props = {
  children: ReactNode
  /** Taban hız — saniyede yüzde (negatif = sola) */
  baseVelocity?: number
  className?: string
}

export default function VelocityMarquee({ children, baseVelocity = -3, className }: Props) {
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [7, 0, -7])
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduced) return
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) direction.current = -1
    else if (vf > 0) direction.current = 1
    moveBy += direction.current * moveBy * vf
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <motion.div className="flex flex-nowrap" style={reduced ? undefined : { x, skewX: skew }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

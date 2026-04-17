'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  sfx?: string
  subtitle?: string
}

export default function MangaImpactDivider({
  sfx = 'DON!',
  subtitle = 'Macera devam ediyor',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="relative mx-auto flex max-w-6xl items-center gap-6 px-6 py-8">
      <div className="manga-speed-lines relative h-14 flex-1 overflow-hidden">
        {[12, 32, 52, 72].map((top, i) => (
          <div
            key={top}
            className="manga-speed-line"
            style={{ top: `${top}%`, width: '100%', left: '-5%', animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: -4 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <span className="manga-sfx text-3xl font-black tracking-[0.12em] sm:text-5xl">
          {sfx}
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-gold/60">
          {subtitle}
        </span>
      </motion.div>

      <div className="manga-speed-lines relative h-14 flex-1 overflow-hidden">
        {[12, 32, 52, 72].map((top, i) => (
          <div
            key={top}
            className="manga-speed-line"
            style={{
              top: `${top}%`,
              width: '100%',
              left: '-5%',
              animationDelay: `${0.1 + i * 0.08}s`,
              transform: 'scaleX(-1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

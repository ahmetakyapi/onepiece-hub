'use client'

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Compass, Film } from 'lucide-react'
import { useRef, useCallback } from 'react'
import { fadeUp } from '@/lib/variants'
import { getArcImage } from '@/lib/constants/images'
import type { Arc } from '@/types'

export default function ArcCard({ arc }: { arc: Arc }) {
  const img = getArcImage(arc.slug)
  const ref = useRef<HTMLDivElement>(null)

  // 3D tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const ry = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }, [rx, ry, mouseX, mouseY])

  const onLeave = useCallback(() => {
    rx.set(0)
    ry.set(0)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [rx, ry, mouseX, mouseY])

  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%'])
  const shine = useMotionTemplate`radial-gradient(350px circle at ${shineX} ${shineY}, rgba(244,163,0,0.08), rgba(30,144,255,0.04), transparent 70%)`

  return (
    <motion.div variants={fadeUp} style={{ perspective: '800px' }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Link
          href={`/arcs/${arc.slug}`}
          className="glass glass-lift shine-hover group relative flex flex-col overflow-hidden rounded-xl hover:border-gold/30"
        >
          {/* Shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: shine }}
          />

          {/* Cover */}
          <div className="relative h-64 w-full overflow-hidden bg-ocean-surface sm:h-72">
            {img ? (
              <Image
                src={img}
                alt={arc.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Compass className="h-10 w-10 text-sea/20" />
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/20 to-transparent" />
            {/* Episode badge */}
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-ocean-deep/80 px-2.5 py-1 text-[10px] font-bold text-sea backdrop-blur-sm border border-sea/10">
              <Film className="h-3 w-3" />
              {arc.episodeCount} Bölüm
            </span>
          </div>

          {/* Info */}
          <div className="relative z-20 p-4">
            <h3 className="mb-1 text-base font-bold text-pirate-text transition-colors group-hover:text-gold">
              {arc.name}
            </h3>
            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
              {arc.summary}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {arc.themes && arc.themes.length > 0 && (
                <span className="text-[10px] font-medium text-pirate-muted/60 truncate max-w-[60%]">
                  {arc.themes.slice(0, 2).join(' · ')}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-pirate-muted transition-all group-hover:translate-x-1 group-hover:text-gold" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

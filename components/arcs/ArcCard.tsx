'use client'

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Compass, Film } from 'lucide-react'
import { useRef, useCallback } from 'react'
import { fadeUp } from '@/lib/variants'
import { getArcImage } from '@/lib/constants/images'
import type { Arc } from '@/types'

export default function ArcCard({ arc }: { arc: Arc }) {
  const img = getArcImage(arc.slug)
  const ref = useRef<HTMLDivElement>(null)

  // 3D tilt — subtle and premium
  const rx = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })
  const ry = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5)
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
  const shine = useMotionTemplate`radial-gradient(400px circle at ${shineX} ${shineY}, rgba(244,163,0,0.06), rgba(30,144,255,0.03), transparent 70%)`

  return (
    <motion.div variants={fadeUp} style={{ perspective: '900px' }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Link
          href={`/arcs/${arc.slug}`}
          className="bento-card group relative flex flex-col overflow-hidden"
        >
          {/* Holographic shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style={{ background: shine }}
          />

          {/* Cover */}
          <div className="relative h-52 w-full overflow-hidden bg-ocean-surface sm:h-60">
            {img ? (
              <Image
                src={img}
                alt={arc.name}
                fill
                className="object-cover transition-transform duration-700 ease-expo-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Compass className="h-10 w-10 text-sea/15" />
              </div>
            )}
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />

            {/* Episode badge */}
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ocean-deep/70 px-2.5 py-1 text-[10px] font-bold text-sea backdrop-blur-md border border-sea/10">
              <Film className="h-2.5 w-2.5" />
              {arc.episodeCount} Bölüm
            </span>
          </div>

          {/* Info */}
          <div className="relative z-20 p-4">
            <h3 className="mb-1.5 text-base font-bold text-pirate-text transition-colors duration-300 group-hover:text-gold">
              {arc.name}
            </h3>
            <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-pirate-muted/70">
              {arc.summary}
            </p>

            {/* Footer — tags + arrow */}
            <div className="flex items-center justify-between">
              {arc.themes && arc.themes.length > 0 ? (
                <div className="flex gap-1.5">
                  {arc.themes.slice(0, 2).map((theme) => (
                    <span key={theme} className="tag">
                      {theme}
                    </span>
                  ))}
                </div>
              ) : (
                <div />
              )}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-transparent transition-all duration-300 group-hover:bg-gold/[0.08]">
                <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold/60" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

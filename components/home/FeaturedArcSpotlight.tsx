'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { Play, Flame, Swords, Anchor, Quote, ArrowRight } from 'lucide-react'
import { getArcBySlug } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'
import { EASE } from '@/lib/variants'
import { useViewTransition } from '@/hooks/useViewTransition'

const FEATURED_SLUG = 'marineford'
const FEATURED_QUOTE = 'Hepsi... hayalimde idi.'
const FEATURED_ATTRIBUTION = 'Edward Newgate — Beyaz Sakal'

export default function FeaturedArcSpotlight() {
  const arc = getArcBySlug(FEATURED_SLUG)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-80px' })
  const navigate = useViewTransition()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '15%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.08, 1.18])

  if (!arc) return null

  const img = getArcImage(arc.slug)
  const firstEp = arc.episodes[0]
  const href = firstEp ? `/arcs/${arc.slug}/${firstEp.slug}` : `/arcs/${arc.slug}`

  return (
    <section ref={containerRef} className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-luffy/25 bg-luffy/[0.08]">
            <Flame className="h-5 w-5 text-luffy" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-luffy">
              Destansı Düello
            </p>
            <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
              Öne Çıkan Arc
            </h2>
          </div>
          <Link href="/arcs" className="hidden text-xs font-semibold text-pirate-muted transition-colors hover:text-gold sm:flex sm:items-center sm:gap-1">
            Tüm Arc&apos;lar
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-pirate-border/20 bg-ocean-surface/30 shadow-[0_40px_120px_rgba(2,6,23,0.55)]"
        >
          <div className="relative h-[60vh] min-h-[480px] w-full overflow-hidden sm:h-[70vh]">
            {img && (
              <motion.div
                className="absolute inset-0"
                style={{ y: bgY, scale: bgScale, viewTransitionName: `arc-image-${arc.slug}` }}
              >
                <Image
                  src={img}
                  alt={arc.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={false}
                />
              </motion.div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/25 via-ocean-deep/45 to-ocean-deep" />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/70 via-transparent to-ocean-deep/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_35%_55%,transparent_30%,rgba(6,14,26,0.65))]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-luffy/[0.12] blur-[120px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gold/[0.08] blur-[120px]" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
                className="max-w-2xl"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {arc.saga && (
                    <span className="tag border-gold/25 bg-gold/[0.1] text-gold">
                      {arc.saga.toUpperCase()}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full border border-sea/25 bg-ocean-deep/60 px-2.5 py-0.5 text-[10px] font-bold text-sea backdrop-blur-md">
                    <Anchor className="h-2.5 w-2.5" />
                    {arc.episodeCount} Bölüm
                  </span>
                  {arc.location && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-pirate-border/40 bg-ocean-deep/50 px-2.5 py-0.5 text-[10px] font-semibold text-pirate-muted backdrop-blur-md">
                      {arc.location}
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
                  {arc.name}
                </h3>

                <p className="mb-5 max-w-xl text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base">
                  {arc.summary}
                </p>

                <div className="mb-6 flex items-start gap-3 rounded-xl border-l-2 border-luffy/40 bg-ocean-deep/40 p-3 backdrop-blur-sm">
                  <Quote className="mt-0.5 h-4 w-4 flex-shrink-0 text-luffy/70" />
                  <div className="min-w-0">
                    <p className="text-sm italic text-white/85 sm:text-base">&ldquo;{FEATURED_QUOTE}&rdquo;</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-luffy/70">
                      {FEATURED_ATTRIBUTION}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                      e.preventDefault()
                      navigate(href)
                    }}
                    className="btn-luffy group text-sm sm:text-base"
                  >
                    <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    Arc&apos;ı İzle
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={`/arcs/${arc.slug}`}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                      e.preventDefault()
                      navigate(`/arcs/${arc.slug}`)
                    }}
                    className="btn-ghost text-sm sm:text-base"
                  >
                    <Swords className="h-4 w-4" />
                    Detaya Git
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

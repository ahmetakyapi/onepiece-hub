'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Anchor, Compass, Film, ArrowRight } from 'lucide-react'
import { SAGAS } from '@/lib/constants/sagas'
import { getArcsBySaga } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'

const EASE = [0.16, 1, 0.3, 1] as const

function SagaSection({ saga, index }: { saga: typeof SAGAS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const arcs = getArcsBySaga(saga.slug)
  const totalEps = arcs.reduce((s, a) => s + a.episodeCount, 0)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.05 }}
    >
      {/* Saga label */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sea/[0.08] border border-sea/10">
          <Anchor className="h-3.5 w-3.5 text-sea" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-sea">
          {saga.name}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-sea/15 to-transparent" />
        <span className="rounded-full bg-sea/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-sea/70">
          {totalEps} bölüm
        </span>
      </div>

      {/* Arc cards horizontal scroll */}
      <div
        className="scrollbar-thin flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {arcs.map((arc, arcIndex) => (
          <motion.div
            key={arc.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + arcIndex * 0.07 }}
            className="snap-start"
          >
            <Link
              href={`/arcs/${arc.slug}`}
              className="bento-card group relative flex min-w-[240px] flex-col overflow-hidden sm:min-w-[280px]"
            >
              {/* Arc cover */}
              <div className="relative h-48 w-full overflow-hidden bg-ocean-surface sm:h-60">
                {getArcImage(arc.slug) ? (
                  <Image
                    src={getArcImage(arc.slug)}
                    alt={arc.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-expo-out group-hover:scale-110"
                    sizes="280px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Compass className="h-8 w-8 text-sea/20" />
                  </div>
                )}
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/20 to-transparent" />

                {/* Episode badge — floating pill */}
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ocean-deep/70 px-2.5 py-1 text-[10px] font-bold text-sea backdrop-blur-md border border-sea/10">
                  <Film className="h-2.5 w-2.5" />
                  {arc.episodeCount}
                </span>

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-sm font-bold text-white transition-colors duration-300 group-hover:text-gold leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                    {arc.name}
                  </h4>
                </div>
              </div>

              {/* Arc info */}
              <div className="p-3.5">
                <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-pirate-muted/70">
                  {arc.summary}
                </p>
                <div className="flex items-center justify-between">
                  {arc.themes && arc.themes.length > 0 && (
                    <div className="flex gap-1.5">
                      {arc.themes.slice(0, 2).map((theme) => (
                        <span key={theme} className="tag">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold/60" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ArcTimeline() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section className="relative py-20 sm:py-24">
      {/* Decorative vertical line */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-pirate-border/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14 text-center"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={headerInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/15 bg-gold/[0.06]"
          >
            <Compass className="h-6 w-6 text-gold" />
          </motion.div>
          <h2 className="mb-3 text-3xl font-extrabold text-pirate-text sm:text-4xl">
            <span className="text-gold-gradient">Grand Line</span> Rotası
          </h2>
          <p className="mx-auto max-w-md text-sm text-pirate-muted sm:text-base">
            East Blue&apos;dan Final Saga&apos;ya kadar tüm maceralar.
            Her saga yeni bir dünyanın kapılarını açar.
          </p>
        </motion.div>

        {/* Saga groups */}
        <div className="space-y-14">
          {SAGAS.map((saga, index) => (
            <SagaSection key={saga.slug} saga={saga} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16 text-center"
        >
          <Link href="/arcs" className="btn-gold group">
            Tüm Arc&apos;ları Gör
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

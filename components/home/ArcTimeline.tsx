'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Anchor, Compass, Film } from 'lucide-react'
import { SAGAS } from '@/lib/constants/sagas'
import { getArcsBySaga } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'

const EASE = [0.22, 1, 0.36, 1] as const

function SagaSection({ saga, index }: { saga: typeof SAGAS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const arcs = getArcsBySaga(saga.slug)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.05 }}
    >
      {/* Saga label */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sea/10 border border-sea/20">
          <Anchor className="h-3.5 w-3.5 text-sea" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-sea">
          {saga.name}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-sea/20 to-transparent" />
        <span className="text-[10px] font-medium text-pirate-muted">
          {arcs.reduce((s, a) => s + a.episodeCount, 0)} bölüm
        </span>
      </div>

      {/* Arc cards horizontal scroll */}
      <div
        className="scrollbar-thin flex gap-4 overflow-x-auto pb-3 -mx-2 px-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {arcs.map((arc, arcIndex) => (
          <motion.div
            key={arc.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + arcIndex * 0.08 }}
          >
            <Link
              href={`/arcs/${arc.slug}`}
              className="glass glass-lift shine-hover group relative flex min-w-[260px] flex-col overflow-hidden rounded-xl hover:border-gold/30 sm:min-w-[300px]"
            >
              {/* Arc cover */}
              <div className="relative h-56 w-full overflow-hidden bg-ocean-surface sm:h-72">
                {getArcImage(arc.slug) ? (
                  <Image
                    src={getArcImage(arc.slug)}
                    alt={arc.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="300px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Compass className="h-8 w-8 text-sea/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/10 to-transparent" />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-ocean-deep/80 px-2.5 py-1 text-[10px] font-bold text-sea backdrop-blur-sm border border-sea/10">
                  <Film className="h-3 w-3" />
                  {arc.episodeCount}
                </span>
              </div>

              {/* Arc info */}
              <div className="p-3">
                <h4 className="mb-1 text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                  {arc.name}
                </h4>
                <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
                  {arc.summary}
                </p>
                <div className="flex items-center justify-end">
                  <ChevronRight className="h-4 w-4 text-pirate-muted transition-all group-hover:translate-x-1 group-hover:text-gold" />
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
    <section className="relative py-20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-pirate-border/30 to-transparent" />

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
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20"
          >
            <Compass className="h-7 w-7 text-gold" />
          </motion.div>
          <h2 className="mb-3 text-3xl font-extrabold text-pirate-text sm:text-4xl">
            <span className="text-gold-gradient">Grand Line</span> Rotası
          </h2>
          <p className="mx-auto max-w-md text-pirate-muted">
            East Blue&apos;dan Final Saga&apos;ya kadar tüm maceralar.
            Her saga yeni bir dünyanın kapılarını açar.
          </p>
        </motion.div>

        {/* Saga groups */}
        <div className="space-y-12">
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
          className="mt-14 text-center"
        >
          <Link href="/arcs" className="btn-gold group">
            Tüm Arc&apos;ları Gör
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

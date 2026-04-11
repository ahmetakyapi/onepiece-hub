'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Anchor, Compass, Film } from 'lucide-react'
import { SAGAS } from '@/lib/constants/sagas'
import { getArcsBySaga } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer } from '@/lib/variants'

export default function ArcTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-3 text-3xl font-extrabold text-pirate-text sm:text-4xl"
          >
            <span className="text-gold-gradient">Grand Line</span> Rotası
          </motion.h2>
          <motion.p variants={fadeUp} className="text-pirate-muted">
            East Blue&apos;dan Final Saga&apos;ya kadar tüm arc&apos;lar
          </motion.p>
        </motion.div>

        {/* Saga groups */}
        <div className="space-y-10">
          {SAGAS.map((saga, sagaIndex) => {
            const arcs = getArcsBySaga(saga.slug)
            return (
              <motion.div
                key={saga.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: sagaIndex * 0.05 }}
              >
                {/* Saga label */}
                <div className="mb-4 flex items-center gap-3">
                  <Anchor className="h-4 w-4 text-sea" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-sea">
                    {saga.name}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-sea/20 to-transparent" />
                </div>

                {/* Arc cards horizontal scroll */}
                <div
                  ref={sagaIndex === 0 ? scrollRef : undefined}
                  className="scrollbar-thin flex gap-4 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {arcs.map((arc) => (
                    <Link
                      key={arc.slug}
                      href={`/arcs/${arc.slug}`}
                      className="glass group flex min-w-[260px] flex-col overflow-hidden rounded-xl transition-all hover:border-gold/30 hover:shadow-gold-glow sm:min-w-[300px]"
                    >
                      {/* Arc cover */}
                      <div className="relative h-56 w-full overflow-hidden bg-ocean-surface sm:h-72">
                        {getArcImage(arc.slug) ? (
                          <Image
                            src={getArcImage(arc.slug)}
                            alt={arc.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="300px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Compass className="h-8 w-8 text-sea/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/70 via-transparent to-transparent" />
                        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-ocean-deep/80 px-2 py-0.5 text-[10px] font-bold text-sea backdrop-blur-sm">
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
                          <ChevronRight className="h-4 w-4 text-pirate-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/arcs" className="btn-ghost">
            Tüm Arc&apos;ları Gör
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

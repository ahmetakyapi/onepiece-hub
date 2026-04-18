'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Compass, Star, MapPin, Film } from 'lucide-react'
import { ARCS } from '@/lib/constants/arcs'
import { SAGAS } from '@/lib/constants/sagas'
import { getArcImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

interface Props {
  firstArc: string
  appearances: string[]
  characterName: string
}

function CharacterArcJourney({ firstArc, appearances, characterName }: Props) {
  const journey = useMemo(() => {
    // Sort appearances by ARCS order
    const arcIndexMap = new Map(ARCS.map((a, i) => [a.slug, i]))
    const sortedSlugs = [...appearances]
      .filter(s => arcIndexMap.has(s))
      .sort((a, b) => (arcIndexMap.get(a)! - arcIndexMap.get(b)!))

    // Group by saga
    const sagaMap = new Map<string, { saga: typeof SAGAS[0]; arcs: typeof ARCS }>()
    for (const sagaItem of SAGAS) {
      sagaMap.set(sagaItem.slug, { saga: sagaItem, arcs: [] })
    }

    for (const slug of sortedSlugs) {
      const arc = ARCS.find(a => a.slug === slug)
      if (!arc) continue
      const bucket = sagaMap.get(arc.saga)
      if (bucket) bucket.arcs.push(arc)
    }

    // Only return sagas where character appears
    return Array.from(sagaMap.values()).filter(s => s.arcs.length > 0)
  }, [appearances])

  const totalArcs = appearances.length
  const totalEpisodes = useMemo(() => {
    return appearances.reduce((sum, slug) => {
      const arc = ARCS.find(a => a.slug === slug)
      return sum + (arc?.episodeCount ?? 0)
    }, 0)
  }, [appearances])

  if (journey.length === 0) return null

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Header stats */}
      <motion.div variants={fadeUp} className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
            <Compass className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">Toplam Arc</p>
            <p className="text-sm font-bold text-gold stat-number">{totalArcs}</p>
          </div>
        </div>
        <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sea/10 border border-sea/20">
            <Film className="h-4 w-4 text-sea" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">Bölüm</p>
            <p className="text-sm font-bold text-sea stat-number">{totalEpisodes}</p>
          </div>
        </div>
        <div className="bento-card flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-luffy/10 border border-luffy/20">
            <Star className="h-4 w-4 text-luffy" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">İlk Arc</p>
            <p className="truncate text-sm font-bold text-luffy">
              {ARCS.find(a => a.slug === firstArc)?.name ?? '—'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Saga-grouped journey */}
      <div className="space-y-6">
        {journey.map(({ saga, arcs }, sagaIdx) => (
          <motion.div
            key={saga.slug}
            variants={fadeUp}
            className="relative"
          >
            {/* Saga header */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10">
                <span className="text-[10px] font-bold tabular-nums text-gold">
                  {String(sagaIdx + 1).padStart(2, '0')}
                </span>
              </div>
              <Link
                href={`/sagas/${saga.slug}`}
                className="group/saga inline-flex items-center gap-2 text-sm font-bold text-pirate-text transition-colors hover:text-gold"
              >
                <span>{saga.name} Sagası</span>
                <span className="rounded-full bg-ocean-surface/60 px-2 py-0.5 text-[10px] font-semibold text-pirate-muted">
                  {arcs.length} arc
                </span>
              </Link>
            </div>

            {/* Arcs in this saga */}
            <ol className="relative ml-[13px] space-y-2 border-l border-pirate-border/20 pl-6">
              {arcs.map((arc, arcIdx) => {
                const isFirstArc = arc.slug === firstArc
                const cover = getArcImage(arc.slug)

                return (
                  <motion.li
                    key={arc.slug}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, ease: EASE, delay: arcIdx * 0.03 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <span className={`absolute -left-[29px] top-3 flex h-3 w-3 items-center justify-center rounded-full border-2 backdrop-blur-md ${
                      isFirstArc
                        ? 'border-luffy bg-luffy/30'
                        : 'border-pirate-border/40 bg-ocean-surface/60'
                    }`}>
                      {isFirstArc && <span className="h-1 w-1 rounded-full bg-luffy" />}
                    </span>

                    <Link
                      href={`/arcs/${arc.slug}`}
                      className={`group flex items-center gap-3 overflow-hidden rounded-xl border bg-ocean-surface/30 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ocean-surface/60 ${
                        isFirstArc
                          ? 'border-luffy/30 hover:border-luffy/50'
                          : 'border-pirate-border/20 hover:border-gold/30'
                      }`}
                    >
                      {cover && (
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-pirate-border/30">
                          <Image
                            src={cover}
                            alt={arc.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`truncate text-sm font-bold transition-colors ${
                            isFirstArc
                              ? 'text-luffy group-hover:text-luffy'
                              : 'text-pirate-text group-hover:text-gold'
                          }`}>
                            {arc.name}
                          </p>
                          {isFirstArc && (
                            <span className="flex-shrink-0 rounded-full border border-luffy/30 bg-luffy/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-luffy">
                              Debut
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-pirate-muted">
                          {arc.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" />
                              <span className="truncate">{arc.location}</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Film className="h-2.5 w-2.5" />
                            {arc.episodeCount}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                )
              })}
            </ol>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default memo(CharacterArcJourney)

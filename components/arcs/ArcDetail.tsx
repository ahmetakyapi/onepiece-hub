'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Play, Compass, Film, Clock,
  ChevronRight, BrainCircuit, MessageCircle,
  MapPin, Skull, Sparkles, BookOpen, Users, ArrowRight, Swords
} from 'lucide-react'
import { getArcImage } from '@/lib/constants/images'
import { getCharacterImage } from '@/lib/constants/images'
import { getGlobalEpisodeNumber, ARCS } from '@/lib/constants/arcs'
import { BATTLES } from '@/lib/constants/battles'
import type { Arc } from '@/types'
import CommentSection from '@/components/ui/CommentSection'
import FavoriteButton from '@/components/ui/FavoriteButton'

const EASE = [0.16, 1, 0.3, 1] as const

export default function ArcDetailClient({ arc }: { arc: Arc }) {
  const coverRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ['start start', 'end start'],
  })
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const coverOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Link
              href="/arcs"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-pirate-border/30 bg-ocean-surface/30 px-4 py-2 text-[13px] text-pirate-muted transition-all duration-300 hover:border-gold/20 hover:text-gold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Tüm Arc&apos;lar
            </Link>
          </motion.div>

          {/* Cover with parallax */}
          <motion.div
            ref={coverRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative mb-8 h-56 overflow-hidden rounded-3xl bg-ocean-surface sm:h-80"
          >
            {getArcImage(arc.slug) ? (
              <motion.div className="absolute inset-0" style={{ scale: coverScale, opacity: coverOpacity }}>
                <Image
                  src={getArcImage(arc.slug)}
                  alt={arc.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 896px"
                  priority
                />
              </motion.div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Compass className="h-16 w-16 text-sea/15" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/30 via-transparent to-ocean-deep/30" />
          </motion.div>

          {/* Title + meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mb-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-pirate-text sm:text-4xl">
                {arc.name}
              </h1>
              <FavoriteButton targetType="arc" targetSlug={arc.slug} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-pirate-muted">
              <span className="flex items-center gap-1.5">
                <Film className="h-4 w-4 text-sea" />
                {arc.episodeCount} Bölüm
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold" />
                ~{Math.round(arc.episodeCount * 24 / 60)} saat
              </span>
            </div>
          </motion.div>

          {/* Meta cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            {arc.location && (
              <div className="bento-card flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sea/[0.08]">
                  <MapPin className="h-4 w-4 text-sea" />
                </div>
                <div>
                  <p className="text-[10px] text-pirate-muted/60">Konum</p>
                  <p className="text-sm font-semibold text-pirate-text">{arc.location}</p>
                </div>
              </div>
            )}
            {arc.villain && (
              <div className="bento-card flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-luffy/[0.08]">
                  <Skull className="h-4 w-4 text-luffy" />
                </div>
                <div>
                  <p className="text-[10px] text-pirate-muted/60">Ana Düşman</p>
                  <p className="text-sm font-semibold text-pirate-text">{arc.villain}</p>
                </div>
              </div>
            )}
            {arc.characters && arc.characters.length > 0 && (
              <div className="bento-card flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sea/[0.08]">
                  <Users className="h-4 w-4 text-sea" />
                </div>
                <div>
                  <p className="text-[10px] text-pirate-muted/60">Öne Çıkan Karakterler</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {arc.characters.map((slug) => (
                      <Link
                        key={slug}
                        href={`/characters/${slug}`}
                        className="tag transition-colors hover:bg-sea/[0.12] hover:text-sea"
                      >
                        {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1" />
            <Link href={`/quiz/${arc.slug}`} className="btn-ghost text-sm">
              <BrainCircuit className="h-4 w-4" />
              Arc Quiz
            </Link>
          </motion.div>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="mb-6 text-base leading-relaxed text-pirate-muted"
          >
            {arc.summary}
          </motion.p>

          {/* Detailed Summary */}
          {arc.detailedSummary && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
              className="bento-card mb-8 p-6"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-pirate-text">
                <BookOpen className="h-4 w-4 text-gold" />
                Detaylı Özet
              </h3>
              <p className="text-sm leading-relaxed text-pirate-muted/80">
                {arc.detailedSummary}
              </p>
            </motion.div>
          )}

          {/* ─── Episode List ──────────────────────────────────────── */}
          <section className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Film className="h-5 w-5 text-sea" />
                Bölümler
                <span className="ml-1 rounded-full bg-sea/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-sea/70">
                  {arc.episodeCount}
                </span>
              </h2>
              <Link
                href={`/arcs/${arc.slug}/${arc.episodes[0]?.slug}`}
                className="btn-gold text-xs sm:text-sm"
              >
                <Play className="h-4 w-4" />
                İzlemeye Başla
              </Link>
            </div>

            <div className="space-y-2">
              {arc.episodes.map((ep, i) => {
                const globalEp = getGlobalEpisodeNumber(arc.slug, ep.number)
                return (
                <motion.div
                  key={ep.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Link
                    href={`/arcs/${arc.slug}/${ep.slug}`}
                    className="bento-card group flex items-center gap-4 px-4 py-3.5"
                  >
                    {/* Episode number */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ocean-surface/80 border border-pirate-border/20 text-sm font-bold text-sea transition-all duration-300 group-hover:border-gold/20 group-hover:text-gold">
                      {globalEp}
                    </div>

                    {/* Title + summary */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-pirate-text transition-colors duration-300 group-hover:text-gold">
                        {ep.title}
                      </p>
                      {ep.summary && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-pirate-muted/50">
                          {ep.summary}
                        </p>
                      )}
                      <p className="mt-0.5 text-[11px] text-pirate-muted/40">{ep.duration}</p>
                    </div>

                    {/* Play icon */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gold/[0.08]">
                      <Play className="h-3.5 w-3.5 text-pirate-muted/30 transition-colors duration-300 group-hover:text-gold" />
                    </div>
                  </Link>
                </motion.div>
              )})}
            </div>
          </section>

          {/* ─── Key Events & Themes ──────────────────────────────── */}
          <div className="mb-10">
            {arc.keyEvents && arc.keyEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="bento-card mb-6 p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-pirate-text">
                  <Sparkles className="h-4 w-4 text-gold" />
                  Önemli Olaylar
                </h3>
                <ul className="space-y-3">
                  {arc.keyEvents.map((event) => (
                    <li key={event} className="flex items-start gap-3 text-sm text-pirate-muted/80">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold/50" />
                      {event}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {arc.themes && arc.themes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-6 flex flex-wrap gap-2"
              >
                {arc.themes.map((theme) => (
                  <span key={theme} className="chip">
                    {theme}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* ─── Related Battles ─────────────────────────────────── */}
          {(() => {
            const arcBattles = BATTLES.filter((b) => b.arcSlug === arc.slug)
            if (arcBattles.length === 0) return null
            return (
              <section className="mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-pirate-text">
                    <Swords className="h-5 w-5 text-luffy" />
                    Bu Arc&apos;taki Savaşlar
                    <span className="ml-1 rounded-full bg-luffy/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-luffy/70">
                      {arcBattles.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {arcBattles.map((battle) => (
                      <Link
                        key={battle.slug}
                        href="/battles"
                        className="bento-card group flex items-center gap-4 px-5 py-4"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-luffy/[0.06] border border-luffy/10">
                          <Swords className="h-4 w-4 text-luffy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-pirate-text group-hover:text-gold transition-colors">
                            {battle.name}
                          </p>
                          <p className="text-[11px] text-pirate-muted/60 line-clamp-1 mt-0.5">
                            {battle.significance}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-pirate-muted/50">
                          {battle.episodes && <span>{battle.episodes}</span>}
                          <ChevronRight className="h-3.5 w-3.5 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </section>
            )
          })()}

          {/* ─── Prev/Next Arc Navigation ─────────────────────────── */}
          {(() => {
            const arcIndex = ARCS.findIndex((a) => a.slug === arc.slug)
            const prevArc = arcIndex > 0 ? ARCS[arcIndex - 1] : null
            const nextArc = arcIndex < ARCS.length - 1 ? ARCS[arcIndex + 1] : null
            if (!prevArc && !nextArc) return null
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-10 grid grid-cols-2 gap-3"
              >
                {prevArc ? (
                  <Link
                    href={`/arcs/${prevArc.slug}`}
                    className="bento-card group flex items-center gap-3 px-4 py-3"
                  >
                    <ArrowLeft className="h-4 w-4 text-pirate-muted group-hover:text-gold group-hover:-translate-x-1 transition-all" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-pirate-muted/50">Önceki Arc</p>
                      <p className="text-xs font-semibold text-pirate-text group-hover:text-gold transition-colors truncate">{prevArc.name}</p>
                    </div>
                  </Link>
                ) : <div />}
                {nextArc ? (
                  <Link
                    href={`/arcs/${nextArc.slug}`}
                    className="bento-card group flex items-center justify-end gap-3 px-4 py-3 text-right"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] text-pirate-muted/50">Sonraki Arc</p>
                      <p className="text-xs font-semibold text-pirate-text group-hover:text-gold transition-colors truncate">{nextArc.name}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-pirate-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : <div />}
              </motion.div>
            )
          })()}

          {/* Comments */}
          <CommentSection targetType="arc" targetSlug={arc.slug} />
        </div>
      </main>
  )
}

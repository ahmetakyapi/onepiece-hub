'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
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
  const [parallaxEnabled, setParallaxEnabled] = useState(false)

  useEffect(() => {
    setParallaxEnabled(window.matchMedia('(min-width: 768px)').matches)
  }, [])

  const coverRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ['start start', 'end start'],
  })
  const coverScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])
  const coverOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])
  const coverY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
      <main className="relative min-h-screen">
        {/* ─── Cinematic Hero ────────────────────────────────── */}
        <section
          ref={coverRef}
          className="relative h-[64vh] min-h-[380px] overflow-hidden sm:h-[70vh] sm:min-h-[420px] md:h-[72vh] md:min-h-[460px]"
        >
          {getArcImage(arc.slug) ? (
            <motion.div
              className="absolute inset-0"
              style={parallaxEnabled ? { scale: coverScale, opacity: coverOpacity, y: coverY, viewTransitionName: `arc-image-${arc.slug}` } : { viewTransitionName: `arc-image-${arc.slug}` }}
            >
              <Image
                src={getArcImage(arc.slug)}
                alt={arc.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ocean-surface to-ocean-deep">
              <Compass className="h-24 w-24 text-sea/15 animate-float" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/50 via-ocean-deep/20 to-ocean-deep" />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/60 via-transparent to-ocean-deep/50" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ocean-deep via-ocean-deep/80 to-transparent" />

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute left-0 right-0 top-0 z-10 px-6 pt-24 sm:pt-28"
          >
            <div className="mx-auto max-w-5xl">
              <Link
                href="/arcs"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ocean-deep/50 px-4 py-2 text-[13px] text-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:text-gold group"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Tüm Arc&apos;lar
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:pb-14"
          >
            <div className="mx-auto max-w-5xl">
              {arc.saga && (
                <span className="mb-3 inline-block tag border-gold/25 bg-gold/[0.1] text-gold backdrop-blur-md">
                  {arc.saga.toUpperCase()} SAGA
                </span>
              )}
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
                  {arc.name}
                </h1>
                <FavoriteButton targetType="arc" targetSlug={arc.slug} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <span className="flex items-center gap-1.5">
                  <Film className="h-4 w-4 text-sea-light" />
                  {arc.episodeCount} Bölüm
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" />
                  ~{Math.round(arc.episodeCount * 24 / 60)} saat
                </span>
                {arc.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-sea" />
                    {arc.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mx-auto max-w-5xl px-6 pt-10">

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
              {arc.episodes.map((ep) => {
                const globalEp = getGlobalEpisodeNumber(arc.slug, ep.number)
                return (
                  <Link
                    key={ep.slug}
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

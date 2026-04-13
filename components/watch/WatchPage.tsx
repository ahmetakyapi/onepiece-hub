'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Check, Film, Play, BookOpen,
  ExternalLink, AlertTriangle, Clock, Eye,
  Compass, ArrowRight
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { getGlobalEpisodeNumber } from '@/lib/constants/arcs'
import { useWatchedEpisodes } from '@/hooks/useWatchedEpisodes'
import type { Arc, Episode } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type ArcLink = { name: string; slug: string; firstEpisodeSlug?: string }

type Props = {
  arc: Arc
  episode: Episode
  prevEpisode: Episode | null
  nextEpisode: Episode | null
  prevArc: ArcLink | null
  nextArc: ArcLink | null
}

export default function WatchPageClient({ arc, episode, prevEpisode, nextEpisode, prevArc, nextArc }: Props) {
  const globalEp = getGlobalEpisodeNumber(arc.slug, episode.number)
  const onePaceTrUrl = `https://www.onepacetr.net/bolum/${globalEp}`
  const [iframeError, setIframeError] = useState(false)
  const { isWatched, toggle, watchedCount } = useWatchedEpisodes()
  const currentRef = useRef<HTMLAnchorElement>(null)

  const allSlugs = arc.episodes.map((ep) => ep.slug)
  const watched = watchedCount(allSlugs)
  const currentIsWatched = isWatched(episode.slug)

  // Scroll current episode into view in the list
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [episode.slug])

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm px-3 sm:px-0">
            <Link
              href={`/arcs/${arc.slug}`}
              className="inline-flex items-center gap-1.5 text-pirate-muted transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              {arc.name}
            </Link>
            <span className="text-pirate-muted/40">•</span>
            <span className="text-pirate-muted">
              {watched}/{arc.episodeCount} izlendi
            </span>
          </div>

          {/* ─── Main Layout: Video + Episode List ─────────────── */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 lg:flex-row"
          >
            {/* Left: Video + Controls */}
            <motion.div variants={fadeUp} className="flex-1 min-w-0">
              {/* Episode title */}
              <div className="mb-3 px-3 sm:px-0">
                <div className="mb-1 flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-medium text-sea">
                    Bölüm {globalEp}
                  </p>
                  <span className="text-pirate-muted/30">•</span>
                  <span className="text-[10px] text-pirate-muted/50 tabular-nums">
                    {arc.name} — {episode.number}/{arc.episodeCount}
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                  {episode.title}
                </h1>
              </div>

              {/* Video player — OnePaceTR iframe zoomed to video area */}
              <div className="mb-3 overflow-hidden rounded-none border-x-0 border-y border-pirate-border bg-ocean-deep shadow-2xl shadow-black/20 sm:rounded-2xl sm:border">
                <div className="relative w-full overflow-hidden bg-[#0d1b2a] aspect-[4/3] sm:aspect-[16/11]">
                  {!iframeError ? (
                    <iframe
                      src={onePaceTrUrl}
                      className="absolute border-0"
                      style={{
                        width: '200%',
                        height: '255%',
                        left: '-55%',
                        top: '-38%',
                      }}
                      allowFullScreen
                      allow="autoplay; fullscreen; encrypted-media"
                      onError={() => setIframeError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                      <AlertTriangle className="h-12 w-12 text-gold/40" />
                      <p className="text-sm font-semibold text-pirate-text">Video yüklenemedi</p>
                      <a
                        href={onePaceTrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold inline-flex"
                      >
                        <Play className="h-4 w-4" />
                        OnePaceTR&apos;de İzle
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls row */}
              <div className="mb-5 flex flex-wrap items-center gap-2 px-3 sm:px-0">
                {/* Mark watched */}
                <button
                  onClick={() => toggle(episode.slug, arc.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    currentIsWatched
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'border-pirate-border bg-ocean-surface text-pirate-muted hover:border-gold/20 hover:text-gold'
                  }`}
                >
                  {currentIsWatched ? (
                    <>
                      <Check className="h-4 w-4" />
                      İzlendi
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      İzledim İşaretle
                    </>
                  )}
                </button>

                {/* OnePaceTR link */}
                <a
                  href={onePaceTrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-pirate-border bg-ocean-surface px-3 py-2 text-xs font-medium text-pirate-muted transition-all hover:border-gold/20 hover:text-gold sm:text-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  OnePaceTR
                </a>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Prev / Next */}
                {prevEpisode ? (
                  <Link
                    href={`/arcs/${arc.slug}/${prevEpisode.slug}`}
                    className="btn-ghost text-xs sm:text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Önceki</span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextEpisode ? (
                  <Link
                    href={`/arcs/${arc.slug}/${nextEpisode.slug}`}
                    className="btn-gold text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <span className="sm:hidden">İleri</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Episode summary — below controls */}
              {episode.summary && (
                <div className="bento-card rounded-xl p-5 mx-3 sm:mx-0">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-pirate-text">
                    <BookOpen className="h-4 w-4 text-gold" />
                    Bölüm Özeti
                  </h3>
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {episode.summary}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Right: Episode List Sidebar */}
            <motion.div variants={fadeUp} className="w-full lg:w-[22rem] xl:w-[26rem] flex-shrink-0 px-3 sm:px-0">
              <div className="bento-card sticky top-24 rounded-2xl p-4 sm:p-5">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-pirate-text sm:text-base">
                    <Film className="h-4 w-4 text-sea" />
                    Bölümler
                  </h2>
                  <span className="text-xs text-pirate-muted">
                    {watched}/{arc.episodeCount}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-ocean-surface">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright"
                    initial={{ width: 0 }}
                    animate={{ width: `${(watched / arc.episodeCount) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* Episode list */}
                <div className="max-h-[55vh] space-y-1 overflow-y-auto pr-1 scrollbar-thin">
                  {arc.episodes.map((ep) => {
                    const isCurrent = ep.slug === episode.slug
                    const epWatched = isWatched(ep.slug)
                    const epGlobal = getGlobalEpisodeNumber(arc.slug, ep.number)
                    return (
                      <Link
                        key={ep.slug}
                        ref={isCurrent ? currentRef : undefined}
                        href={`/arcs/${arc.slug}/${ep.slug}`}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                          isCurrent
                            ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_rgba(244,163,0,0.08)]'
                            : epWatched
                            ? 'text-pirate-muted/70 hover:bg-sea/5 hover:text-pirate-text'
                            : 'text-pirate-muted hover:bg-sea/5 hover:text-pirate-text'
                        }`}
                      >
                        {/* Episode number with watched indicator */}
                        <span className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isCurrent
                            ? 'bg-gold/20 text-gold'
                            : epWatched
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-ocean-surface text-sea'
                        }`}>
                          {epWatched && !isCurrent ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            epGlobal
                          )}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <span className={`block truncate text-sm ${
                            epWatched && !isCurrent ? 'line-through decoration-pirate-muted/30' : ''
                          }`}>
                            {ep.title}
                          </span>
                        </div>

                        {/* Duration */}
                        <span className="flex items-center gap-1 text-xs opacity-50 flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          {ep.duration}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* ─── Next/Prev Arc Navigation ──────────────────── */}
                <div className="mt-4 border-t border-pirate-border pt-4 space-y-2">
                  {prevArc && (
                    <Link
                      href={`/arcs/${prevArc.slug}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-pirate-muted transition-all hover:bg-sea/5 hover:text-pirate-text"
                    >
                      <ChevronLeft className="h-4 w-4 flex-shrink-0 text-sea transition-transform group-hover:-translate-x-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/50">Önceki Arc</p>
                        <p className="truncate font-medium">{prevArc.name}</p>
                      </div>
                    </Link>
                  )}
                  {nextArc && (
                    <Link
                      href={nextArc.firstEpisodeSlug ? `/arcs/${nextArc.slug}/${nextArc.firstEpisodeSlug}` : `/arcs/${nextArc.slug}`}
                      className="group flex items-center gap-3 rounded-lg border border-gold/10 bg-gold/5 px-3 py-2.5 text-sm text-gold transition-all hover:border-gold/25 hover:bg-gold/10"
                    >
                      <Compass className="h-4 w-4 flex-shrink-0 transition-transform group-hover:rotate-45" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold/50">Sonraki Arc</p>
                        <p className="truncate font-medium">{nextArc.name}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

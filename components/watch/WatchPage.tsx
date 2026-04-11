'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  CheckCircle, Film, Play, BookOpen
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import type { Arc, Episode } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type Props = {
  arc: Arc
  episode: Episode
  prevEpisode: Episode | null
  nextEpisode: Episode | null
}

export default function WatchPageClient({ arc, episode, prevEpisode, nextEpisode }: Props) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Back to arc */}
          <Link
            href={`/arcs/${arc.slug}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {arc.name}
          </Link>

          {/* Episode info */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <p className="mb-1 text-xs font-medium text-sea">
                Bölüm {episode.number} / {arc.episodeCount}
              </p>
              <h1 className="text-2xl font-extrabold text-pirate-text sm:text-3xl">
                {episode.title}
              </h1>
            </motion.div>

            {/* Video player area */}
            <motion.div
              variants={fadeUp}
              className="mb-6 overflow-hidden rounded-2xl border border-pirate-border bg-ocean-deep shadow-2xl shadow-black/20"
            >
              <div className="relative aspect-video w-full">
                {episode.pixeldrainId ? (
                  <iframe
                    src={`https://pixeldrain.com/api/file/${episode.pixeldrainId}?embed`}
                    className="absolute inset-0 h-full w-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-ocean-surface">
                    <Play className="h-16 w-16 text-gold/30" />
                    <div className="text-center">
                      <p className="mb-2 text-sm font-semibold text-pirate-text">
                        Video henüz eklenmedi
                      </p>
                      <p className="text-xs text-pirate-muted">
                        Bu bölüm için video linki yakında eklenecek
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Episode summary */}
            {episode.summary && (
              <motion.div variants={fadeUp} className="glass mb-6 rounded-xl p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-pirate-text">
                  <BookOpen className="h-4 w-4 text-gold" />
                  Bölüm Özeti
                </h3>
                <p className="text-sm leading-relaxed text-pirate-muted">
                  {episode.summary}
                </p>
              </motion.div>
            )}

            {/* Episode navigation */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex items-center justify-between gap-4"
            >
              {prevEpisode ? (
                <Link
                  href={`/arcs/${arc.slug}/${prevEpisode.slug}`}
                  className="btn-ghost text-xs sm:text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prevEpisode.title}</span>
                  <span className="sm:hidden">Önceki</span>
                </Link>
              ) : (
                <div />
              )}

              {/* Mark as watched */}
              <button className="btn-ghost text-xs sm:text-sm">
                <CheckCircle className="h-4 w-4" />
                İzledim
              </button>

              {nextEpisode ? (
                <Link
                  href={`/arcs/${arc.slug}/${nextEpisode.slug}`}
                  className="btn-gold text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">{nextEpisode.title}</span>
                  <span className="sm:hidden">Sonraki</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <div />
              )}
            </motion.div>

            {/* Episode list sidebar */}
            <motion.div variants={fadeUp}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-pirate-text">
                <Film className="h-4 w-4 text-sea" />
                {arc.name} — Tüm Bölümler
              </h2>
              <div className="glass max-h-80 space-y-1 overflow-y-auto rounded-xl p-3">
                {arc.episodes.map((ep) => {
                  const isCurrent = ep.slug === episode.slug
                  return (
                    <Link
                      key={ep.slug}
                      href={`/arcs/${arc.slug}/${ep.slug}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        isCurrent
                          ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_rgba(244,163,0,0.1)]'
                          : 'text-pirate-muted hover:bg-sea/5 hover:text-pirate-text'
                      }`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                        isCurrent ? 'bg-gold/20 text-gold' : 'bg-ocean-surface text-sea'
                      }`}>
                        {ep.number}
                      </span>
                      <span className="flex-1 truncate">{ep.title}</span>
                      <span className="text-xs opacity-60">{ep.duration}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

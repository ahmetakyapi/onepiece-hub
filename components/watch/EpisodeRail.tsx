'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Check, ChevronLeft, ChevronRight, Clock, Compass, Film,
  ListFilter, Play, Search, SkipForward, X,
} from 'lucide-react'
import { EASE } from '@/lib/variants'
import type { Arc, Episode } from '@/types'

type ArcLink = { name: string; slug: string; firstEpisodeSlug?: string }

type Props = {
  arc: Arc
  currentSlug: string
  isWatched: (slug: string) => boolean
  watchedCount: number
  globalNumberOf: (episodeNumber: number) => number
  nextUnwatched: Episode | null
  prevArc: ArcLink | null
  nextArc: ArcLink | null
}

type Filter = 'all' | 'unwatched'

const PROGRESS_RADIUS = 20
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

/* ─── Tek bölüm satırı ─────────────────────────────────────────────────── */

type RowProps = {
  episode: Episode
  globalNumber: number
  isCurrent: boolean
  isWatched: boolean
  href: string
  innerRef?: React.Ref<HTMLAnchorElement>
}

const EpisodeRow = memo(function EpisodeRow({
  episode,
  globalNumber,
  isCurrent,
  isWatched,
  href,
  innerRef,
}: RowProps) {
  return (
    <Link
      ref={innerRef}
      href={href}
      aria-current={isCurrent ? 'true' : undefined}
      className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
        isCurrent
          ? 'border border-gold/25 bg-gold/[0.09] text-gold shadow-[0_0_16px_rgba(244,163,0,0.08)]'
          : 'border border-transparent text-pirate-muted hover:bg-sea/[0.06] hover:text-pirate-text'
      }`}
    >
      <span
        className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tabular-nums ${
          isCurrent
            ? 'bg-gold/20 text-gold'
            : isWatched
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-ocean-surface text-sea'
        }`}
      >
        {isCurrent ? (
          <Play className="h-3 w-3 fill-current" />
        ) : isWatched ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          globalNumber
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[13px] font-medium ${
            isWatched && !isCurrent ? 'opacity-60' : ''
          }`}
        >
          {episode.title}
        </span>
        <span className="block text-[10px] tabular-nums opacity-50">
          Bölüm {episode.number}
        </span>
      </span>

      <span className="flex flex-shrink-0 items-center gap-1 text-[10px] tabular-nums opacity-50">
        <Clock className="h-3 w-3" />
        {episode.duration}
      </span>
    </Link>
  )
})

/* ─── Rail ─────────────────────────────────────────────────────────────── */

export default function EpisodeRail({
  arc,
  currentSlug,
  isWatched,
  watchedCount,
  globalNumberOf,
  nextUnwatched,
  prevArc,
  nextArc,
}: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const currentRef = useRef<HTMLAnchorElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const percent = arc.episodeCount > 0 ? Math.round((watchedCount / arc.episodeCount) * 100) : 0

  const visibleEpisodes = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr')
    return arc.episodes.filter((ep) => {
      if (filter === 'unwatched' && isWatched(ep.slug) && ep.slug !== currentSlug) return false
      if (!needle) return true
      return (
        ep.title.toLocaleLowerCase('tr').includes(needle) ||
        String(ep.number) === needle ||
        String(globalNumberOf(ep.number)) === needle
      )
    })
  }, [arc.episodes, query, filter, isWatched, currentSlug, globalNumberOf])

  /* Aktif bölümü listede görünür yap — yalnızca liste kutusu içinde kaydır,
     sayfayı zıplatmadan. */
  useEffect(() => {
    const node = currentRef.current
    const container = listRef.current
    if (!node || !container) return
    const nodeTop = node.offsetTop
    container.scrollTo({
      top: nodeTop - container.clientHeight / 2 + node.clientHeight / 2,
      behavior: 'smooth',
    })
  }, [currentSlug, visibleEpisodes.length])

  return (
    <aside className="bento-card rounded-2xl p-3.5 sm:p-4" aria-label="Bölüm listesi">
      {/* ── Başlık ─────────────────────────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-bold text-pirate-text">
          <Film className="h-4 w-4 text-sea" />
          {arc.name}
        </h2>
        <span className="stat-number flex-shrink-0 text-[11px] text-pirate-muted">
          {watchedCount}/{arc.episodeCount}
        </span>
      </div>

      {/* ── İlerleme pusulası ──────────────────────────────────────────── */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-pirate-border/30 bg-ocean-deep/40 px-3 py-2.5">
        <div className="relative h-11 w-11 flex-shrink-0">
          <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="24"
              cy="24"
              r={PROGRESS_RADIUS}
              className="fill-none stroke-ocean-surface"
              strokeWidth="4"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={PROGRESS_RADIUS}
              className="fill-none stroke-gold"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={PROGRESS_CIRCUMFERENCE}
              initial={false}
              animate={{ strokeDashoffset: PROGRESS_CIRCUMFERENCE * (1 - percent / 100) }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-4 w-4 text-gold" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
            Arc ilerlemesi
          </p>
          <p className="text-[13px] font-bold text-pirate-text">
            {watchedCount} / {arc.episodeCount} bölüm
          </p>
        </div>
        <p className="stat-number text-sm font-black text-gold">{percent}%</p>
      </div>

      {/* ── Sıradaki izlenmemiş ────────────────────────────────────────── */}
      {nextUnwatched && nextUnwatched.slug !== currentSlug && (
        <Link
          href={`/arcs/${arc.slug}/${nextUnwatched.slug}`}
          className="mb-3 flex items-center gap-2.5 rounded-xl border border-sea/20 bg-sea/[0.07] px-3 py-2 transition-colors hover:border-sea/35 hover:bg-sea/[0.12]"
        >
          <SkipForward className="h-3.5 w-3.5 flex-shrink-0 text-sea" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-sea/70">
              Sıradaki izlenmemiş
            </span>
            <span className="block truncate text-[12px] font-semibold text-pirate-text">
              {nextUnwatched.title}
            </span>
          </span>
          <kbd className="flex-shrink-0 rounded border border-sea/25 bg-ocean-deep/60 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sea">
            U
          </kbd>
        </Link>
      )}

      {/* ── Arama + filtre ────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-pirate-muted/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bölüm ara…"
            aria-label="Bölüm ara"
            className="w-full rounded-lg border border-pirate-border/50 bg-ocean-deep/50 py-1.5 pl-8 pr-7 text-[12px] text-pirate-text placeholder:text-pirate-muted/50 focus:border-gold/30 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Aramayı temizle"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-pirate-muted/60 transition-colors hover:text-gold"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFilter((f) => (f === 'all' ? 'unwatched' : 'all'))}
          aria-pressed={filter === 'unwatched'}
          title={filter === 'unwatched' ? 'Tüm bölümleri göster' : 'Sadece izlenmeyenler'}
          className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
            filter === 'unwatched'
              ? 'border-gold/30 bg-gold/[0.1] text-gold'
              : 'border-pirate-border/50 bg-ocean-deep/50 text-pirate-muted hover:text-pirate-text'
          }`}
        >
          <ListFilter className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Liste ─────────────────────────────────────────────────────── */}
      <div
        ref={listRef}
        className="scrollbar-thin max-h-[min(52vh,26rem)] space-y-0.5 overflow-y-auto overscroll-contain pr-1"
      >
        {visibleEpisodes.length === 0 ? (
          <p className="px-2 py-6 text-center text-[12px] text-pirate-muted">
            {filter === 'unwatched'
              ? 'Bu arc’ın tüm bölümlerini izledin 🎉'
              : 'Eşleşen bölüm yok'}
          </p>
        ) : (
          visibleEpisodes.map((ep) => (
            <EpisodeRow
              key={ep.slug}
              episode={ep}
              globalNumber={globalNumberOf(ep.number)}
              isCurrent={ep.slug === currentSlug}
              isWatched={isWatched(ep.slug)}
              href={`/arcs/${arc.slug}/${ep.slug}`}
              innerRef={ep.slug === currentSlug ? currentRef : undefined}
            />
          ))
        )}
      </div>

      {/* ── Arc geçişleri ─────────────────────────────────────────────── */}
      {(prevArc || nextArc) && (
        <div className="mt-3 space-y-1.5 border-t border-pirate-border/50 pt-3">
          {prevArc && (
            <Link
              href={`/arcs/${prevArc.slug}`}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-pirate-muted transition-colors hover:bg-sea/[0.06] hover:text-pirate-text"
            >
              <ChevronLeft className="h-4 w-4 flex-shrink-0 text-sea transition-transform group-hover:-translate-x-0.5" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-60">
                  Önceki arc
                </span>
                <span className="block truncate text-[12px] font-medium">{prevArc.name}</span>
              </span>
            </Link>
          )}
          {nextArc && (
            <Link
              href={
                nextArc.firstEpisodeSlug
                  ? `/arcs/${nextArc.slug}/${nextArc.firstEpisodeSlug}`
                  : `/arcs/${nextArc.slug}`
              }
              className="group flex items-center gap-2.5 rounded-lg border border-gold/12 bg-gold/[0.05] px-2.5 py-2 text-gold transition-colors hover:border-gold/25 hover:bg-gold/[0.1]"
            >
              <Compass className="h-4 w-4 flex-shrink-0 transition-transform group-hover:rotate-45" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-60">
                  Sonraki arc
                </span>
                <span className="block truncate text-[12px] font-medium">{nextArc.name}</span>
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      )}
    </aside>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, TimerReset, X } from 'lucide-react'
import { EASE } from '@/lib/variants'
import { useLastWatched } from '@/hooks/useLastWatched'
import { getTimeAgo } from '@/lib/utils'

type Props = {
  /** `compact` ana sayfa gibi yerlerde daha alçak bir şerit çizer */
  compact?: boolean
  className?: string
}

/**
 * "Kaldığın yerden devam et" şeridi.
 *
 * Kaynak localStorage (cihaza özel) — WatchPage her bölüm açılışında
 * `recordLastWatched` ile yazar. Hydration bitene kadar hiçbir şey render
 * edilmez, böylece layout shift olmaz.
 */
export default function ResumeBar({ compact = false, className = '' }: Props) {
  const { lastWatched, hydrated, clear } = useLastWatched()

  if (!hydrated || !lastWatched) return null

  const progress =
    lastWatched.episodeCount > 0
      ? Math.round((lastWatched.episodeNumber / lastWatched.episodeCount) * 100)
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`bento-card group relative flex items-center gap-3 overflow-hidden ${
        compact ? 'p-3' : 'p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* Kapak */}
      <Link
        href={`/arcs/${lastWatched.arcSlug}/${lastWatched.episodeSlug}`}
        className="relative flex-shrink-0 overflow-hidden rounded-lg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <Image
          src={lastWatched.cover}
          alt=""
          width={112}
          height={72}
          sizes="112px"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            compact ? 'h-12 w-[72px]' : 'h-14 w-[88px]'
          }`}
        />
        {/* Görsel üstü okunabilirlik scrim'i — iki temada da koyu kalır */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45">
          <Play className="h-4 w-4 fill-gold text-gold drop-shadow" />
        </span>
      </Link>

      {/* Metin */}
      <div className="min-w-0 flex-1">
        <p className="eyebrow flex items-center gap-1.5 text-gold/70">
          <TimerReset className="h-3 w-3" />
          Kaldığın Yerden
        </p>
        <Link
          href={`/arcs/${lastWatched.arcSlug}/${lastWatched.episodeSlug}`}
          className="block truncate text-[13px] font-bold text-pirate-text transition-colors hover:text-gold sm:text-sm"
        >
          {lastWatched.episodeTitle}
        </Link>
        <p className="truncate font-mono text-[10px] text-pirate-muted">
          {lastWatched.arcName} · {lastWatched.episodeNumber}/{lastWatched.episodeCount} ·{' '}
          {getTimeAgo(new Date(lastWatched.at).toISOString())}
        </p>
        {/* Arc içi konum */}
        <div className="progress-bar mt-1.5 !h-[3px] max-w-[14rem]">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Aksiyonlar */}
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <Link
          href={`/arcs/${lastWatched.arcSlug}/${lastWatched.episodeSlug}`}
          className="btn-gold !rounded-lg !px-3 !py-1.5 text-[11px]"
        >
          <Play className="h-3 w-3" />
          <span className="hidden sm:inline">Devam Et</span>
        </Link>
        <button
          onClick={clear}
          aria-label="Devam etme kaydını temizle"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-pirate-border/60 text-pirate-muted transition-colors hover:border-luffy/30 hover:text-luffy"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

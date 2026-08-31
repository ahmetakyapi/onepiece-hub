'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, BookOpen, CalendarClock, Radio, Tv } from 'lucide-react'
import { EASE } from '@/lib/variants'
import {
  SERIES_STATUS, STATUS_AS_OF, WATCHABLE_THROUGH,
  getDaysUntil, getStatusFreshness, type SeriesTrack,
} from '@/lib/constants/series-status'

type TrackMeta = {
  track: SeriesTrack
  icon: typeof Tv
  accent: string
  ring: string
  glow: string
  href?: string
  cta?: string
}

const TRACK_META: readonly TrackMeta[] = [
  {
    track: SERIES_STATUS.onePace,
    icon: Radio,
    accent: 'text-gold',
    ring: 'border-gold/25',
    glow: 'bg-gold/[0.07]',
    href: '/arcs',
    cta: 'İzlemeye başla',
  },
  {
    track: SERIES_STATUS.anime,
    icon: Tv,
    accent: 'text-sea',
    ring: 'border-sea/25',
    glow: 'bg-sea/[0.07]',
  },
  {
    track: SERIES_STATUS.manga,
    icon: BookOpen,
    accent: 'text-luffy',
    ring: 'border-luffy/25',
    glow: 'bg-luffy/[0.07]',
  },
]

const STATUS_LABEL: Record<SeriesTrack['status'], string> = {
  ongoing: 'Devam ediyor',
  break: 'Arada',
  'caught-up': 'Güncel',
}

function NextRelease({ track }: { track: SeriesTrack }) {
  const days = getDaysUntil(track.nextReleaseISO)
  if (!track.next || days === null) return null

  return (
    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-pirate-muted">
      <CalendarClock className="h-3 w-3 flex-shrink-0 opacity-70" />
      <span className="font-mono font-semibold text-pirate-text/80">{track.next}</span>
      <span className="opacity-70">
        {days === 0 ? 'bugün' : days === 1 ? 'yarın' : `${days} gün sonra`}
      </span>
    </p>
  )
}

/**
 * Serinin canlı durumu — One Pace / Anime / Manga.
 *
 * Veri `lib/constants/series-status.ts`'den gelir ve elle güncellenir;
 * bileşen "son güncelleme" etiketini gösterdiği için veri eskirse bunu
 * kullanıcıya dürüstçe belli eder.
 */
export default function SeriesStatus() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative z-10 px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* ── Başlık ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="eyebrow-lg mb-2 flex items-center gap-2 text-gold/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-gold/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              Seri durumu
            </p>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              <span className="text-pirate-text">Şu an </span>
              <span className="text-gold-gradient">{SERIES_STATUS.currentArcName}</span>
            </h2>
            <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-pirate-muted sm:text-sm">
              Manga, anime ve One Pace üç farklı hızda ilerliyor. Nerede olduğunu
              buradan takip et. Sitedeki bölümler{' '}
              <Link
                href={`/arcs/${WATCHABLE_THROUGH.arcSlug}`}
                className="font-semibold text-pirate-text underline decoration-gold/40 decoration-dotted underline-offset-2 transition-colors hover:text-gold"
              >
                {WATCHABLE_THROUGH.arcName}
              </Link>{' '}
              arc&apos;ına kadar izlenebilir.
            </p>
          </div>

          <time
            dateTime={STATUS_AS_OF}
            className="chip !cursor-default flex-shrink-0 self-start !py-1.5 !font-mono !text-[10px] !font-semibold sm:self-auto"
          >
            <CalendarClock className="h-3 w-3 text-gold" />
            {getStatusFreshness()}
          </time>
        </motion.div>

        {/* ── Şeritler ───────────────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
          {TRACK_META.map((item, i) => {
            const { track } = item
            return (
              <motion.div
                key={track.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.09 }}
                className={`bento-card relative overflow-hidden p-5 ${item.ring}`}
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${item.glow} blur-[50px]`}
                  aria-hidden="true"
                />

                <div className="relative mb-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <item.icon className={`h-4 w-4 ${item.accent}`} />
                    <span className="eyebrow-lg text-pirate-muted">
                      {track.label}
                    </span>
                  </span>
                  <span
                    className={`eyebrow rounded-full border px-2 py-0.5 ${
                      track.status === 'ongoing'
                        ? 'border-haki/25 bg-haki/10 text-haki'
                        : track.status === 'break'
                          ? 'border-gold/25 bg-gold/10 text-gold'
                          : 'border-sea/25 bg-sea/10 text-sea'
                    }`}
                  >
                    {STATUS_LABEL[track.status]}
                  </span>
                </div>

                <p className="relative font-mono text-base font-extrabold text-pirate-text sm:text-lg">
                  {track.current}
                </p>
                <p className="relative mt-0.5 text-[11px] text-pirate-muted">{track.context}</p>

                <NextRelease track={track} />

                {track.note && (
                  <p className="relative mt-2 border-t border-pirate-border/30 pt-2 text-[10px] leading-snug text-pirate-muted/70">
                    {track.note}
                  </p>
                )}

                {item.href && (
                  <Link
                    href={item.href}
                    className={`relative mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold ${item.accent} transition-opacity hover:opacity-80`}
                  >
                    {item.cta}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

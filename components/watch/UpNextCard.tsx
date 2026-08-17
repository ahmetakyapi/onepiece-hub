'use client'

import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { EASE } from '@/lib/variants'

type Props = {
  episodeTitle: string
  globalEpisode: number
  /** Kalan saniye — null ise otomatik geçiş kapalı, sadece kart gösterilir */
  countdown: number | null
  countdownTotal: number
  onSkipNow: () => void
  onCancel: () => void
  compact?: boolean
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * "Sıradaki bölüm" kartı — sahnenin sağ altında belirir.
 *
 * Not: iframe cross-origin olduğu için gerçek `ended` olayını dinleyemiyoruz.
 * Kart, bölüm süresine dayanan bir sayaçla açılır ve sekme gizliyken sayaç
 * durur (bkz. WatchPage `useEpisodeTimer`). Bu yüzden "tahmini" bir sinyaldir
 * ve otomatik geçiş varsayılan olarak kapalıdır.
 */
export default function UpNextCard({
  episodeTitle,
  globalEpisode,
  countdown,
  countdownTotal,
  onSkipNow,
  onCancel,
  compact = false,
}: Props) {
  const progress = countdown !== null && countdownTotal > 0 ? 1 - countdown / countdownTotal : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`absolute z-30 ${
        compact ? 'inset-x-2 bottom-2' : 'bottom-4 right-4 w-[min(19rem,calc(100%-2rem))]'
      }`}
    >
      <div className="glass-elevated flex items-center gap-3 rounded-xl p-3">
        {countdown !== null ? (
          <div className="relative h-10 w-10 flex-shrink-0">
            <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle
                cx="20"
                cy="20"
                r={RADIUS}
                className="fill-none stroke-ink/10"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r={RADIUS}
                className="fill-none stroke-gold"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-gold">
              {countdown}
            </span>
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gold/15">
            <Play className="h-4 w-4 text-gold" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="eyebrow text-gold/70">
            {countdown !== null ? 'Sıradaki Bölüm Başlıyor' : 'Sıradaki Bölüm'}
          </p>
          <p className="truncate text-[13px] font-bold text-pirate-text">
            {episodeTitle}
          </p>
          <p className="font-mono text-[10px] text-pirate-muted">Bölüm {globalEpisode}</p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            onClick={onSkipNow}
            className="btn-gold !rounded-lg !px-2.5 !py-1.5 text-[11px]"
          >
            {countdown !== null ? 'Şimdi Geç' : 'İzle'}
          </button>
          <button
            onClick={onCancel}
            aria-label="Sıradaki bölüm kartını kapat"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-pirate-border/60 text-pirate-muted transition-colors hover:border-luffy/30 hover:text-luffy"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

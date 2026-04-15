'use client'

import { motion } from 'framer-motion'
import { BarChart3, Clock, Film, Flame, Trophy, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/variants'
import { ARCS } from '@/lib/constants/arcs'

interface WatchingDashboardProps {
  /** Array of watched episode slugs like "romance-dawn-1" */
  watchedEpisodes: string[]
  /** Dates of watched episodes for heatmap (ISO strings) */
  watchedDates?: string[]
}

/* ─── Stat Card ──────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Film; label: string; value: string | number; color: string
}) {
  return (
    <div className="bento-card rounded-2xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-current/10 to-current/5 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-pirate-muted/50">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-pirate-text stat-number">{value}</p>
    </div>
  )
}

/* ─── Arc progress bar ───────────────────────────────────────────────── */
function ArcProgressBar({ arcName, watched, total, index }: {
  arcName: string; watched: number; total: number; index: number
}) {
  const percent = total > 0 ? (watched / total) * 100 : 0
  const isComplete = percent >= 100

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 truncate text-xs font-medium text-pirate-muted/60 sm:w-40">
        {arcName}
      </span>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-ocean-surface">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: index * 0.05 }}
            className={cn(
              'h-full rounded-full',
              isComplete
                ? 'bg-gradient-to-r from-gold to-gold-bright'
                : 'bg-gradient-to-r from-sea to-sea-light',
            )}
          />
        </div>
      </div>
      <span className={cn(
        'w-12 text-right text-[11px] font-bold stat-number',
        isComplete ? 'text-gold' : 'text-pirate-muted/50',
      )}>
        {watched}/{total}
      </span>
    </div>
  )
}

/* ─── Heatmap (GitHub-style) ─────────────────────────────────────────── */
function WatchingHeatmap({ dates }: { dates: string[] }) {
  const heatmapData = useMemo(() => {
    const counts: Record<string, number> = {}
    dates.forEach((d) => {
      const day = d.slice(0, 10)
      counts[day] = (counts[day] || 0) + 1
    })

    // Generate last 16 weeks (112 days)
    const today = new Date()
    const weeks: Array<Array<{ date: string; count: number }>> = []
    let currentWeek: Array<{ date: string; count: number }> = []

    for (let i = 111; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayOfWeek = d.getDay()

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push({ date: dateStr, count: counts[dateStr] || 0 })
    }
    if (currentWeek.length > 0) weeks.push(currentWeek)

    return weeks
  }, [dates])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-ocean-surface/40'
    if (count === 1) return 'bg-sea/30'
    if (count <= 3) return 'bg-sea/50'
    if (count <= 5) return 'bg-gold/40'
    return 'bg-gold/70'
  }

  return (
    <div className="bento-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-pirate-text">İzleme Aktivitesi</h3>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={cn('h-3 w-3 rounded-[2px] transition-colors', getColor(day.count))}
                  title={`${day.date}: ${day.count} bölüm`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[9px] text-pirate-muted/40">
        <span>Az</span>
        <div className="h-2.5 w-2.5 rounded-[2px] bg-ocean-surface/40" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-sea/30" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-sea/50" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-gold/40" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-gold/70" />
        <span>Çok</span>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */
export default function WatchingDashboard({ watchedEpisodes, watchedDates = [] }: WatchingDashboardProps) {
  const totalWatched = watchedEpisodes.length

  // Calculate arc-level stats
  const arcStats = useMemo(() => {
    return ARCS.map((arc) => {
      const total = arc.episodes.length
      const watched = arc.episodes.filter((ep) =>
        watchedEpisodes.includes(`${arc.slug}-${ep.number}`),
      ).length
      return { name: arc.name, slug: arc.slug, total, watched }
    }).filter((a) => a.total > 0)
  }, [watchedEpisodes])

  const completedArcs = arcStats.filter((a) => a.watched >= a.total).length
  const totalEpisodes = arcStats.reduce((sum, a) => sum + a.total, 0)
  const overallProgress = totalEpisodes > 0 ? Math.round((totalWatched / totalEpisodes) * 100) : 0

  // Estimated watch time (average ~23 min per episode)
  const estimatedMinutes = totalWatched * 23
  const hours = Math.floor(estimatedMinutes / 60)
  const days = Math.floor(hours / 24)

  // Current streak (consecutive days)
  const currentStreak = useMemo(() => {
    if (watchedDates.length === 0) return 0
    const uniqueDays = [...new Set(watchedDates.map((d) => d.slice(0, 10)))].sort().reverse()
    let streak = 0
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0

    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      if (uniqueDays[i] === expected) streak++
      else break
    }
    return streak
  }, [watchedDates])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="space-y-6"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Film} label="İzlenen Bölüm" value={totalWatched} color="text-sea" />
        <StatCard icon={Trophy} label="Tamamlanan Arc" value={completedArcs} color="text-gold" />
        <StatCard icon={Clock} label="Toplam Süre" value={days > 0 ? `${days}g ${hours % 24}s` : `${hours}s`} color="text-sea-light" />
        <StatCard icon={Flame} label="Günlük Seri" value={`${currentStreak} gün`} color="text-luffy" />
      </div>

      {/* Overall progress */}
      <div className="bento-card rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-bold text-pirate-text">Genel İlerleme</h3>
          </div>
          <span className="text-xl font-extrabold text-gold stat-number">{overallProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ocean-surface">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: EASE }}
            className="h-full rounded-full bg-gradient-to-r from-sea via-gold to-luffy"
          />
        </div>
        <p className="mt-2 text-[10px] text-pirate-muted/40">
          {totalWatched} / {totalEpisodes} bölüm izlendi
        </p>
      </div>

      {/* Heatmap */}
      <WatchingHeatmap dates={watchedDates} />

      {/* Arc breakdown */}
      <div className="bento-card rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-sea" />
          <h3 className="text-sm font-bold text-pirate-text">Arc İlerlemesi</h3>
        </div>
        <div className="space-y-2.5">
          {arcStats.slice(0, 15).map((arc, i) => (
            <ArcProgressBar
              key={arc.slug}
              arcName={arc.name}
              watched={arc.watched}
              total={arc.total}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

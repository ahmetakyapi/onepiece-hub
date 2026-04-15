'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  User, Film, Trophy,
  Compass, ArrowRight, Anchor, Play, Clock, LogOut, BrainCircuit,
  Sparkles, Calendar, Heart
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { getTimeAgo } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { ARCS } from '@/lib/constants/arcs'
import WaveSeparator from '@/components/ui/WaveSeparator'
import type { Arc } from '@/types'

const WatchingDashboard = dynamic(() => import('@/components/profile/WatchingDashboard'), { ssr: false })
const AchievementShowcase = dynamic(() => import('@/components/achievements/AchievementShowcase'), { ssr: false })

type ProgressEntry = {
  arcSlug: string
  episodeSlug: string
  watchedAt: string
}

type QuizScoreEntry = {
  arcSlug: string
  score: number
  totalQ: number
  completedAt: string
}

type FavoriteEntry = {
  targetType: string
  targetSlug: string
}

function getArcForEpisode(episodeSlug: string): { arc: Arc; episodeTitle: string; episodeNumber: number } | null {
  for (const arc of ARCS) {
    const ep = arc.episodes.find((e) => e.slug === episodeSlug)
    if (ep) return { arc, episodeTitle: ep.title, episodeNumber: ep.number }
  }
  return null
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [quizScores, setQuizScores] = useState<QuizScoreEntry[]>([])
  const [favs, setFavs] = useState<FavoriteEntry[]>([])
  const [loadingProgress, setLoadingProgress] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/progress')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.progress) {
          setProgress(data.data.progress)
        }
      })
      .finally(() => setLoadingProgress(false))

    fetch('/api/quiz-scores')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.scores) {
          setQuizScores(data.data.scores)
        }
      })

    fetch('/api/favorites')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.favorites) {
          setFavs(data.data.favorites)
        }
      })
  }, [user])

  if (loading) {
    return (
      <main className="relative min-h-screen pb-16">
        <div className="pt-24 pb-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 animate-pulse rounded-2xl bg-ocean-surface" />
              <div className="flex-1 space-y-2">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-ocean-surface" />
                <div className="h-4 w-24 animate-pulse rounded-lg bg-ocean-surface" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bento-card rounded-xl p-5 text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-ocean-surface" />
                <div className="mx-auto h-7 w-12 animate-pulse rounded-lg bg-ocean-surface" />
                <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded bg-ocean-surface" />
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeUp}>
              <Anchor className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="mb-2 text-xl font-bold text-pirate-text">
              Giriş Yapmanız Gerekiyor
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-6 text-sm text-pirate-muted">
              Profilinizi görmek için giriş yapın
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/login" className="btn-gold">Giriş Yap</Link>
            </motion.div>
          </motion.div>
        </main>
    )
  }

  // Calculate stats
  const watchedSlugs = new Set(progress.map((p) => p.episodeSlug))
  const totalWatched = watchedSlugs.size

  const completedArcs = ARCS.filter((arc) =>
    arc.episodes.every((ep) => watchedSlugs.has(ep.slug))
  ).length

  // Group progress by arc for "continue watching"
  const arcProgress = ARCS.map((arc) => {
    const watchedEps = arc.episodes.filter((ep) => watchedSlugs.has(ep.slug))
    if (watchedEps.length === 0) return null

    const nextEp = arc.episodes.find((ep) => !watchedSlugs.has(ep.slug))
    const isComplete = watchedEps.length === arc.episodes.length

    return {
      arc,
      watchedCount: watchedEps.length,
      isComplete,
      nextEpisode: nextEp,
    }
  }).filter(Boolean) as {
    arc: Arc
    watchedCount: number
    isComplete: boolean
    nextEpisode: typeof ARCS[0]['episodes'][0] | undefined
  }[]

  // Recent activity — last 10 watched
  const recentWatched = [...progress]
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    .slice(0, 10)

  const totalHours = Math.round((totalWatched * 24) / 60)

  return (
      <main className="relative min-h-screen pb-16">
        {/* ─── Profile Banner ─────────────────────────────────────── */}
        <div className="relative overflow-hidden pt-24 pb-8">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-sea/[0.08] via-gold/[0.03] to-transparent" />
          <div className="ocean-glow ocean-glow-sea" style={{ width: 500, height: 500, top: -200, right: -200 }} />
          <div className="ocean-glow ocean-glow-gold" style={{ width: 300, height: 300, top: -50, left: -100 }} />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 via-sea/15 to-gold/10 border border-gold/20 shadow-lg shadow-gold/5">
                      <User className="h-9 w-9 text-gold" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-pirate-text sm:text-3xl">
                      {user.name || user.username}
                    </h1>
                    <p className="text-sm text-pirate-muted">@{user.username}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-pirate-muted/50">
                      <Calendar className="h-3 w-3" />
                      Korsan olarak katıldı
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="btn-ghost text-xs sm:text-sm flex-shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          <WaveSeparator variant="subtle" className="mt-4" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Stats grid */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: 'İzlenen Bölüm', value: totalWatched.toString(), icon: Film, color: 'text-sea', bg: 'from-sea/10 to-sea/5' },
              { label: 'Tamamlanan Arc', value: completedArcs.toString(), icon: Compass, color: 'text-gold', bg: 'from-gold/10 to-gold/5' },
              { label: 'Toplam Saat', value: `${totalHours}+`, icon: Clock, color: 'text-emerald-400', bg: 'from-emerald-400/10 to-emerald-400/5' },
              { label: 'Toplam Arc', value: `${arcProgress.length}/${ARCS.length}`, icon: Trophy, color: 'text-luffy', bg: 'from-luffy/10 to-luffy/5' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="bento-card rounded-xl p-5 text-center">
                <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-extrabold text-pirate-text">{stat.value}</p>
                <p className="text-xs text-pirate-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Watching Dashboard */}
          {totalWatched > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-10"
            >
              <WatchingDashboard
                watchedEpisodes={[...watchedSlugs]}
                watchedDates={progress.map((p) => p.watchedAt)}
              />
            </motion.section>
          )}

          {/* Continue watching */}
          {arcProgress.filter((a) => !a.isComplete && a.nextEpisode).length > 0 && (
            <motion.section
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Play className="h-5 w-5 text-gold" />
                Kaldığın Yerden Devam Et
              </h2>
              <div className="space-y-2">
                {arcProgress
                  .filter((a) => !a.isComplete && a.nextEpisode)
                  .map(({ arc, watchedCount, nextEpisode }) => (
                    <motion.div key={arc.slug} variants={fadeUp}>
                      <Link
                        href={`/arcs/${arc.slug}/${nextEpisode!.slug}`}
                        className="bento-card group flex items-center gap-4 px-4 py-3 transition-all duration-500 hover:border-gold/15"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                          <Play className="h-4 w-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-pirate-text group-hover:text-gold transition-colors">
                            {arc.name}
                          </p>
                          <p className="text-xs text-pirate-muted">
                            Sonraki: {nextEpisode!.title} — {watchedCount}/{arc.episodeCount} izlendi
                          </p>
                        </div>
                        {/* Progress */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ocean-surface">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright"
                              style={{ width: `${(watchedCount / arc.episodeCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-pirate-muted">{Math.round((watchedCount / arc.episodeCount) * 100)}%</span>
                        </div>
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-pirate-muted group-hover:text-gold transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Completed arcs */}
          {arcProgress.filter((a) => a.isComplete).length > 0 && (
            <motion.section
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Trophy className="h-5 w-5 text-emerald-400" />
                Tamamlanan Arc&apos;lar
              </h2>
              <div className="flex flex-wrap gap-2">
                {arcProgress
                  .filter((a) => a.isComplete)
                  .map(({ arc }) => (
                    <Link
                      key={arc.slug}
                      href={`/arcs/${arc.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/10"
                    >
                      <Compass className="h-3 w-3" />
                      {arc.name}
                    </Link>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Quiz Scores */}
          {quizScores.length > 0 && (
            <motion.section
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
                Quiz Skorları
                <span className="ml-1 rounded-full bg-purple-500/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-purple-400/70">
                  {quizScores.length} tamamlandı
                </span>
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {quizScores
                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                  .map((entry) => {
                    const arc = ARCS.find((a) => a.slug === entry.arcSlug)
                    const pct = Math.round((entry.score / entry.totalQ) * 100)
                    const isGood = pct >= 80
                    return (
                      <motion.div key={entry.arcSlug} variants={fadeUp}>
                        <Link
                          href={`/quiz/${entry.arcSlug}`}
                          className="bento-card group flex items-center gap-3 px-4 py-3"
                        >
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${
                            isGood ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gold/10 border-gold/20'
                          }`}>
                            <BrainCircuit className={`h-4 w-4 ${isGood ? 'text-emerald-400' : 'text-gold'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-pirate-text group-hover:text-gold transition-colors truncate">
                              {arc?.name ?? entry.arcSlug}
                            </p>
                            <p className="text-xs text-pirate-muted">
                              {entry.score}/{entry.totalQ} doğru
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold/10 text-gold'
                          }`}>
                            %{pct}
                          </span>
                        </Link>
                      </motion.div>
                    )
                  })}
              </div>
            </motion.section>
          )}

          {/* Favorites */}
          {favs.length > 0 && (
            <motion.section
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
                <Heart className="h-5 w-5 text-luffy" />
                Favoriler
                <span className="ml-1 rounded-full bg-luffy/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-luffy/70">
                  {favs.length}
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {favs.map((fav) => {
                  const arc = fav.targetType === 'arc' ? ARCS.find((a) => a.slug === fav.targetSlug) : null
                  const label = arc?.name ?? fav.targetSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  const href = `/${fav.targetType === 'devil-fruit' ? 'devil-fruits' : fav.targetType + 's'}/${fav.targetSlug}`
                  return (
                    <Link
                      key={`${fav.targetType}-${fav.targetSlug}`}
                      href={href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-luffy/15 bg-luffy/5 px-3 py-1.5 text-xs font-medium text-pirate-text transition-all hover:bg-luffy/10 hover:border-luffy/25"
                    >
                      <Heart className="h-3 w-3 text-luffy fill-luffy" />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* Achievements */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-10"
          >
            <AchievementShowcase
              stats={{
                totalWatched,
                totalArcsCompleted: completedArcs,
                quizzesTaken: quizScores.length,
                perfectQuizzes: quizScores.filter((q) => q.score === q.totalQ).length,
                totalQuizScore: quizScores.reduce((sum, q) => sum + q.score, 0),
                favoritesCount: favs.length,
                commentsCount: 0,
              }}
            />
          </motion.section>

          {/* Recent activity */}
          <motion.section
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Film className="h-5 w-5 text-sea" />
              Son İzlenenler
            </h2>
            {recentWatched.length === 0 ? (
              <div className="bento-card rounded-xl p-8 text-center">
                <Compass className="mx-auto mb-3 h-8 w-8 text-pirate-muted" />
                <p className="mb-4 text-sm text-pirate-muted">Henüz izleme geçmişin yok</p>
                <Link href="/arcs" className="btn-ghost text-sm">
                  İzlemeye Başla
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentWatched.map((entry) => {
                  const info = getArcForEpisode(entry.episodeSlug)
                  if (!info) return null
                  const timeAgo = getTimeAgo(entry.watchedAt)
                  return (
                    <motion.div key={entry.episodeSlug} variants={fadeUp}>
                      <Link
                        href={`/arcs/${info.arc.slug}/${entry.episodeSlug}`}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sea/5"
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sea/10 text-xs font-bold text-sea">
                          {info.episodeNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-pirate-text group-hover:text-gold transition-colors">
                            {info.episodeTitle}
                          </p>
                          <p className="text-xs text-pirate-muted">{info.arc.name}</p>
                        </div>
                        <span className="text-xs text-pirate-muted/60 flex-shrink-0">{timeAgo}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.section>
        </div>
      </main>
  )
}


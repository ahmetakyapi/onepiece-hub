'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  User, Film, Trophy,
  Compass, ArrowRight, Anchor, Play, Clock, LogOut
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { useAuth } from '@/hooks/useAuth'
import { ARCS } from '@/lib/constants/arcs'
import type { Arc } from '@/types'

type ProgressEntry = {
  arcSlug: string
  episodeSlug: string
  watchedAt: string
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
  }, [user])

  if (loading) return null

  if (!user) {
    return (
      <>
        <Header />
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
      </>
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
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Profile header */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-sea/20 border border-gold/20">
                  <User className="h-8 w-8 text-gold" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-pirate-text">
                    {user.name || user.username}
                  </h1>
                  <p className="text-sm text-pirate-muted">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn-ghost text-xs sm:text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: 'İzlenen Bölüm', value: totalWatched.toString(), icon: Film, color: 'text-sea' },
              { label: 'Tamamlanan Arc', value: completedArcs.toString(), icon: Compass, color: 'text-gold' },
              { label: 'Toplam Saat', value: `${totalHours}+`, icon: Clock, color: 'text-emerald-400' },
              { label: 'Toplam Arc', value: `${arcProgress.length}/${ARCS.length}`, icon: Trophy, color: 'text-luffy' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="glass rounded-xl p-4 text-center">
                <stat.icon className={`mx-auto mb-2 h-5 w-5 ${stat.color}`} />
                <p className="text-2xl font-extrabold text-pirate-text">{stat.value}</p>
                <p className="text-xs text-pirate-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

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
                        className="glass glass-lift group flex items-center gap-4 rounded-xl px-4 py-3 hover:border-gold/30"
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
              <div className="glass rounded-xl p-8 text-center">
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
      <Footer />
    </>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce`
  return `${Math.floor(days / 7)} hafta önce`
}

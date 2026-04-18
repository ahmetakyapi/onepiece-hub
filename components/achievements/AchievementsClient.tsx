'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWatchedEpisodes } from '@/hooks/useWatchedEpisodes'
import { ARCS } from '@/lib/constants/arcs'
import { fadeUp, EASE } from '@/lib/variants'
import AchievementShowcase from './AchievementShowcase'

function getLocalFavorites(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem('onepiece-favorites')
    return raw ? JSON.parse(raw).length : 0
  } catch { return 0 }
}

function getLocalQuizScores(): Array<{ score: number; totalQ: number }> {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('onepiece-quiz-scores')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export default function AchievementsClient() {
  const { user, loading } = useAuth()
  const { watched } = useWatchedEpisodes()

  const stats = useMemo(() => {
    const watchedSlugs = Array.from(watched)
    // Group by arc to compute completed arcs
    let completedArcs = 0
    for (const arc of ARCS) {
      const arcEpisodeSlugs = new Set(arc.episodes.map(e => e.slug))
      let completed = 0
      for (const slug of watchedSlugs) if (arcEpisodeSlugs.has(slug)) completed++
      if (completed > 0 && completed === arc.episodes.length) completedArcs++
    }

    const quizScores = getLocalQuizScores()
    const perfectQuizzes = quizScores.filter(q => q.score === q.totalQ).length
    const totalQuizScore = quizScores.reduce((sum, q) => sum + q.score, 0)

    return {
      totalWatched: watched.size,
      totalArcsCompleted: completedArcs,
      quizzesTaken: quizScores.length,
      perfectQuizzes,
      totalQuizScore,
      favoritesCount: getLocalFavorites(),
      commentsCount: 0,
    }
  }, [watched])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Login hint for anonymous users */}
      {!user && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: EASE }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] via-ocean-surface/40 to-ocean-deep p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/[0.1] blur-[60px]" />

          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-sm font-bold text-pirate-text sm:text-base">
                Giriş yap, başarımların senkronlansın
              </p>
              <p className="text-xs text-pirate-muted sm:text-sm">
                Şu an yerel olarak takip ediyorsun. Giriş yaparsan cihazlar arası senkronizasyon aktif olur.
              </p>
            </div>
            <Link href="/login" className="btn-gold !py-2 text-xs flex-shrink-0">
              <LogIn className="h-3.5 w-3.5" />
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      )}

      <AchievementShowcase stats={stats} />
    </div>
  )
}

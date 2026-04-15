'use client'

import { motion } from 'framer-motion'
import { Award, Lock } from 'lucide-react'
import { ACHIEVEMENTS, TIER_CONFIG, type UserStats } from '@/lib/constants/achievements'
import AchievementCard from './AchievementCard'
import { EASE } from '@/lib/variants'

interface AchievementShowcaseProps {
  stats: UserStats
}

const CATEGORY_LABELS: Record<string, string> = {
  watching: 'İzleme',
  quiz: 'Quiz',
  exploration: 'Keşif',
  social: 'Sosyal',
}

export default function AchievementShowcase({ stats }: AchievementShowcaseProps) {
  const unlocked = ACHIEVEMENTS.filter((a) => a.check(stats))
  const locked = ACHIEVEMENTS.filter((a) => !a.check(stats))
  const total = ACHIEVEMENTS.length
  const progress = (unlocked.length / total) * 100

  // Group by category
  const categories = Object.entries(
    ACHIEVEMENTS.reduce<Record<string, typeof ACHIEVEMENTS>>((acc, a) => {
      if (!acc[a.category]) acc[a.category] = []
      acc[a.category].push(a)
      return acc
    }, {}),
  )

  return (
    <div className="space-y-8">
      {/* Summary header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="bento-card overflow-hidden rounded-2xl p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10">
            <Award className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-pirate-text">Başarımlar</h3>
            <p className="text-xs text-pirate-muted">
              {unlocked.length}/{total} tamamlandı
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-extrabold text-gold stat-number">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-ocean-surface">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-sea via-gold to-luffy"
          />
        </div>

        {/* Tier summary */}
        <div className="mt-4 flex flex-wrap gap-3">
          {(['bronze', 'silver', 'gold', 'legendary'] as const).map((tier) => {
            const tierAchievements = unlocked.filter((a) => a.tier === tier)
            const config = TIER_CONFIG[tier]
            return (
              <div key={tier} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${config.bg}`}>
                <span className={`text-xs font-bold ${config.color}`}>{tierAchievements.length}</span>
                <span className="text-[10px] text-pirate-muted">{config.label}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Categories */}
      {categories.map(([category, achievements]) => (
        <div key={category}>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-pirate-text">
            {CATEGORY_LABELS[category] ?? category}
            <span className="text-[10px] font-semibold text-pirate-muted/40">
              {achievements.filter((a) => a.check(stats)).length}/{achievements.length}
            </span>
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {achievements.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.check(stats)}
                index={i}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

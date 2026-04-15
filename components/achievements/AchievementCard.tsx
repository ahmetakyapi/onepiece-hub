'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TIER_CONFIG, type Achievement } from '@/lib/constants/achievements'
import { EASE } from '@/lib/variants'

interface AchievementCardProps {
  achievement: Achievement
  unlocked: boolean
  index?: number
}

export default function AchievementCard({ achievement, unlocked, index = 0 }: AchievementCardProps) {
  const tier = TIER_CONFIG[achievement.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: EASE, delay: index * 0.05 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-4 transition-all duration-500',
        unlocked
          ? `bento-card ${tier.border} ${tier.glow}`
          : 'border-pirate-border/10 bg-ocean-surface/20 opacity-50 grayscale',
      )}
    >
      {/* Unlocked glow */}
      {unlocked && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-current opacity-[0.03] blur-[30px]" />
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={cn(
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-300',
          unlocked ? `${tier.bg} group-hover:scale-110` : 'bg-ocean-surface/40',
        )}>
          {unlocked ? achievement.icon : '🔒'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn(
              'text-sm font-bold truncate',
              unlocked ? 'text-pirate-text' : 'text-pirate-muted/50',
            )}>
              {achievement.name}
            </p>
            {unlocked && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase', tier.bg, tier.color)}>
                {tier.label}
              </span>
            )}
          </div>
          <p className="text-xs text-pirate-muted/60 truncate">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

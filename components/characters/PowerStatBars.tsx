'use client'

import { memo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { POWER_LEVELS, STAT_LABELS } from '@/lib/constants/power-levels'
import { EASE } from '@/lib/variants'

interface Props {
  slug: string
}

function PowerStatBars({ slug }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const powerStats = POWER_LEVELS.find(p => p.slug === slug)
  if (!powerStats) return null

  return (
    <div ref={ref} className="space-y-5">
      {/* Overall Score */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sea/70 mb-1">
            Genel Güç
          </p>
          <div className="text-5xl font-extrabold text-gold stat-number drop-shadow-[0_2px_8px_rgba(244,163,0,0.3)]">
            {powerStats.overall}
          </div>
        </div>
        <div className="h-32 flex flex-col items-end justify-end">
          <div className="text-xs text-pirate-muted/60 mb-2">skala: 0-100</div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-2 rounded-sm transition-colors ${
                  (powerStats.overall / 20) > i ? 'bg-gold' : 'bg-ocean-surface/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stat Bars */}
      <div className="space-y-3 pt-4 border-t border-pirate-border/20">
        {Object.entries(powerStats.stats).map(([key, value]) => {
          const label = STAT_LABELS[key]
          const isZero = value === 0

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-pirate-text group-hover:text-gold transition-colors">
                  {label.label}
                </p>
                <p className={`text-xs font-bold tabular-nums ${
                  isZero ? 'text-pirate-muted/40' : 'text-gold'
                }`}>
                  {value}
                </p>
              </div>

              <div className="relative h-2.5 rounded-full bg-ocean-surface/40 border border-pirate-border/20 overflow-hidden">
                {!isZero && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: label.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${value}%` } : { width: 0 }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(PowerStatBars)

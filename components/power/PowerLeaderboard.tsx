'use client'

import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Medal, Sparkles } from 'lucide-react'
import { POWER_LEVELS, STAT_LABELS } from '@/lib/constants/power-levels'
import { CHARACTERS } from '@/lib/constants/characters'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

type SortMode = 'overall' | 'strength' | 'speed' | 'haki' | 'devilFruit' | 'intelligence' | 'endurance'

const SORT_OPTIONS: { mode: SortMode; label: string; stat?: string }[] = [
  { mode: 'overall', label: 'Genel Güç' },
  { mode: 'strength', label: 'En Güçlü' },
  { mode: 'speed', label: 'En Hızlı' },
  { mode: 'haki', label: 'En Hakilı' },
  { mode: 'devilFruit', label: 'En Meyvelı' },
  { mode: 'intelligence', label: 'En Zeki' },
  { mode: 'endurance', label: 'En Dayanıklı' },
]

interface TieredCharacter {
  slug: string
  name: string
  overall: number
  stat?: number
  image?: string
  tier: 'yonko' | 'admiral' | 'supernova' | 'rookie'
}

const getTier = (overall: number): TieredCharacter['tier'] => {
  if (overall >= 92) return 'yonko'
  if (overall >= 80) return 'admiral'
  if (overall >= 65) return 'supernova'
  return 'rookie'
}

const TierConfig: Record<TieredCharacter['tier'], { label: string; color: string; icon: typeof Crown; minScore: number }> = {
  yonko: { label: 'Yonko Seviyesi', color: 'from-gold/40 to-gold/20 border-gold/30', icon: Crown, minScore: 92 },
  admiral: { label: 'Komutan Seviyesi', color: 'from-sea/40 to-sea/20 border-sea/30', icon: Medal, minScore: 80 },
  supernova: { label: 'Supernova Seviyesi', color: 'from-purple-500/40 to-purple-400/20 border-purple-500/30', icon: Sparkles, minScore: 65 },
  rookie: { label: 'Acemi Seviyesi', color: 'from-pirate-muted/40 to-pirate-muted/20 border-pirate-muted/30', icon: Sparkles, minScore: 0 },
}

function PowerLeaderboard() {
  const [sortMode, setSortMode] = useState<SortMode>('overall')

  const sorted = useMemo(() => {
    return POWER_LEVELS.map(stats => {
      const character = CHARACTERS.find(c => c.slug === stats.slug)
      const name = character?.name || '?'
      const image = character ? getCharacterImage(character.slug) : undefined

      const stat = sortMode === 'overall' ? stats.overall : stats.stats[sortMode as keyof typeof stats.stats]

      return {
        slug: stats.slug,
        name,
        overall: stats.overall,
        stat,
        image,
        tier: getTier(stats.overall),
      } as TieredCharacter
    }).sort((a, b) => (b.stat ?? 0) - (a.stat ?? 0))
  }, [sortMode])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)
  const grouped = rest.reduce((acc, char) => {
    const tierKey = char.tier
    if (!acc[tierKey]) acc[tierKey] = []
    acc[tierKey].push(char)
    return acc
  }, {} as Record<TieredCharacter['tier'], TieredCharacter[]>)

  return (
    <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible" className="space-y-10">
      {/* Sort Controls */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map(option => (
          <button
            key={option.mode}
            onClick={() => setSortMode(option.mode)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              sortMode === option.mode
                ? 'bg-gold text-ocean-deep shadow-lg'
                : 'border border-pirate-border/30 bg-ocean-surface/50 text-pirate-text hover:border-gold/50 hover:bg-ocean-surface'
            }`}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {/* Podium — Top 3 */}
      <motion.div variants={fadeUp}>
        <h2 className="mb-6 text-2xl font-bold text-gold drop-shadow-[0_2px_8px_rgba(244,163,0,0.2)]">
          🏆 Zirve
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {top3.map((char, idx) => {
            const medals = ['🥇', '🥈', '🥉']
            return (
              <motion.div
                key={char.slug}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] via-ocean-surface/40 to-ocean-deep p-5 transition-all duration-300 hover:border-gold/40"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/[0.08] blur-[40px]" />

                {char.image && (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl border border-gold/20">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover object-top"
                      sizes="200px"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="mb-2 text-center text-4xl">{medals[idx]}</div>
                  <p className="mb-1 text-center text-xs font-bold uppercase tracking-wider text-gold/70">
                    #{idx + 1}
                  </p>
                  <p className="mb-3 text-center text-lg font-bold text-pirate-text group-hover:text-gold transition-colors">
                    {char.name}
                  </p>
                  <div className="mb-4 h-1 w-full rounded-full bg-ocean-surface/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-amber-400"
                      style={{ width: `${(char.stat ?? 0) / 100 * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-2xl font-extrabold text-gold stat-number">
                    {char.stat}
                  </p>
                  <Link
                    href={`/characters/${char.slug}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gold/10 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold/20"
                  >
                    Profili Gör
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Tier Sections */}
      {(['yonko', 'admiral', 'supernova', 'rookie'] as const).map(tierKey => {
        const chars = grouped[tierKey] || []
        if (chars.length === 0) return null

        const config = TierConfig[tierKey]
        const TierIcon = config.icon

        return (
          <motion.div key={tierKey} variants={fadeUp}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${config.color} border`}>
                <TierIcon className="h-4 w-4 text-gold" />
              </div>
              <h3 className={`text-lg font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                {config.label}
              </h3>
              <span className="ml-auto text-xs font-semibold text-pirate-muted/60">
                {chars.length} karakter
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chars.map((char, idx) => (
                <Link
                  key={char.slug}
                  href={`/characters/${char.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-pirate-border/20 bg-ocean-surface/30 p-4 transition-all duration-300 hover:border-gold/30 hover:bg-ocean-surface/60"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gold/[0.05] blur-[30px] group-hover:bg-gold/[0.1]" />

                  <div className="relative flex items-center gap-3">
                    {char.image && (
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-pirate-border/30">
                        <Image
                          src={char.image}
                          alt={char.name}
                          fill
                          className="object-cover object-top"
                          sizes="48px"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-pirate-text group-hover:text-gold transition-colors">
                        {char.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-ocean-deep/50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                            style={{ width: `${(char.stat ?? 0) / 100 * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gold tabular-nums">
                          {char.stat}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-pirate-muted/30 transition-all group-hover:translate-x-1 group-hover:text-gold" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default memo(PowerLeaderboard)

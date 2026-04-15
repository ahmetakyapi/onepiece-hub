'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Crown, Swords, Zap, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/variants'
import { CHARACTERS } from '@/lib/constants/characters'
import { POWER_LEVELS, STAT_LABELS, type PowerStats } from '@/lib/constants/power-levels'
import { getCharacterImage } from '@/lib/constants/images'

/* ─── Radar Chart (SVG) ──────────────────────────────────────────────── */
function RadarChart({ stats, color = '#f4a300', size = 200 }: {
  stats: PowerStats['stats']
  color?: string
  size?: number
}) {
  const statKeys = Object.keys(STAT_LABELS) as (keyof typeof stats)[]
  const center = size / 2
  const radius = size * 0.38
  const levels = 5

  // Generate polygon points for each level
  const getPoint = (index: number, value: number) => {
    const angle = (2 * Math.PI * index) / statKeys.length - Math.PI / 2
    const r = (value / 100) * radius
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) }
  }

  const dataPoints = statKeys.map((key, i) => getPoint(i, stats[key]))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grid levels */}
      {Array.from({ length: levels }).map((_, level) => {
        const levelPoints = statKeys.map((_, i) => getPoint(i, ((level + 1) / levels) * 100))
        const path = levelPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="rgba(30,144,255,0.08)"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Axis lines */}
      {statKeys.map((_, i) => {
        const endPoint = getPoint(i, 100)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="rgba(30,144,255,0.06)"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Data polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        d={dataPath}
        fill={`${color}15`}
        stroke={color}
        strokeWidth="1.5"
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}

      {/* Labels */}
      {statKeys.map((key, i) => {
        const labelPoint = getPoint(i, 120)
        const config = STAT_LABELS[key]
        return (
          <text
            key={key}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={config.color}
            fontSize="9"
            fontWeight="600"
          >
            {config.label}
          </text>
        )
      })}
    </svg>
  )
}

/* ─── Comparison View ────────────────────────────────────────────────── */
function ComparisonView({ char1, char2 }: { char1: PowerStats; char2: PowerStats }) {
  const c1 = CHARACTERS.find((c) => c.slug === char1.slug)
  const c2 = CHARACTERS.find((c) => c.slug === char2.slug)
  const statKeys = Object.keys(STAT_LABELS) as (keyof PowerStats['stats'])[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="bento-card rounded-2xl p-6"
    >
      {/* Headers */}
      <div className="mb-6 grid grid-cols-3 items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-bold text-pirate-text">{c1?.name}</p>
          <p className="text-2xl font-extrabold text-sea stat-number">{char1.overall}</p>
        </div>
        <div className="flex items-center justify-center">
          <Swords className="h-5 w-5 text-gold" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-pirate-text">{c2?.name}</p>
          <p className="text-2xl font-extrabold text-luffy stat-number">{char2.overall}</p>
        </div>
      </div>

      {/* Stat bars */}
      <div className="space-y-3">
        {statKeys.map((key) => {
          const v1 = char1.stats[key]
          const v2 = char2.stats[key]
          const config = STAT_LABELS[key]
          const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0

          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className={cn('font-bold', winner === 1 ? 'text-sea' : 'text-pirate-muted/50')}>{v1}</span>
                <span className="font-semibold" style={{ color: config.color }}>{config.label}</span>
                <span className={cn('font-bold', winner === 2 ? 'text-luffy' : 'text-pirate-muted/50')}>{v2}</span>
              </div>
              <div className="flex gap-1">
                {/* Left bar (char1) */}
                <div className="flex h-2 flex-1 justify-end overflow-hidden rounded-full bg-ocean-surface">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v1}%` }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                    className="h-full rounded-full bg-sea"
                  />
                </div>
                {/* Right bar (char2) */}
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-ocean-surface">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v2}%` }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                    className="h-full rounded-full bg-luffy"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function PowerRankingClient() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null)
  const [compareChar, setCompareChar] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)

  const sorted = useMemo(
    () => [...POWER_LEVELS].sort((a, b) => b.overall - a.overall),
    [],
  )

  const selectedPower = POWER_LEVELS.find((p) => p.slug === selectedChar)
  const comparePower = POWER_LEVELS.find((p) => p.slug === compareChar)

  return (
    <main className="relative min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 text-center"
        >
          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            <span className="text-gold-gradient">Güç Sıralaması</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm text-pirate-muted">
            Karakterlerin güç seviyelerini karşılaştır. Bir karaktere tıkla, ardından karşılaştırmak istediğin karakteri seç.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Ranking List */}
          <div className="lg:col-span-3 space-y-2">
            {sorted.map((power, i) => {
              const char = CHARACTERS.find((c) => c.slug === power.slug)
              if (!char) return null
              const isSelected = selectedChar === power.slug
              const isCompare = compareChar === power.slug
              const imgSrc = getCharacterImage(power.slug)

              return (
                <motion.button
                  key={power.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.03 }}
                  onClick={() => {
                    if (showCompare && selectedChar && selectedChar !== power.slug) {
                      setCompareChar(power.slug)
                    } else {
                      setSelectedChar(power.slug)
                      setCompareChar(null)
                    }
                  }}
                  className={cn(
                    'group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-300',
                    isSelected
                      ? 'border-gold/30 bg-gold/[0.06]'
                      : isCompare
                      ? 'border-luffy/30 bg-luffy/[0.06]'
                      : 'bento-card',
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-extrabold',
                    i === 0 ? 'bg-gold/15 text-gold' : i < 3 ? 'bg-sea/10 text-sea' : 'bg-ocean-surface text-pirate-muted/50',
                  )}>
                    {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-ocean-surface">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={char.name} fill className="object-cover object-top" sizes="40px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-pirate-muted/30">
                        {char.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name + epithet */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-pirate-text group-hover:text-gold transition-colors truncate">
                      {char.name}
                    </p>
                    {char.epithet && (
                      <p className="text-[10px] text-pirate-muted/40 truncate">{char.epithet}</p>
                    )}
                  </div>

                  {/* Power bar */}
                  <div className="hidden w-24 sm:block">
                    <div className="h-1.5 overflow-hidden rounded-full bg-ocean-surface">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${power.overall}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.03 }}
                        className="h-full rounded-full bg-gradient-to-r from-sea via-gold to-luffy"
                      />
                    </div>
                  </div>

                  {/* Overall score */}
                  <span className="w-10 text-right text-lg font-extrabold text-gold stat-number">
                    {power.overall}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Detail / Compare Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compare toggle */}
            <button
              onClick={() => { setShowCompare(!showCompare); setCompareChar(null) }}
              className={cn(
                'btn-ghost w-full gap-2',
                showCompare && 'border-gold/30 bg-gold/10 text-gold',
              )}
            >
              <BarChart3 className="h-4 w-4" />
              {showCompare ? 'Karşılaştırma Modu Aktif' : 'Karşılaştır'}
            </button>

            {/* Radar chart */}
            {selectedPower && !comparePower && (
              <motion.div
                key={selectedPower.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bento-card rounded-2xl p-4"
              >
                <h3 className="mb-2 text-center text-sm font-bold text-pirate-text">
                  {CHARACTERS.find((c) => c.slug === selectedPower.slug)?.name}
                </h3>
                <RadarChart stats={selectedPower.stats} />
              </motion.div>
            )}

            {/* Comparison view */}
            {selectedPower && comparePower && (
              <ComparisonView char1={selectedPower} char2={comparePower} />
            )}

            {!selectedChar && (
              <div className="bento-card flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
                <Zap className="mb-3 h-8 w-8 text-pirate-muted/20" />
                <p className="text-sm text-pirate-muted/40">
                  Bir karakter seç
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

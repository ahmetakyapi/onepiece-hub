'use client'

import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Swords, Shuffle, Trophy, ArrowRight, Zap, Skull,
  Flame, Shield, Sparkles,
} from 'lucide-react'
import { CHARACTERS } from '@/lib/constants/characters'
import { POWER_LEVELS, STAT_LABELS } from '@/lib/constants/power-levels'
import { EASE } from '@/lib/variants'
import type { Character } from '@/types'
import CharacterPicker from '@/components/vs/CharacterPicker'

function parseBounty(b?: string): number {
  if (!b) return 0
  const digits = b.replace(/[^0-9]/g, '')
  return digits ? parseInt(digits, 10) : 0
}

function formatBerry(n: number): string {
  if (n === 0) return '—'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return n.toLocaleString('tr-TR')
}

type ComparisonRow = {
  label: string
  icon: typeof Swords
  leftValue: number | string
  rightValue: number | string
  leftDisplay: string
  rightDisplay: string
  winner: 'left' | 'right' | 'tie'
}

function VersusClient() {
  const [left, setLeft] = useState<Character | null>(null)
  const [right, setRight] = useState<Character | null>(null)

  const leftPower = useMemo(() => left ? POWER_LEVELS.find(p => p.slug === left.slug) : null, [left])
  const rightPower = useMemo(() => right ? POWER_LEVELS.find(p => p.slug === right.slug) : null, [right])

  const bothSelected = left && right

  const rows: ComparisonRow[] = useMemo(() => {
    if (!left || !right) return []

    const lBounty = parseBounty(left.bounty)
    const rBounty = parseBounty(right.bounty)

    const lAbilities = left.abilities.length
    const rAbilities = right.abilities.length

    const lApp = left.appearances?.length || 0
    const rApp = right.appearances?.length || 0

    const r: ComparisonRow[] = [
      {
        label: 'Genel Güç',
        icon: Trophy,
        leftValue: leftPower?.overall ?? 0,
        rightValue: rightPower?.overall ?? 0,
        leftDisplay: leftPower ? `${leftPower.overall}/100` : 'Veri yok',
        rightDisplay: rightPower ? `${rightPower.overall}/100` : 'Veri yok',
        winner: !leftPower || !rightPower ? 'tie'
          : leftPower.overall > rightPower.overall ? 'left'
          : leftPower.overall < rightPower.overall ? 'right' : 'tie',
      },
      {
        label: 'Ödül',
        icon: Skull,
        leftValue: lBounty,
        rightValue: rBounty,
        leftDisplay: left.bounty ? `${formatBerry(lBounty)} Berry` : 'Yok',
        rightDisplay: right.bounty ? `${formatBerry(rBounty)} Berry` : 'Yok',
        winner: lBounty > rBounty ? 'left' : lBounty < rBounty ? 'right' : 'tie',
      },
      {
        label: 'Yetenek Sayısı',
        icon: Sparkles,
        leftValue: lAbilities,
        rightValue: rAbilities,
        leftDisplay: `${lAbilities} yetenek`,
        rightDisplay: `${rAbilities} yetenek`,
        winner: lAbilities > rAbilities ? 'left' : lAbilities < rAbilities ? 'right' : 'tie',
      },
      {
        label: 'Arc Göründü',
        icon: Flame,
        leftValue: lApp,
        rightValue: rApp,
        leftDisplay: `${lApp} arc`,
        rightDisplay: `${rApp} arc`,
        winner: lApp > rApp ? 'left' : lApp < rApp ? 'right' : 'tie',
      },
    ]
    return r
  }, [left, right, leftPower, rightPower])

  const leftWins = rows.filter(r => r.winner === 'left').length
  const rightWins = rows.filter(r => r.winner === 'right').length
  const overallWinner: 'left' | 'right' | 'tie' =
    leftWins > rightWins ? 'left' : rightWins > leftWins ? 'right' : 'tie'

  const swap = () => {
    const temp = left
    setLeft(right)
    setRight(temp)
  }

  const reset = () => {
    setLeft(null)
    setRight(null)
  }

  const randomPick = () => {
    const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5)
    const l = shuffled[0]
    const r = shuffled.find(c => c.slug !== l.slug) ?? shuffled[1]
    setLeft(l)
    setRight(r)
  }

  return (
    <div className="space-y-8">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={randomPick}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold/20 hover:border-gold/50"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Rastgele Seç
        </button>
        {bothSelected && (
          <>
            <button
              onClick={swap}
              className="inline-flex items-center gap-1.5 rounded-full border border-pirate-border/40 bg-ocean-surface/40 px-4 py-2 text-xs font-semibold text-pirate-text transition-all hover:border-gold/40"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              Yer Değiştir
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-luffy/30 bg-luffy/10 px-4 py-2 text-xs font-semibold text-luffy transition-all hover:bg-luffy/20"
            >
              Sıfırla
            </button>
          </>
        )}
      </div>

      {/* Picker grid */}
      <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-6">
        <CharacterPicker
          value={left}
          onSelect={setLeft}
          accent="luffy"
          disabledSlug={right?.slug}
          label="◂ Sol Köşe"
        />
        <CharacterPicker
          value={right}
          onSelect={setRight}
          accent="sea"
          disabledSlug={left?.slug}
          label="Sağ Köşe ▸"
        />

        {/* VS badge (desktop only) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:flex">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/50 bg-ocean-deep shadow-[0_0_30px_rgba(244,163,0,0.3)]">
            <Swords className="h-6 w-6 text-gold" />
          </div>
        </div>
      </div>

      {/* Comparison Result */}
      <AnimatePresence mode="wait">
        {bothSelected && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="space-y-6"
          >
            {/* Winner announcement */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.08] via-ocean-surface/40 to-ocean-deep p-6 text-center sm:p-8"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/[0.12] blur-[60px]" />

              <Trophy className="mx-auto mb-3 h-8 w-8 text-gold" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70">
                Sonuç
              </p>
              {overallWinner === 'tie' ? (
                <p className="text-2xl font-extrabold text-pirate-text sm:text-3xl">
                  Berabere! Yakın Dövüş
                </p>
              ) : (
                <>
                  <p className="text-3xl font-extrabold sm:text-4xl">
                    <span className={overallWinner === 'left' ? 'text-luffy' : 'text-sea'}>
                      {overallWinner === 'left' ? left.name : right.name}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-pirate-muted sm:text-base">
                    <span className="font-bold text-gold">{Math.max(leftWins, rightWins)}</span> / {rows.length} kategoride galip geldi
                  </p>
                </>
              )}
            </motion.div>

            {/* Stats Table */}
            <div className="bento-card overflow-hidden rounded-2xl">
              {rows.map((row, i) => {
                const Icon = row.icon
                return (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.05 }}
                    className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-4 sm:gap-4 sm:px-6 ${
                      i !== rows.length - 1 ? 'border-b border-pirate-border/10' : ''
                    }`}
                  >
                    {/* Left value */}
                    <div className={`text-right ${
                      row.winner === 'left' ? 'text-luffy' : 'text-pirate-muted'
                    }`}>
                      <p className={`text-xs font-bold sm:text-base ${
                        row.winner === 'left' ? 'drop-shadow-[0_0_8px_rgba(231,76,60,0.5)]' : ''
                      }`}>
                        {row.leftDisplay}
                      </p>
                    </div>

                    {/* Center label */}
                    <div className="flex min-w-[90px] flex-col items-center gap-1 px-1 text-center sm:min-w-[160px] sm:px-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                        <Icon className="h-3.5 w-3.5 text-gold" />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-pirate-muted/80 sm:text-xs">
                        {row.label}
                      </p>
                    </div>

                    {/* Right value */}
                    <div className={`text-left ${
                      row.winner === 'right' ? 'text-sea' : 'text-pirate-muted'
                    }`}>
                      <p className={`text-xs font-bold sm:text-base ${
                        row.winner === 'right' ? 'drop-shadow-[0_0_8px_rgba(30,144,255,0.5)]' : ''
                      }`}>
                        {row.rightDisplay}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Stat Bars Side by Side */}
            {leftPower && rightPower && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
                className="rounded-2xl border border-pirate-border/20 bg-ocean-surface/30 p-5 sm:p-6"
              >
                <div className="mb-5 flex items-center justify-center gap-2 sm:justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-luffy truncate max-w-[30%]">
                    {left.name}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Zap className="h-4 w-4 text-gold" />
                    <p className="hidden text-xs font-bold uppercase tracking-wider text-gold sm:inline">Stat Karşılaştırması</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gold sm:hidden">vs</p>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sea truncate max-w-[30%] text-right">
                    {right.name}
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(STAT_LABELS).map(([key, meta]) => {
                    const lVal = leftPower.stats[key as keyof typeof leftPower.stats]
                    const rVal = rightPower.stats[key as keyof typeof rightPower.stats]
                    const leftWin = lVal > rVal
                    const rightWin = rVal > lVal

                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`tabular-nums font-bold ${leftWin ? 'text-luffy' : 'text-pirate-muted/70'}`}>
                            {lVal}
                          </span>
                          <span className="font-semibold uppercase tracking-wider text-pirate-muted/60">
                            {meta.label}
                          </span>
                          <span className={`tabular-nums font-bold ${rightWin ? 'text-sea' : 'text-pirate-muted/70'}`}>
                            {rVal}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {/* Left bar (reversed) */}
                          <div className="h-2 flex-1 rounded-full bg-ocean-deep/50 overflow-hidden">
                            <div
                              className="h-full ml-auto rounded-full transition-all"
                              style={{
                                width: `${lVal}%`,
                                backgroundColor: leftWin ? '#e74c3c' : 'rgba(231,76,60,0.3)',
                              }}
                            />
                          </div>
                          <div className="h-2 w-2 rounded-full bg-pirate-border/30" />
                          {/* Right bar */}
                          <div className="h-2 flex-1 rounded-full bg-ocean-deep/50 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${rVal}%`,
                                backgroundColor: rightWin ? '#1e90ff' : 'rgba(30,144,255,0.3)',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Profile CTAs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/characters/${left.slug}`}
                className="group flex items-center justify-between rounded-xl border border-luffy/30 bg-luffy/[0.05] p-4 transition-all hover:bg-luffy/[0.1]"
              >
                <span className="text-sm font-bold text-luffy">{left.name} Profili</span>
                <ArrowRight className="h-4 w-4 text-luffy transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/characters/${right.slug}`}
                className="group flex items-center justify-between rounded-xl border border-sea/30 bg-sea/[0.05] p-4 transition-all hover:bg-sea/[0.1]"
              >
                <span className="text-sm font-bold text-sea">{right.name} Profili</span>
                <ArrowRight className="h-4 w-4 text-sea transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state hint */}
      {!bothSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pirate-border/30 bg-ocean-surface/20 py-12 text-center"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Shield className="h-5 w-5 text-gold/70" />
          </div>
          <p className="mb-1 text-base font-bold text-pirate-text">
            {!left && !right ? 'İki karakter seç' : 'Bir karakter daha seç'}
          </p>
          <p className="text-xs text-pirate-muted sm:text-sm">
            Yan yana karşılaştırmak için yukarıdan seç, veya <button onClick={randomPick} className="text-gold hover:underline">rastgele seç</button>
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default memo(VersusClient)

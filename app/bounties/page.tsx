'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Skull,
  Crown,
  Search,
  Medal,
  Sparkles,
  Star,
  Swords,
  Shield,
  Flame,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { BOUNTIES, CREW_FILTERS } from '@/lib/constants/bounties'
import type { BountyEntry } from '@/types'

/* ─── Helpers ──────────────────────────────────────────────────── */

function parseBounty(bounty?: string): number {
  if (!bounty) return 0
  return parseInt(bounty.replace(/,/g, ''), 10)
}

function formatBounty(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000
    return b % 1 === 0 ? `${b.toFixed(0)}B` : `${b.toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

const HERO_ORBS = [
  { color: 'rgba(244, 163, 0, 0.4)', size: 300, x: '10%', y: '20%', delay: 0 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 200, x: '70%', y: '10%', delay: 1.5 },
  { color: 'rgba(244, 163, 0, 0.15)', size: 250, x: '80%', y: '60%', delay: 3 },
  { color: 'rgba(231, 76, 60, 0.12)', size: 180, x: '5%', y: '70%', delay: 2 },
]

/* ─── Tier definitions ─────────────────────────────────────────── */

type Tier = {
  id: string
  label: string
  icon: typeof Crown
  minBounty: number
  color: string
  borderColor: string
  bgColor: string
  barColor: string
}

const TIERS: Tier[] = [
  {
    id: 'emperor',
    label: 'İmparator Seviyesi',
    icon: Crown,
    minBounty: 3_000_000_000,
    color: 'text-gold',
    borderColor: 'border-gold/30',
    bgColor: 'bg-gold/[0.04]',
    barColor: 'from-gold via-gold-bright to-gold',
  },
  {
    id: 'commander',
    label: 'Komutan Seviyesi',
    icon: Swords,
    minBounty: 1_000_000_000,
    color: 'text-sea-light',
    borderColor: 'border-sea/30',
    bgColor: 'bg-sea/[0.04]',
    barColor: 'from-sea via-sea-light to-sea',
  },
  {
    id: 'supernova',
    label: 'Supernova Seviyesi',
    icon: Flame,
    minBounty: 300_000_000,
    color: 'text-luffy',
    borderColor: 'border-luffy/30',
    bgColor: 'bg-luffy/[0.04]',
    barColor: 'from-luffy via-orange-500 to-luffy',
  },
  {
    id: 'rookie',
    label: 'Çaylak Seviyesi',
    icon: Shield,
    minBounty: 0,
    color: 'text-pirate-muted',
    borderColor: 'border-pirate-border/30',
    bgColor: 'bg-ocean-surface/30',
    barColor: 'from-pirate-muted/60 via-pirate-muted/40 to-pirate-muted/60',
  },
]

function getTier(bountyValue: number): Tier {
  return TIERS.find((t) => bountyValue >= t.minBounty) ?? TIERS[TIERS.length - 1]
}

/* ─── Page Component ───────────────────────────────────────────── */

export default function BountiesPage() {
  const [search, setSearch] = useState('')
  const [crewFilter, setCrewFilter] = useState('')
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    emperor: true,
    commander: true,
    supernova: true,
    rookie: true,
  })

  const allSorted = useMemo(() => {
    return BOUNTIES
      .filter((b) => b.bounty !== '---')
      .sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty))
  }, [])

  const filtered = useMemo(() => {
    let result = allSorted
    if (crewFilter) {
      result = result.filter((b) => b.crew === crewFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.crew.toLowerCase().includes(q) ||
          (b.epithet?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [search, crewFilter, allSorted])

  const highestBounty = parseBounty(allSorted[0]?.bounty)
  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)
  const totalBounty = allSorted.reduce((sum, b) => sum + parseBounty(b.bounty), 0)
  const isFiltered = search !== '' || crewFilter !== ''

  // Group rest into tiers
  const tieredEntries = useMemo(() => {
    const entries = isFiltered ? filtered : rest
    const grouped: Record<string, { entry: BountyEntry; globalRank: number }[]> = {}
    for (const tier of TIERS) {
      grouped[tier.id] = []
    }
    entries.forEach((entry) => {
      const val = parseBounty(entry.bounty)
      const tier = getTier(val)
      const globalRank = allSorted.findIndex((e) => e.name === entry.name) + 1
      grouped[tier.id].push({ entry, globalRank })
    })
    return grouped
  }, [isFiltered, filtered, rest, allSorted])

  const toggleTier = (tierId: string) => {
    setExpandedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }))
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <PageHero
            icon={Trophy}
            title="Ödül"
            subtitle="Sıralaması"
            description="One Piece evrenindeki en yüksek ödüllü korsanlar ve suçlular. Dünya Hükümeti tarafından belirlenen ödüller, bir kişinin tehlike seviyesini gösterir."
            accentColor="gold"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Trophy className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Toplam Kayıtlı Ödül</p>
                  <p className="text-lg font-extrabold text-gold stat-number">
                    {totalBounty.toLocaleString('tr-TR')} Berry
                  </p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Skull className="h-5 w-5 text-sea" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Aranan Korsan</p>
                  <p className="text-lg font-extrabold text-sea stat-number">{allSorted.length}</p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Crown className="h-5 w-5 text-gold-bright" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">En Yüksek Ödül</p>
                  <p className="text-lg font-extrabold text-gold-bright stat-number">
                    {formatBounty(highestBounty)}
                  </p>
                </div>
              </div>
            </div>
          </PageHero>

          {/* Search + Crew Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-10 space-y-4"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Karakter veya mürettebat ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CREW_FILTERS.map((crew) => (
                <button
                  key={crew.value}
                  onClick={() => setCrewFilter(crew.value === crewFilter ? '' : crew.value)}
                  className={`chip transition-all duration-200 ${
                    crewFilter === crew.value
                      ? 'border-gold/50 bg-gold/15 text-gold shadow-[0_0_12px_rgba(244,163,0,0.15)]'
                      : 'border-pirate-border/50 bg-ocean-surface/30 text-pirate-muted hover:border-pirate-border hover:text-pirate-text'
                  }`}
                >
                  {crew.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ═══ WANTED POSTERS — Top 3 ═══ */}
          {!isFiltered && top3.length >= 3 && (
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="relative mb-16"
            >
              {/* Section header */}
              <div className="mb-8 flex items-center gap-3">
                <Crown className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-gold-gradient">Efsanevi Korsanlar</h2>
                <div className="divider-glow flex-1" />
              </div>

              {/* Ambient glow behind posters */}
              <div className="pointer-events-none absolute -inset-12 -top-20">
                <div className="absolute left-1/2 top-1/3 h-80 w-[500px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[100px]" />
              </div>

              {/* Podium: #2 — #1 — #3 */}
              <div className="relative grid grid-cols-3 items-end gap-4 sm:gap-8 lg:gap-10">
                {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                  const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
                  const isFirst = actualRank === 1
                  const bountyValue = parseBounty(entry.bounty)
                  const characterImage = entry.slug ? getCharacterImage(entry.slug) : ''

                  return (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: 0.4 + podiumIdx * 0.15,
                      }}
                      className="flex flex-col items-center"
                    >
                      <MaybeLinkWrapper slug={entry.slug}>
                        {/* Wanted Poster Card */}
                        <div
                          className={`wanted-poster group relative flex w-full flex-col items-center overflow-hidden transition-all duration-500 ${
                            isFirst
                              ? 'rounded-2xl sm:rounded-3xl'
                              : 'rounded-xl sm:rounded-2xl'
                          }`}
                          style={{
                            background: isFirst
                              ? 'linear-gradient(180deg, #2a1f0a 0%, #1a1305 40%, #0f0c04 100%)'
                              : 'linear-gradient(180deg, #1e1809 0%, #14100a 40%, #0c0a06 100%)',
                          }}
                        >
                          {/* Poster border */}
                          <div
                            className={`absolute inset-0 rounded-[inherit] border-2 transition-all duration-500 ${
                              isFirst
                                ? 'border-gold/40 group-hover:border-gold/60'
                                : 'border-gold/20 group-hover:border-gold/35'
                            }`}
                          />

                          {/* Corner decorations */}
                          <div className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-gold/30 sm:left-3 sm:top-3 sm:h-5 sm:w-5" />
                          <div className="absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-gold/30 sm:right-3 sm:top-3 sm:h-5 sm:w-5" />
                          <div className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-gold/30 sm:bottom-3 sm:left-3 sm:h-5 sm:w-5" />
                          <div className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-gold/30 sm:bottom-3 sm:right-3 sm:h-5 sm:w-5" />

                          {/* Shimmer sweep */}
                          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/[0.06] to-transparent animate-shimmer" />
                          </div>

                          {/* "WANTED" header */}
                          <div className={`relative z-10 w-full text-center ${isFirst ? 'pt-5 sm:pt-8' : 'pt-3 sm:pt-5'}`}>
                            <p
                              className={`font-extrabold uppercase tracking-[0.2em] ${
                                isFirst
                                  ? 'text-base sm:text-2xl text-gold'
                                  : 'text-[11px] sm:text-base text-gold/80'
                              }`}
                              style={{
                                textShadow: isFirst
                                  ? '0 0 20px rgba(244,163,0,0.3)'
                                  : '0 0 12px rgba(244,163,0,0.2)',
                              }}
                            >
                              WANTED
                            </p>
                            {/* Decorative line */}
                            <div className={`mx-auto mt-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent ${
                              isFirst ? 'h-[2px] w-3/4' : 'h-px w-2/3'
                            }`} />
                          </div>

                          {/* Character portrait */}
                          <div className={`relative z-10 mx-auto overflow-hidden border-2 transition-all duration-500 ${
                            isFirst
                              ? 'mt-3 sm:mt-6 h-28 w-24 sm:h-48 sm:w-40 rounded-lg sm:rounded-xl border-gold/30 group-hover:border-gold/50 shadow-[0_0_30px_rgba(244,163,0,0.1)]'
                              : 'mt-2 sm:mt-4 h-20 w-16 sm:h-36 sm:w-28 rounded-lg border-gold/20 group-hover:border-gold/35'
                          }`}>
                            {characterImage ? (
                              <Image
                                src={characterImage}
                                alt={entry.name}
                                fill
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                sizes={isFirst ? '128px' : '96px'}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-ocean-surface/30">
                                <Skull className="h-6 w-6 text-gold/30" />
                              </div>
                            )}
                            {/* Vignette overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                          </div>

                          {/* "DEAD OR ALIVE" */}
                          <p className={`relative z-10 mt-2 sm:mt-4 font-bold uppercase tracking-[0.15em] ${
                            isFirst
                              ? 'text-[9px] sm:text-xs text-luffy/80'
                              : 'text-[7px] sm:text-[10px] text-luffy/60'
                          }`}>
                            Dead or Alive
                          </p>

                          {/* Name */}
                          <div className="relative z-10 mt-1.5 px-3 text-center sm:mt-3 sm:px-4">
                            <p
                              className={`font-extrabold leading-tight ${
                                isFirst
                                  ? 'text-sm sm:text-lg text-pirate-text'
                                  : 'text-[11px] sm:text-base text-pirate-text/90'
                              }`}
                            >
                              {entry.name}
                            </p>
                            {entry.epithet && (
                              <p className={`mt-0.5 italic ${
                                isFirst
                                  ? 'text-[10px] sm:text-sm text-gold/60'
                                  : 'text-[8px] sm:text-[11px] text-gold/50'
                              }`}>
                                &quot;{entry.epithet}&quot;
                              </p>
                            )}
                          </div>

                          {/* Bounty amount */}
                          <div className={`relative z-10 mt-auto w-full text-center ${
                            isFirst ? 'pb-5 sm:pb-8 pt-3 sm:pt-5' : 'pb-3 sm:pb-5 pt-2 sm:pt-3'
                          }`}>
                            {/* Decorative line above bounty */}
                            <div className={`mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-transparent via-gold/30 to-transparent ${
                              isFirst ? 'h-px w-3/4' : 'h-px w-2/3'
                            }`} />
                            <p
                              className={`font-extrabold stat-number ${
                                isFirst
                                  ? 'text-lg sm:text-3xl text-gold'
                                  : 'text-sm sm:text-xl text-gold/85'
                              }`}
                              style={{
                                textShadow: isFirst
                                  ? '0 0 24px rgba(244,163,0,0.4)'
                                  : '0 0 12px rgba(244,163,0,0.2)',
                              }}
                            >
                              {entry.bounty}
                            </p>
                            <p className={`font-medium uppercase tracking-wider ${
                              isFirst
                                ? 'text-[10px] sm:text-sm text-gold/50'
                                : 'text-[8px] sm:text-[11px] text-gold/40'
                            }`}>
                              Berry
                            </p>
                          </div>
                        </div>
                      </MaybeLinkWrapper>

                      {/* Rank badge below poster */}
                      <div
                        className={`mt-3 flex items-center justify-center rounded-full ${
                          isFirst
                            ? 'h-10 w-10 bg-gold/20 border-2 border-gold/40 shadow-[0_0_20px_rgba(244,163,0,0.2)]'
                            : actualRank === 2
                              ? 'h-8 w-8 bg-pirate-text/10 border border-pirate-text/30'
                              : 'h-8 w-8 bg-amber-700/15 border border-amber-700/30'
                        }`}
                      >
                        {isFirst ? (
                          <Crown className="h-5 w-5 text-gold" />
                        ) : (
                          <span
                            className={`text-sm font-extrabold ${
                              actualRank === 2 ? 'text-pirate-text' : 'text-amber-600'
                            }`}
                          >
                            {actualRank}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* ═══ TIER-BASED LEADERBOARD ═══ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="mb-12"
          >
            {/* Section header */}
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-4 w-4 text-sea" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-pirate-muted">
                {isFiltered ? `Sonuçlar (${filtered.length})` : 'Tam Sıralama'}
              </h2>
              <div className="divider-glow flex-1" />
            </div>

            {/* Tier groups */}
            <div className="space-y-6">
              {TIERS.map((tier) => {
                const entries = tieredEntries[tier.id]
                if (entries.length === 0) return null

                const TierIcon = tier.icon
                const isExpanded = expandedTiers[tier.id]

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden rounded-2xl border border-pirate-border/20 bg-ocean-deep/40"
                  >
                    {/* Tier header — clickable */}
                    <button
                      onClick={() => toggleTier(tier.id)}
                      className={`group/tier flex w-full items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 transition-colors duration-300 ${tier.bgColor} hover:bg-opacity-[0.08]`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tier.bgColor} border ${tier.borderColor}`}>
                        <TierIcon className={`h-4 w-4 ${tier.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-bold ${tier.color}`}>{tier.label}</p>
                        <p className="text-[10px] text-pirate-muted">
                          {entries.length} korsan
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <ChevronDown className="h-4 w-4 text-pirate-muted" />
                      </motion.div>
                    </button>

                    {/* Tier content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="divide-y divide-pirate-border/10">
                            {entries.map(({ entry, globalRank }, i) => {
                              const bountyValue = parseBounty(entry.bounty)
                              const barPercent = Math.max((bountyValue / highestBounty) * 100, 2)
                              const characterImage = entry.slug ? getCharacterImage(entry.slug) : ''

                              return (
                                <motion.div
                                  key={entry.name}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.4,
                                    ease: EASE,
                                    delay: i * 0.03,
                                  }}
                                >
                                  <MaybeLinkWrapper slug={entry.slug}>
                                    <div className="group relative flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 transition-all duration-300 hover:bg-gold/[0.03]">
                                      {/* Hover glow line */}
                                      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-gold/0 to-transparent transition-all duration-300 group-hover:via-gold/40" />

                                      {/* Rank */}
                                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                                        globalRank <= 3
                                          ? 'bg-gold/15 border border-gold/30 text-gold'
                                          : globalRank <= 10
                                            ? 'bg-sea/10 border border-sea/20 text-sea'
                                            : 'bg-ocean-surface/60 border border-pirate-border/30 text-pirate-muted'
                                      }`}>
                                        {globalRank}
                                      </div>

                                      {/* Avatar */}
                                      <div className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-300 sm:h-12 sm:w-12 ${
                                        globalRank <= 5
                                          ? 'border-gold/25 group-hover:border-gold/50'
                                          : 'border-pirate-border/30 group-hover:border-pirate-border/50'
                                      }`}>
                                        {characterImage ? (
                                          <Image
                                            src={characterImage}
                                            alt={entry.name}
                                            fill
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                            sizes="48px"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center bg-ocean-surface/50">
                                            <Skull className="h-4 w-4 text-pirate-muted/40" />
                                          </div>
                                        )}
                                      </div>

                                      {/* Name + Epithet + Crew */}
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="truncate text-sm font-bold text-pirate-text transition-colors group-hover:text-gold sm:text-base">
                                            {entry.name}
                                          </p>
                                          {entry.epithet && (
                                            <span className="hidden text-xs italic text-pirate-muted/60 sm:inline">
                                              &quot;{entry.epithet}&quot;
                                            </span>
                                          )}
                                        </div>
                                        {/* Bounty bar */}
                                        <div className="mt-1.5 flex items-center gap-2">
                                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ocean-surface/60">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${barPercent}%` }}
                                              transition={{
                                                duration: 1,
                                                ease: EASE,
                                                delay: 0.6 + i * 0.04,
                                              }}
                                              className={`h-full rounded-full bg-gradient-to-r ${tier.barColor}`}
                                            />
                                          </div>
                                          <span className="hidden text-[10px] text-pirate-muted sm:inline">
                                            {entry.crew}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Bounty value */}
                                      <div className="flex-shrink-0 text-right">
                                        <p className={`text-sm font-extrabold stat-number sm:text-base ${
                                          globalRank <= 3
                                            ? 'text-gold'
                                            : globalRank <= 10
                                              ? 'text-gold/80'
                                              : 'text-pirate-text'
                                        }`}>
                                          {formatBounty(bountyValue)}
                                        </p>
                                        <p className="text-[9px] text-pirate-muted sm:text-[10px]">
                                          Berry
                                        </p>
                                      </div>
                                    </div>
                                  </MaybeLinkWrapper>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex flex-col items-center gap-3 py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-pirate-border/20 bg-ocean-surface/40">
                  <Search className="h-7 w-7 text-pirate-muted/40" />
                </div>
                <p className="text-pirate-muted">Aramanızla eşleşen korsan bulunamadı.</p>
                <button
                  onClick={() => {
                    setSearch('')
                    setCrewFilter('')
                  }}
                  className="btn-ghost mt-2 px-4 py-2 text-xs"
                >
                  Filtreleri Temizle
                </button>
              </motion.div>
            )}
          </motion.section>

          {/* ═══ CHOPPER FUN FACT ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
            className="relative mb-8 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] via-ocean-surface/60 to-ocean-surface/30"
          >
            {/* Background sparkle */}
            <div className="absolute right-4 top-4 opacity-20">
              <Sparkles className="h-16 w-16 text-gold" />
            </div>

            <div className="relative flex items-start gap-4 p-5 sm:p-6">
              {/* Chopper avatar */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gold/20 bg-ocean-surface">
                <Image
                  src={getCharacterImage('chopper')}
                  alt="Tony Tony Chopper"
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                />
              </div>

              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <Medal className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">Eğlenceli Bilgi</span>
                </div>
                <p className="text-sm leading-relaxed text-pirate-text">
                  Chopper&apos;ın ödülü sadece <span className="font-extrabold text-gold">1.000 Berry</span> — Dünya Hükümeti onu mürettebatın maskotu (evcil hayvanı) sanıyor! Bu, tüm One Piece evrenindeki en düşük aktif korsan ödülü.
                </p>
                <p className="mt-1.5 text-[11px] italic text-pirate-muted">
                  &quot;Ben bir geyik değilim, bir Tanuki&apos;yim!&quot; — Chopper (muhtemelen)
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

/* ─── Helper Components ────────────────────────────────────────── */

function MaybeLinkWrapper({ slug, children }: { slug?: string; children: React.ReactNode }) {
  if (slug) {
    return (
      <Link href={`/characters/${slug}`} className="block">
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

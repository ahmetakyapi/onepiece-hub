'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Users,
  Anchor,
  ArrowUpDown,
  ArrowRight,
  Skull,
  Crown,
  Swords,
  Shield,
  Flame,
  Sparkles,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/wiki/PageHero'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { parseBounty, formatBounty } from '@/lib/utils'
import { CREW_COLORS, CREW_ICONS } from '@/lib/constants/crew-styles'
import type { CrewType } from '@/types'

/* ─── Constants ──────────────────────────────────────────────── */

const CREW_FILTERS = Object.entries(CREW_LABELS) as [CrewType, string][]

type SortMode = 'default' | 'bounty-desc' | 'bounty-asc'

const SORT_LABELS: Record<SortMode, string> = {
  default: 'Varsayılan',
  'bounty-desc': 'Ödül: Yüksek → Düşük',
  'bounty-asc': 'Ödül: Düşük → Yüksek',
}

/* ─── Hero Orbs ──────────────────────────────────────────────── */

const HERO_ORBS = [
  { color: 'radial-gradient(circle, rgba(244,163,0,0.4), transparent 70%)', size: 280, x: '5%', y: '10%', delay: 0 },
  { color: 'radial-gradient(circle, rgba(30,144,255,0.3), transparent 70%)', size: 220, x: '75%', y: '20%', delay: 1.5 },
  { color: 'radial-gradient(circle, rgba(231,76,60,0.25), transparent 70%)', size: 180, x: '60%', y: '60%', delay: 3 },
]

/* ─── Page Component ─────────────────────────────────────────── */

export default function CharactersPage() {
  const [search, setSearch] = useState('')
  const [activeCrew, setActiveCrew] = useState<CrewType | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('default')

  const filtered = useMemo(() => {
    let result = CHARACTERS.filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.epithet && c.epithet.toLowerCase().includes(q))
      const matchesCrew = !activeCrew || c.crew === activeCrew
      return matchesSearch && matchesCrew
    })

    if (sortMode === 'bounty-desc') {
      result = [...result].sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty))
    } else if (sortMode === 'bounty-asc') {
      result = [...result].sort((a, b) => parseBounty(a.bounty) - parseBounty(b.bounty))
    }

    return result
  }, [search, activeCrew, sortMode])

  const cycleSortMode = () => {
    setSortMode((prev) => {
      if (prev === 'default') return 'bounty-desc'
      if (prev === 'bounty-desc') return 'bounty-asc'
      return 'default'
    })
  }

  /* Stats */
  const totalBounty = useMemo(
    () => CHARACTERS.reduce((sum, c) => sum + parseBounty(c.bounty), 0),
    [],
  )
  const crewCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    CHARACTERS.forEach((c) => {
      counts[c.crew] = (counts[c.crew] || 0) + 1
    })
    return counts
  }, [])

  return (
      <main className="relative min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* ─── Hero ─── */}
          <PageHero
            icon={Users}
            title="Karakter"
            subtitle="Ansiklopedisi"
            description="One Piece evreninin efsanevi karakterlerini keşfet. Hasır Şapkalar'dan Yonko'lara, Deniz Kuvvetleri'nden Devrimcilere — her birinin hikayesi, güçleri ve kaderleri."
            accentColor="gold"
            orbs={HERO_ORBS}
          >
            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-2">
                <Users className="h-4 w-4 text-gold" />
                <span className="text-xs font-semibold text-pirate-text">{CHARACTERS.length}</span>
                <span className="text-xs text-pirate-muted">Karakter</span>
              </div>
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-2">
                <Anchor className="h-4 w-4 text-sea-light" />
                <span className="text-xs font-semibold text-pirate-text">{Object.keys(crewCounts).length}</span>
                <span className="text-xs text-pirate-muted">Mürettebat</span>
              </div>
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-2">
                <Skull className="h-4 w-4 text-luffy" />
                <span className="text-xs font-semibold text-pirate-text">{formatBounty(totalBounty)}</span>
                <span className="text-xs text-pirate-muted">Toplam Ödül</span>
              </div>
            </div>
          </PageHero>

          {/* ─── Search + Sort ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
              <input
                type="text"
                placeholder="Karakter veya lakap ara..."
                aria-label="Karakter veya lakap ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 backdrop-blur-sm focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>

            <button
              onClick={cycleSortMode}
              className={`chip flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 ${
                sortMode !== 'default' ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {SORT_LABELS[sortMode]}
            </button>
          </motion.div>

          {/* ─── Crew Filters ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCrew(null)}
              className={`chip flex items-center gap-1.5 transition-all duration-300 ${
                !activeCrew ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''
              }`}
            >
              <Users className="h-3 w-3" />
              Tümü
              <span className="ml-0.5 text-[10px] opacity-60">{CHARACTERS.length}</span>
            </button>
            {CREW_FILTERS.map(([key, label]) => {
              const colors = CREW_COLORS[key] || CREW_COLORS.other
              const count = crewCounts[key] || 0
              const Icon = CREW_ICONS[key] || Anchor
              return (
                <button
                  key={key}
                  onClick={() => setActiveCrew(key === activeCrew ? null : key)}
                  className={`chip flex items-center gap-1.5 transition-all duration-300 ${
                    activeCrew === key
                      ? `${colors.border} ${colors.bg} ${colors.text}`
                      : ''
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                  <span className="ml-0.5 text-[10px] opacity-60">{count}</span>
                </button>
              )
            })}
          </motion.div>

          {/* ─── Results count ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 flex items-center justify-between"
          >
            <span className="text-xs text-pirate-muted">
              {filtered.length} karakter gösteriliyor
            </span>
          </motion.div>

          {/* ─── Character Grid ─── */}
          <motion.div
            variants={staggerContainer(0.04)}
            initial="hidden"
            animate="visible"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="sync">
              {filtered.map((char) => {
                const colors = CREW_COLORS[char.crew] || CREW_COLORS.other
                const bountyValue = parseBounty(char.bounty)

                return (
                  <motion.div
                    key={char.slug}
                    variants={fadeUp}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Link
                      href={`/characters/${char.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pirate-border/20 bg-ocean-surface/30 backdrop-blur-sm transition-all duration-500 hover:border-pirate-border/40 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
                    >
                      {/* Image area */}
                      <div className="relative h-52 overflow-hidden">
                        <CharacterAvatar
                          slug={char.slug}
                          name={char.name}
                          crew={char.crew}
                          className="transition-transform duration-700 ease-expo-out group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ocean-deep/30" />

                        {/* Hover shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-200%] transition-transform duration-700 group-hover:translate-x-[200%]" />

                        {/* Epithet badge */}
                        {char.epithet && (
                          <div className="absolute left-3 top-3 z-10">
                            <span className={`inline-flex items-center gap-1 rounded-lg border ${colors.border} ${colors.bg} px-2 py-0.5 text-[10px] font-bold ${colors.text} backdrop-blur-md`}>
                              {char.epithet}
                            </span>
                          </div>
                        )}

                        {/* Bounty badge - top right */}
                        {char.bounty && (
                          <div className="absolute right-3 top-3 z-10">
                            <span className="inline-flex items-center gap-1 rounded-lg border border-gold/20 bg-ocean-deep/60 px-2 py-0.5 text-[10px] font-bold text-gold backdrop-blur-md">
                              <Skull className="h-2.5 w-2.5" />
                              {formatBounty(bountyValue)}
                            </span>
                          </div>
                        )}

                        {/* Character name overlay at bottom of image */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                          <h3 className="text-base font-extrabold tracking-tight text-pirate-text transition-colors duration-300 group-hover:text-gold drop-shadow-lg">
                            {char.name}
                          </h3>
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="flex flex-1 flex-col p-4 pt-2">
                        {/* Crew badge */}
                        <div className="mb-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md border ${colors.border} ${colors.bg} px-2 py-0.5 text-[10px] font-semibold ${colors.text}`}
                          >
                            <Anchor className="h-2.5 w-2.5" />
                            {CREW_LABELS[char.crew]}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-pirate-muted/70">
                          {char.description}
                        </p>

                        {/* Devil fruit indicator */}
                        {char.devilFruit && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-purple-400/70" />
                            <span className="truncate text-[10px] text-purple-400/70">
                              {char.devilFruit.name}
                            </span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto flex items-center justify-between border-t border-pirate-border/10 pt-3 mt-3">
                          {char.bounty ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] text-pirate-muted/40">Ödül</span>
                              <span className="text-xs font-bold text-gold tabular-nums">
                                {char.bounty}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-pirate-muted/30">Ödül bilinmiyor</span>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-pirate-muted/30 transition-all duration-300 group-hover:text-gold/50">
                            <span className="hidden sm:inline">Detay</span>
                            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* ─── Empty State ─── */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-pirate-border/20 bg-ocean-surface/30">
                <Users className="h-10 w-10 text-pirate-muted/30" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-pirate-text">Karakter Bulunamadı</h3>
              <p className="text-sm text-pirate-muted">
                Aramanızla eşleşen karakter bulunamadı. Farklı bir arama deneyin.
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-20" />
      </main>
  )
}

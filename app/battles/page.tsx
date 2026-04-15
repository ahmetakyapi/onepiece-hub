'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Swords,
  Star,
  Heart,
  Zap,
  Crown,
  Shield,
  Flame,
  ChevronDown,
  Trophy,
  Target,
  Sparkles,
  Search,
  ArrowUpDown,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/wiki/PageHero'
import { BATTLES, BATTLE_CATEGORIES } from '@/lib/constants/battles'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE, scaleIn } from '@/lib/variants'

/* ─── Constants ──────────────────────────────────────────────── */

const WINNER_LABELS = {
  side1: 'Taraf 1',
  side2: 'Taraf 2',
  draw: 'Berabere',
  interrupted: 'Yarıda Kaldı',
} as const

const CATEGORY_ICONS: Record<string, typeof Swords> = {
  epic: Flame,
  emotional: Heart,
  rivalry: Swords,
  war: Shield,
  'turning-point': Target,
}

const CATEGORY_COLORS: Record<string, { border: string; bg: string; glow: string; gradient: string; hex: string }> = {
  epic: {
    border: 'border-gold/40',
    bg: 'bg-gold/10',
    glow: 'rgba(244, 163, 0, 0.15)',
    gradient: 'from-gold/80 to-gold-bright/60',
    hex: '#f4a300',
  },
  emotional: {
    border: 'border-sea-light/40',
    bg: 'bg-sea/10',
    glow: 'rgba(96, 184, 255, 0.15)',
    gradient: 'from-sea-light/80 to-sea/60',
    hex: '#60b8ff',
  },
  rivalry: {
    border: 'border-luffy/40',
    bg: 'bg-luffy/10',
    glow: 'rgba(231, 76, 60, 0.15)',
    gradient: 'from-luffy/80 to-red-500/60',
    hex: '#e74c3c',
  },
  war: {
    border: 'border-purple-400/40',
    bg: 'bg-purple-400/10',
    glow: 'rgba(139, 92, 246, 0.15)',
    gradient: 'from-purple-400/80 to-purple-600/60',
    hex: '#a78bfa',
  },
  'turning-point': {
    border: 'border-emerald-400/40',
    bg: 'bg-emerald-400/10',
    glow: 'rgba(52, 211, 153, 0.15)',
    gradient: 'from-emerald-400/80 to-emerald-600/60',
    hex: '#34d399',
  },
}

type SortOption = 'default' | 'power' | 'emotion'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Varsayılan' },
  { value: 'power', label: 'Güç Seviyesi' },
  { value: 'emotion', label: 'Duygusal Ağırlık' },
]

const HERO_ORBS = [
  { color: 'rgba(231, 76, 60, 0.4)', size: 300, x: '5%', y: '10%', delay: 0 },
  { color: 'rgba(244, 163, 0, 0.35)', size: 250, x: '65%', y: '5%', delay: 1.5 },
  { color: 'rgba(231, 76, 60, 0.25)', size: 200, x: '80%', y: '60%', delay: 3 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 180, x: '20%', y: '70%', delay: 2 },
]

/* ─── Featured battle — highest combined score ───────────────── */

const FEATURED_BATTLE = BATTLES.reduce((best, b) =>
  b.powerLevel + b.emotionalWeight > best.powerLevel + best.emotionalWeight ? b : best
, BATTLES[0])

/* ─── Page Component ─────────────────────────────────────────── */

export default function BattlesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedMoments, setExpandedMoments] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  const categories = Object.entries(BATTLE_CATEGORIES)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of BATTLES) {
      counts[b.category] = (counts[b.category] || 0) + 1
    }
    return counts
  }, [])

  const filtered = useMemo(() => {
    let result = [...BATTLES]

    // Category filter
    if (activeCategory) {
      result = result.filter((b) => b.category === activeCategory)
    }

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.arc.toLowerCase().includes(q) ||
          b.participants.side1.some((p) => p.toLowerCase().includes(q)) ||
          b.participants.side2.some((p) => p.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === 'power') {
      result.sort((a, b) => b.powerLevel - a.powerLevel)
    } else if (sortBy === 'emotion') {
      result.sort((a, b) => b.emotionalWeight - a.emotionalWeight)
    }

    return result
  }, [activeCategory, search, sortBy])

  const toggleMoments = (slug: string) => {
    setExpandedMoments((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  // Stats
  const avgPower = (BATTLES.reduce((s, b) => s + b.powerLevel, 0) / BATTLES.length).toFixed(1)
  const avgEmotion = (BATTLES.reduce((s, b) => s + b.emotionalWeight, 0) / BATTLES.length).toFixed(1)

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <PageHero
            icon={Swords}
            title="Efsanevi"
            subtitle="Savaşlar"
            description="One Piece tarihinin en ikonik dövüşleri ve savaşları. Destansı çatışmalardan duygusal düellolara, her savaş hikayenin gidişatını değiştirdi."
            accentColor="luffy"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Swords className="h-5 w-5 text-luffy" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Toplam Savaş</p>
                  <p className="text-lg font-extrabold text-luffy stat-number">{BATTLES.length}</p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Zap className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Ort. Güç</p>
                  <p className="text-lg font-extrabold text-gold stat-number">{avgPower}/5</p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Heart className="h-5 w-5 text-sea-light" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Ort. Duygu</p>
                  <p className="text-lg font-extrabold text-sea-light stat-number">{avgEmotion}/5</p>
                </div>
              </div>
            </div>
          </PageHero>

          {/* ── Featured Battle Spotlight ────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12"
          >
            <div className="mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-extrabold text-pirate-text">Destansı Düello</h2>
            </div>

            {(() => {
              const battle = FEATURED_BATTLE
              const catInfo = BATTLE_CATEGORIES[battle.category]
              const catColors = CATEGORY_COLORS[battle.category]
              const isWinner = battle.winner === 'side1' || battle.winner === 'side2'
              const winnerName =
                battle.winner === 'side1'
                  ? battle.participants.side1.join(', ')
                  : battle.winner === 'side2'
                    ? battle.participants.side2.join(', ')
                    : WINNER_LABELS[battle.winner]

              return (
                <div className="group relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/[0.04] via-ocean-surface/60 to-ocean-deep">
                  {/* Background glow */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/[0.06] blur-3xl" />
                  <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-luffy/[0.04] blur-3xl" />

                  {/* Category accent top */}
                  <div className={`h-1 w-full bg-gradient-to-r ${catColors.gradient}`} />

                  <div className="relative z-10 p-6 sm:p-8">
                    {/* Title row */}
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${catColors.bg} border ${catColors.border}`}>
                            <Swords className={`h-5 w-5 ${catInfo.color}`} />
                          </div>
                          <h3 className="text-xl font-extrabold text-pirate-text sm:text-2xl lg:text-3xl">
                            {battle.name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`chip ${catInfo.color} ${catColors.bg} ${catColors.border}`}>
                            {catInfo.label}
                          </span>
                          <Link
                            href={`/arcs/${battle.arcSlug}`}
                            className="chip border-sea/20 bg-sea/10 text-sea transition-colors hover:bg-sea/20"
                          >
                            {battle.arc}
                          </Link>
                          {battle.episodes && (
                            <span className="chip border-pirate-border/30 bg-ocean-surface/60 text-pirate-muted">
                              {battle.episodes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Power & Emotion */}
                      <div className="flex gap-6">
                        <div className="min-w-[100px]">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-gold" />
                            <span className="text-[11px] font-semibold text-pirate-muted">Güç</span>
                            <span className="ml-auto text-sm font-bold text-gold">{battle.powerLevel}/5</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ocean-surface">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold-bright"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(battle.powerLevel / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                            />
                          </div>
                        </div>
                        <div className="min-w-[100px]">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-luffy" />
                            <span className="text-[11px] font-semibold text-pirate-muted">Duygu</span>
                            <span className="ml-auto text-sm font-bold text-luffy">{battle.emotionalWeight}/5</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ocean-surface">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-luffy/80 to-red-400"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(battle.emotionalWeight / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: EASE, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS Section — cinematic */}
                    <div className="mb-6 flex items-stretch gap-0">
                      {/* Side 1 */}
                      <div className="flex-1 rounded-l-2xl border-l-4 border-sea bg-ocean-surface/60 p-5">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-sea">Taraf 1</p>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {battle.participantSlugs?.side1.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link
                                key={slug}
                                href={`/characters/${slug}`}
                                className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-sea/20 bg-ocean-deep transition-all hover:scale-105 hover:border-sea/50 sm:h-20 sm:w-20"
                              >
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="80px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side1.map((p) => (
                          <p key={p} className="text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>

                      {/* VS Badge */}
                      <div className="relative z-10 flex items-center -mx-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/50 bg-gradient-to-br from-gold/25 to-ocean-deep shadow-[0_0_30px_rgba(244,163,0,0.35)]">
                          <span className="text-lg font-black tracking-wider text-gold drop-shadow-[0_0_12px_rgba(244,163,0,0.6)]">
                            VS
                          </span>
                        </div>
                      </div>

                      {/* Side 2 */}
                      <div className="flex-1 rounded-r-2xl border-r-4 border-luffy bg-ocean-surface/60 p-5 text-right">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-luffy">Taraf 2</p>
                        <div className="mb-3 flex flex-wrap justify-end gap-2">
                          {battle.participantSlugs?.side2.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link
                                key={slug}
                                href={`/characters/${slug}`}
                                className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-luffy/20 bg-ocean-deep transition-all hover:scale-105 hover:border-luffy/50 sm:h-20 sm:w-20"
                              >
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="80px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side2.map((p) => (
                          <p key={p} className="text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>
                    </div>

                    {/* Winner */}
                    <div className={`mb-5 overflow-hidden rounded-xl ${
                      isWinner
                        ? 'border border-gold/20 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent'
                        : 'border border-pirate-border/50 bg-ocean-surface'
                    }`}>
                      <div className="flex items-center gap-3 px-5 py-3.5">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isWinner ? 'bg-gold/20' : 'bg-ocean-mid'}`}>
                          <Crown className={`h-5 w-5 ${isWinner ? 'text-gold' : 'text-pirate-muted'}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-pirate-muted">
                            {isWinner ? 'Kazanan' : 'Sonuç'}
                          </p>
                          <p className={`text-sm font-extrabold ${isWinner ? 'text-gold' : 'text-pirate-muted'}`}>
                            {winnerName}{isWinner && ' kazandı'}
                          </p>
                        </div>
                        {isWinner && <Trophy className="ml-auto h-5 w-5 text-gold/40" />}
                      </div>
                    </div>

                    {/* Significance */}
                    <p className="mb-3 text-sm font-semibold leading-relaxed text-sea">
                      {battle.significance}
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-pirate-muted">
                      {battle.description}
                    </p>
                  </div>
                </div>
              )
            })()}
          </motion.section>

          {/* ── Filters + Search + Sort ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search + Sort row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
                <input
                  type="text"
                  placeholder="Savaş veya karakter ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-pirate-muted" />
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        sortBy === opt.value
                          ? 'bg-gold/15 text-gold border border-gold/30'
                          : 'bg-ocean-surface/40 text-pirate-muted border border-pirate-border/30 hover:text-pirate-text'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category filter */}
            <motion.div
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              <motion.button
                variants={scaleIn}
                onClick={() => setActiveCategory(null)}
                className={`chip transition-all duration-200 ${
                  !activeCategory
                    ? 'border-gold/50 bg-gold/15 text-gold shadow-[0_0_12px_rgba(244,163,0,0.15)]'
                    : 'border-pirate-border/50 bg-ocean-surface/30 text-pirate-muted hover:text-pirate-text'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Tümü
                <span className="ml-1 text-[10px] opacity-60">{BATTLES.length}</span>
              </motion.button>

              {categories.map(([key, { label, color }]) => {
                const IconComp = CATEGORY_ICONS[key] || Swords
                const isActive = activeCategory === key
                const catColors = CATEGORY_COLORS[key]
                return (
                  <motion.button
                    key={key}
                    variants={scaleIn}
                    onClick={() => setActiveCategory(isActive ? null : key)}
                    className={`chip transition-all duration-200 ${
                      isActive
                        ? `${catColors.border} ${catColors.bg} ${color} shadow-lg`
                        : 'border-pirate-border/50 bg-ocean-surface/30 text-pirate-muted hover:text-pirate-text'
                    }`}
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    {label}
                    <span className="ml-1 text-[10px] opacity-60">{categoryCounts[key] || 0}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Results count */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-pirate-border/50 to-transparent" />
            <span className="text-xs font-semibold text-pirate-muted">
              {filtered.length} savaş gösteriliyor
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-pirate-border/50 to-transparent" />
          </div>

          {/* ── Battle Cards ─────────────────────────────────────── */}
          <div className="space-y-6">
            {filtered.map((battle, i) => {
              const catInfo = BATTLE_CATEGORIES[battle.category]
              const catColors = CATEGORY_COLORS[battle.category]
              const momentsOpen = expandedMoments[battle.slug] ?? false
              const isWinner = battle.winner === 'side1' || battle.winner === 'side2'

              const winnerName =
                battle.winner === 'side1'
                  ? battle.participants.side1.join(', ')
                  : battle.winner === 'side2'
                    ? battle.participants.side2.join(', ')
                    : WINNER_LABELS[battle.winner]

              // Skip featured battle in the list
              if (battle.slug === FEATURED_BATTLE.slug && !activeCategory && !search && sortBy === 'default') {
                return null
              }

              return (
                <motion.article
                  key={battle.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.03 }}
                  className="bento-card group relative overflow-hidden transition-all duration-500 hover:border-pirate-border/30"
                >
                  {/* Category gradient top border */}
                  <div className={`h-1 w-full bg-gradient-to-r ${catColors.gradient}`} />

                  <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${catColors.bg} border ${catColors.border}`}>
                            <Swords className={`h-4 w-4 ${catInfo.color}`} />
                          </div>
                          <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                            {battle.name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`chip ${catInfo.color} ${catColors.bg} ${catColors.border}`}>
                            {catInfo.label}
                          </span>
                          <Link
                            href={`/arcs/${battle.arcSlug}`}
                            className="chip border-sea/20 bg-sea/10 text-sea transition-colors hover:bg-sea/20"
                          >
                            {battle.arc}
                          </Link>
                          {battle.episodes && (
                            <span className="chip border-pirate-border/30 bg-ocean-surface/60 text-pirate-muted">
                              {battle.episodes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Power & Emotion meters */}
                      <div className="flex gap-5">
                        <div className="min-w-[90px]">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-gold" />
                            <span className="text-[11px] font-semibold text-pirate-muted">Güç</span>
                            <span className="ml-auto text-[11px] font-bold text-gold">{battle.powerLevel}/5</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-ocean-surface">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold-bright"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(battle.powerLevel / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                            />
                          </div>
                        </div>
                        <div className="min-w-[90px]">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-luffy" />
                            <span className="text-[11px] font-semibold text-pirate-muted">Duygu</span>
                            <span className="ml-auto text-[11px] font-bold text-luffy">{battle.emotionalWeight}/5</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-ocean-surface">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-luffy/80 to-red-400"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(battle.emotionalWeight / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Participants VS */}
                    <div className="mb-5 flex items-stretch gap-0">
                      {/* Side 1 */}
                      <div className="flex-1 rounded-l-xl border-l-[3px] border-sea bg-ocean-surface/60 p-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sea">Taraf 1</p>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {battle.participantSlugs?.side1.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link key={slug} href={`/characters/${slug}`} className="relative h-14 w-14 overflow-hidden rounded-xl border border-sea/20 bg-ocean-deep transition-transform hover:scale-110 sm:h-16 sm:w-16">
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="64px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side1.map((p) => (
                          <p key={p} className="text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>

                      {/* VS */}
                      <div className="relative z-10 flex items-center -mx-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-gradient-to-br from-gold/20 to-ocean-deep shadow-[0_0_24px_rgba(244,163,0,0.3)]">
                          <span className="text-base font-black tracking-wider text-gold drop-shadow-[0_0_8px_rgba(244,163,0,0.5)]">
                            VS
                          </span>
                        </div>
                      </div>

                      {/* Side 2 */}
                      <div className="flex-1 rounded-r-xl border-r-[3px] border-luffy bg-ocean-surface/60 p-4 text-right">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-luffy">Taraf 2</p>
                        <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                          {battle.participantSlugs?.side2.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link key={slug} href={`/characters/${slug}`} className="relative h-14 w-14 overflow-hidden rounded-xl border border-luffy/20 bg-ocean-deep transition-transform hover:scale-110 sm:h-16 sm:w-16">
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="64px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side2.map((p) => (
                          <p key={p} className="text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>
                    </div>

                    {/* Winner */}
                    <div className={`mb-5 overflow-hidden rounded-xl ${
                      isWinner
                        ? 'border border-gold/20 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent'
                        : 'border border-pirate-border/50 bg-ocean-surface'
                    }`}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isWinner ? 'bg-gold/20' : 'bg-ocean-mid'}`}>
                          <Crown className={`h-4 w-4 ${isWinner ? 'text-gold' : 'text-pirate-muted'}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-pirate-muted">
                            {isWinner ? 'Kazanan' : 'Sonuç'}
                          </p>
                          <p className={`text-sm font-extrabold ${isWinner ? 'text-gold' : 'text-pirate-muted'}`}>
                            {winnerName}{isWinner && ' kazandı'}
                          </p>
                        </div>
                        {isWinner && <Trophy className="ml-auto h-5 w-5 text-gold/40" />}
                      </div>
                    </div>

                    {/* Significance */}
                    <p className="mb-4 text-sm font-semibold leading-relaxed text-sea">
                      {battle.significance}
                    </p>

                    {/* Description */}
                    <p className="mb-5 text-sm leading-relaxed text-pirate-muted">
                      {battle.description}
                    </p>

                    {/* Key moments — collapsible timeline */}
                    <div className="rounded-xl border border-pirate-border/50 bg-ocean-surface/40">
                      <button
                        onClick={() => toggleMoments(battle.slug)}
                        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-ocean-surface/60"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gold" />
                          <span className="text-xs font-bold uppercase tracking-wider text-pirate-text">
                            Kilit Anlar
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold">
                            {battle.keyMoments.length}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: momentsOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <ChevronDown className="h-4 w-4 text-pirate-muted" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {momentsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="relative px-4 pb-4 pt-1">
                              {/* Timeline line */}
                              <div
                                className="absolute left-[1.65rem] top-3 bottom-5 w-px"
                                style={{
                                  background: `linear-gradient(180deg, ${catColors.hex}40, transparent)`,
                                }}
                              />

                              <div className="space-y-3">
                                {battle.keyMoments.map((moment, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, ease: EASE, delay: j * 0.06 }}
                                    className="flex gap-3"
                                  >
                                    <div
                                      className="relative z-10 mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border"
                                      style={{
                                        borderColor: `${catColors.hex}50`,
                                        background: `${catColors.hex}15`,
                                      }}
                                    >
                                      <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: catColors.hex }}
                                      />
                                    </div>
                                    <p className="text-sm leading-relaxed text-pirate-muted pt-0.5">
                                      {moment}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <Swords className="mx-auto mb-4 h-12 w-12 text-pirate-muted/30" />
              <p className="text-sm text-pirate-muted">Arama kriterlerine uygun savaş bulunamadı.</p>
            </motion.div>
          )}
        </div>

        <div className="mt-16" />
      </main>
  )
}

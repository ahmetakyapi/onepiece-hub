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
  Skull,
  Target,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { BATTLES, BATTLE_CATEGORIES } from '@/lib/constants/battles'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE, scaleIn } from '@/lib/variants'

const WINNER_LABELS = {
  side1: 'Kazanan: Taraf 1',
  side2: 'Kazanan: Taraf 2',
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

const CATEGORY_GRADIENTS: Record<string, string> = {
  epic: 'from-gold/80 to-gold-bright/60',
  emotional: 'from-sea-light/80 to-sea/60',
  rivalry: 'from-luffy/80 to-red-500/60',
  war: 'from-purple-400/80 to-purple-600/60',
  'turning-point': 'from-emerald-400/80 to-emerald-600/60',
}

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  epic: 'border-gold/40',
  emotional: 'border-sea-light/40',
  rivalry: 'border-luffy/40',
  war: 'border-purple-400/40',
  'turning-point': 'border-emerald-400/40',
}

const CATEGORY_BG_COLORS: Record<string, string> = {
  epic: 'bg-gold/10',
  emotional: 'bg-sea/10',
  rivalry: 'bg-luffy/10',
  war: 'bg-purple-400/10',
  'turning-point': 'bg-emerald-400/10',
}

const HERO_ORBS = [
  { color: 'rgba(231, 76, 60, 0.4)', size: 300, x: '5%', y: '10%', delay: 0 },
  { color: 'rgba(244, 163, 0, 0.35)', size: 250, x: '65%', y: '5%', delay: 1.5 },
  { color: 'rgba(231, 76, 60, 0.25)', size: 200, x: '80%', y: '60%', delay: 3 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 180, x: '20%', y: '70%', delay: 2 },
]

export default function BattlesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedMoments, setExpandedMoments] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    return activeCategory ? BATTLES.filter((b) => b.category === activeCategory) : BATTLES
  }, [activeCategory])

  const categories = Object.entries(BATTLE_CATEGORIES)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of BATTLES) {
      counts[b.category] = (counts[b.category] || 0) + 1
    }
    return counts
  }, [])

  const toggleMoments = (slug: string) => {
    setExpandedMoments((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Hero */}
          <PageHero
            icon={Swords}
            title="Efsanevi"
            subtitle="Savaşlar"
            description="One Piece tarihinin en ikonik dövüşleri ve savaşları. Destansı çatışmalardan duygusal düellolara, her savaş hikayenin gidişatını değiştirdi."
            accentColor="luffy"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 border border-gold/20">
                <Swords className="h-4 w-4 text-gold" />
                <span className="font-semibold text-gold">{BATTLES.length}</span>
                <span className="text-pirate-muted">Savaş</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-luffy/10 px-3 py-1.5 border border-luffy/20">
                <Flame className="h-4 w-4 text-luffy" />
                <span className="font-semibold text-luffy">{categories.length}</span>
                <span className="text-pirate-muted">Kategori</span>
              </div>
            </div>
          </PageHero>

          {/* Category filter cards */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {/* All button */}
            <motion.button
              variants={scaleIn}
              onClick={() => setActiveCategory(null)}
              className={`glass group relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 ${
                !activeCategory
                  ? 'border-gold/40 bg-gold/10 shadow-[0_0_20px_rgba(244,163,0,0.15)]'
                  : 'hover:border-gold/20'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                !activeCategory ? 'bg-gold/20' : 'bg-ocean-surface group-hover:bg-gold/10'
              }`}>
                <Sparkles className={`h-5 w-5 transition-colors ${!activeCategory ? 'text-gold' : 'text-pirate-muted group-hover:text-gold'}`} />
              </div>
              <span className={`text-xs font-bold ${!activeCategory ? 'text-gold' : 'text-pirate-muted group-hover:text-pirate-text'}`}>
                Tümü
              </span>
              <span className={`text-lg font-extrabold ${!activeCategory ? 'text-gold' : 'text-pirate-text'}`}>
                {BATTLES.length}
              </span>
            </motion.button>

            {categories.map(([key, { label, color }]) => {
              const IconComp = CATEGORY_ICONS[key] || Swords
              const isActive = activeCategory === key
              const borderColor = CATEGORY_BORDER_COLORS[key]
              const bgColor = CATEGORY_BG_COLORS[key]
              return (
                <motion.button
                  key={key}
                  variants={scaleIn}
                  onClick={() => setActiveCategory(isActive ? null : key)}
                  className={`glass group relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 ${
                    isActive
                      ? `${borderColor} ${bgColor} shadow-lg`
                      : `hover:${borderColor}`
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    isActive ? `${bgColor}` : 'bg-ocean-surface group-hover:bg-ocean-mid'
                  }`}>
                    <IconComp className={`h-5 w-5 transition-colors ${isActive ? color : 'text-pirate-muted group-hover:' + color}`} />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? color : 'text-pirate-muted group-hover:text-pirate-text'}`}>
                    {label}
                  </span>
                  <span className={`text-lg font-extrabold ${isActive ? 'text-pirate-text' : 'text-pirate-text'}`}>
                    {categoryCounts[key] || 0}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-pirate-border/50 to-transparent" />
            <span className="text-xs font-semibold text-pirate-muted">
              {filtered.length} savaş gösteriliyor
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-pirate-border/50 to-transparent" />
          </motion.div>

          {/* Battles */}
          <div className="space-y-8">
            {filtered.map((battle, i) => {
              const catInfo = BATTLE_CATEGORIES[battle.category]
              const catGradient = CATEGORY_GRADIENTS[battle.category]
              const catBorder = CATEGORY_BORDER_COLORS[battle.category]
              const momentsOpen = expandedMoments[battle.slug] ?? false

              const winnerName =
                battle.winner === 'side1'
                  ? battle.participants.side1.join(', ')
                  : battle.winner === 'side2'
                    ? battle.participants.side2.join(', ')
                    : WINNER_LABELS[battle.winner]

              const isWinnerDecisive = battle.winner === 'side1' || battle.winner === 'side2'

              return (
                <motion.article
                  key={battle.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
                  className="glass group relative overflow-hidden rounded-2xl transition-all duration-300 hover:border-gold/20"
                >
                  {/* Category gradient top border */}
                  <div className={`h-1 w-full bg-gradient-to-r ${catGradient}`} />

                  <div className="p-6 sm:p-8">
                    {/* Header row */}
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${CATEGORY_BG_COLORS[battle.category]} border ${catBorder}`}>
                            <Swords className={`h-4.5 w-4.5 ${catInfo.color}`} />
                          </div>
                          <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                            {battle.name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`chip ${catInfo.color} ${CATEGORY_BG_COLORS[battle.category]} ${catBorder}`}>
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

                    {/* Participants VS section */}
                    <div className="mb-5 flex items-stretch gap-0">
                      {/* Side 1 */}
                      <div className="flex-1 rounded-l-xl border-l-[3px] border-sea bg-ocean-surface/80 p-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sea">
                          Taraf 1
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {battle.participantSlugs?.side1.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link key={slug} href={`/characters/${slug}`} className="relative h-10 w-10 overflow-hidden rounded-lg border border-sea/20 bg-ocean-deep transition-transform hover:scale-110">
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="40px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side1.map((p) => (
                          <p key={p} className="mt-1 text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>

                      {/* VS badge */}
                      <div className="relative z-10 flex items-center -mx-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-gradient-to-br from-gold/20 to-ocean-deep shadow-[0_0_24px_rgba(244,163,0,0.3)]">
                          <span className="text-base font-black tracking-wider text-gold drop-shadow-[0_0_8px_rgba(244,163,0,0.5)]">
                            VS
                          </span>
                        </div>
                      </div>

                      {/* Side 2 */}
                      <div className="flex-1 rounded-r-xl border-r-[3px] border-luffy bg-ocean-surface/80 p-4 text-right">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-luffy">
                          Taraf 2
                        </p>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {battle.participantSlugs?.side2.map((slug) => {
                            const img = getCharacterImage(slug)
                            return img ? (
                              <Link key={slug} href={`/characters/${slug}`} className="relative h-10 w-10 overflow-hidden rounded-lg border border-luffy/20 bg-ocean-deep transition-transform hover:scale-110">
                                <Image src={img} alt={slug} fill className="object-cover object-top" sizes="40px" />
                              </Link>
                            ) : null
                          })}
                        </div>
                        {battle.participants.side2.map((p) => (
                          <p key={p} className="mt-1 text-sm font-bold text-pirate-text">{p}</p>
                        ))}
                      </div>
                    </div>

                    {/* Winner banner */}
                    <div className={`mb-5 overflow-hidden rounded-xl ${
                      isWinnerDecisive
                        ? 'bg-gradient-to-r from-gold/15 via-gold/10 to-transparent border border-gold/20'
                        : 'bg-ocean-surface border border-pirate-border/50'
                    }`}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isWinnerDecisive ? 'bg-gold/20' : 'bg-ocean-mid'
                        }`}>
                          <Crown className={`h-4.5 w-4.5 ${isWinnerDecisive ? 'text-gold' : 'text-pirate-muted'}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-pirate-muted">
                            {isWinnerDecisive ? 'Kazanan' : 'Sonuç'}
                          </p>
                          <p className={`text-sm font-extrabold ${isWinnerDecisive ? 'text-gold' : 'text-pirate-muted'}`}>
                            {winnerName}
                            {isWinnerDecisive && ' kazandı'}
                          </p>
                        </div>
                        {isWinnerDecisive && (
                          <Trophy className="ml-auto h-5 w-5 text-gold/40" />
                        )}
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

                    {/* Key moments - collapsible */}
                    <div className="rounded-xl border border-pirate-border/50 bg-ocean-surface/50">
                      <button
                        onClick={() => toggleMoments(battle.slug)}
                        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-ocean-surface/80"
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
                            <div className="space-y-2 px-4 pb-4 pt-1">
                              {battle.keyMoments.map((moment, j) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, ease: EASE, delay: j * 0.06 }}
                                  className="flex gap-3"
                                >
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-[11px] font-bold text-gold">
                                    {j + 1}
                                  </span>
                                  <p className="text-sm leading-relaxed text-pirate-muted pt-0.5">
                                    {moment}
                                  </p>
                                </motion.div>
                              ))}
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
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

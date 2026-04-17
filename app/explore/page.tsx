'use client'

import { useMemo, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Compass, Sparkles, RefreshCw, Users, Cherry, Map,
  Flame, Swords, Heart, ArrowRight, Star, Anchor,
  Shuffle, Crown, Zap, Trophy,
} from 'lucide-react'
import PageHero from '@/components/wiki/PageHero'
import AmbientBackground from '@/components/ui/AmbientBackground'
import { ARCS, getArcBySlug } from '@/lib/constants/arcs'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import { DEVIL_FRUITS, DEVIL_FRUIT_TYPE_INFO } from '@/lib/constants/devil-fruits'
import { BATTLES, BATTLE_CATEGORIES } from '@/lib/constants/battles'
import { SAGAS } from '@/lib/constants/sagas'
import { getArcImage, getCharacterImage } from '@/lib/constants/images'
import { CREW_COLORS } from '@/lib/constants/crew-styles'
import { parseBounty, formatBounty } from '@/lib/utils'
import { EASE, fadeUp, staggerContainer } from '@/lib/variants'
import { useViewTransition } from '@/hooks/useViewTransition'

const FEATURED_ARC_SLUG = 'wano'
const FEATURED_QUOTE = 'Wano\'nun sınırlarını açın!'
const FEATURED_QUOTE_BY = 'Kozuki Oden'

const HERO_ORBS = [
  { color: 'rgba(244,163,0,0.35)', size: 280, x: '8%', y: '10%', delay: 0 },
  { color: 'rgba(30,144,255,0.3)', size: 220, x: '70%', y: '20%', delay: 1.5 },
  { color: 'rgba(231,76,60,0.25)', size: 180, x: '55%', y: '65%', delay: 3 },
  { color: 'rgba(168,139,250,0.22)', size: 160, x: '30%', y: '75%', delay: 2 },
]

function rand<T>(arr: readonly T[], seed: number): T {
  const idx = Math.abs(Math.floor(seed * arr.length)) % arr.length
  return arr[idx]
}

function buildDiscoveryPicks(seed: number) {
  const r1 = Math.sin(seed) * 10000
  const r2 = Math.sin(seed + 1) * 10000
  const r3 = Math.sin(seed + 2) * 10000
  return {
    character: rand(CHARACTERS, Math.abs(r1 - Math.floor(r1))),
    fruit: rand(DEVIL_FRUITS, Math.abs(r2 - Math.floor(r2))),
    arc: rand(ARCS, Math.abs(r3 - Math.floor(r3))),
  }
}

export default function ExplorePage() {
  const [seed, setSeed] = useState(1)
  const picks = useMemo(() => buildDiscoveryPicks(seed), [seed])
  const reshuffle = useCallback(() => setSeed((s) => s + 1), [])
  const navigate = useViewTransition()

  const featuredArc = getArcBySlug(FEATURED_ARC_SLUG)
  const featuredImg = featuredArc ? getArcImage(featuredArc.slug) : ''
  const featuredHref = featuredArc && featuredArc.episodes[0]
    ? `/arcs/${featuredArc.slug}/${featuredArc.episodes[0].slug}`
    : `/arcs/${featuredArc?.slug ?? ''}`

  // Top 3 battles by combined score
  const topBattles = useMemo(() => {
    return [...BATTLES]
      .sort((a, b) => (b.powerLevel + b.emotionalWeight) - (a.powerLevel + a.emotionalWeight))
      .slice(0, 3)
  }, [])

  const spotlightRef = useRef<HTMLDivElement>(null)
  const spotlightInView = useInView(spotlightRef, { once: true, margin: '-80px' })

  const charImg = picks.character ? getCharacterImage(picks.character.slug) : ''
  const fruitUserImg = picks.fruit.userSlug ? getCharacterImage(picks.fruit.userSlug) : ''
  const arcImg = getArcImage(picks.arc.slug)

  return (
    <main className="relative min-h-screen pt-24">
      <AmbientBackground theme="adventure" intensity="normal" />

      <div className="mx-auto max-w-6xl px-6">
        <PageHero
          icon={Compass}
          title="Keşfet"
          subtitle="Grand Line Rotaları"
          accentColor="gold"
          orbs={HERO_ORBS}
        >
          <p className="max-w-xl text-sm leading-relaxed text-pirate-muted sm:text-base">
            Bugün hangi hazineyi bulacağını bilmiyor musun? Editoryal seçkilerimiz,
            tesadüfi keşifler ve rota önerileriyle One Piece evrenine yeni bir kapıdan gir.
          </p>
        </PageHero>

        {/* ─── Editor's Pick: Featured Arc ──────────────────────── */}
        {featuredArc && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-16"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08]">
                <Star className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                  Editörün Seçimi
                </p>
                <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                  Gear 5&apos;in Uyanışı
                </h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-pirate-border/20 bg-ocean-surface/30 shadow-[0_40px_120px_rgba(2,6,23,0.55)] sm:rounded-3xl">
              <div className="relative h-[68vh] min-h-[400px] w-full overflow-hidden sm:h-[64vh] sm:min-h-[440px]">
                {featuredImg && (
                  <div className="absolute inset-0">
                    <Image
                      src={featuredImg}
                      alt={featuredArc.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/25 via-ocean-deep/45 to-ocean-deep" />
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/60 via-transparent to-ocean-deep/40" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/[0.1] blur-[80px]" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-luffy/[0.06] blur-[80px]" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {featuredArc.saga && (
                        <span className="tag border-gold/30 bg-gold/[0.12] text-gold">
                          {featuredArc.saga.toUpperCase()}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-sea/25 bg-ocean-deep/60 px-2.5 py-0.5 text-[10px] font-bold text-sea backdrop-blur-md">
                        <Anchor className="h-2.5 w-2.5" />
                        {featuredArc.episodeCount} Bölüm
                      </span>
                    </div>
                    <h3 className="mb-2 text-3xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:mb-3 sm:text-5xl md:text-6xl">
                      {featuredArc.name}
                    </h3>
                    <p className="mb-4 line-clamp-3 max-w-xl text-[13px] leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:mb-5 sm:line-clamp-none sm:text-base">
                      {featuredArc.summary}
                    </p>
                    <div className="mb-5 rounded-xl border-l-2 border-gold/40 bg-ocean-deep/40 p-2.5 backdrop-blur-sm sm:mb-6 sm:p-3">
                      <p className="text-[13px] italic text-white/85 sm:text-base">&ldquo;{FEATURED_QUOTE}&rdquo;</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-gold/70 sm:text-[10px]">
                        — {FEATURED_QUOTE_BY}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Link
                        href={featuredHref}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                          e.preventDefault()
                          navigate(featuredHref)
                        }}
                        className="btn-gold group"
                      >
                        <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                        Wano&apos;ya Başla
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href={`/arcs/${featuredArc.slug}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                          e.preventDefault()
                          navigate(`/arcs/${featuredArc.slug}`)
                        }}
                        className="btn-ghost group"
                      >
                        Arc Detayı
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ─── Bugünün Keşfi: Random Picks ─────────────────────── */}
        <motion.section
          ref={spotlightRef}
          initial={{ opacity: 0, y: 24 }}
          animate={spotlightInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sea/25 bg-sea/[0.08]">
                <Sparkles className="h-5 w-5 text-sea" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sea">
                  Tesadüfi Keşif
                </p>
                <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                  Bugün Keşfet
                </h2>
              </div>
            </div>
            <button
              onClick={reshuffle}
              className="btn-ghost group text-xs sm:text-sm"
              aria-label="Yeniden karıştır"
            >
              <Shuffle className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
              Karıştır
            </button>
          </div>

          <motion.div
            key={seed}
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-3"
          >
            {/* Random Character */}
            <motion.div variants={fadeUp}>
              <Link
                href={`/characters/${picks.character.slug}`}
                className="bento-card group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:border-sea/20"
              >
                <div className="relative h-48 overflow-hidden bg-ocean-surface">
                  {charImg && (
                    <Image
                      src={charImg}
                      alt={picks.character.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 ease-expo-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-sea/30 bg-ocean-deep/60 px-2.5 py-0.5 text-[10px] font-bold text-sea backdrop-blur-md">
                    <Users className="mr-1 inline h-2.5 w-2.5" />
                    Karakter
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-lg font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {picks.character.name}
                    </p>
                    {picks.character.epithet && (
                      <p className="text-xs italic text-gold/80">&ldquo;{picks.character.epithet}&rdquo;</p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
                    {picks.character.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`tag ${(CREW_COLORS[picks.character.crew] || CREW_COLORS.other).bg} ${(CREW_COLORS[picks.character.crew] || CREW_COLORS.other).text} ${(CREW_COLORS[picks.character.crew] || CREW_COLORS.other).border}`}>
                      {CREW_LABELS[picks.character.crew]}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-sea" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Random Fruit */}
            <motion.div variants={fadeUp}>
              <Link
                href={`/devil-fruits/${picks.fruit.slug}`}
                className="bento-card group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:border-purple-500/25"
              >
                <div className={`relative h-48 overflow-hidden ${DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.bg ?? 'bg-purple-500/10'}`}>
                  {fruitUserImg ? (
                    <Image
                      src={fruitUserImg}
                      alt={picks.fruit.user}
                      fill
                      className="object-cover object-top transition-transform duration-700 ease-expo-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Cherry className={`h-20 w-20 opacity-20 ${DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.color ?? 'text-purple-400'}`} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />
                  <span className={`absolute left-3 top-3 rounded-full border border-purple-400/30 bg-ocean-deep/60 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.color ?? 'text-purple-400'}`}>
                    <Cherry className="mr-1 inline h-2.5 w-2.5" />
                    Meyve
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-lg font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {picks.fruit.name}
                    </p>
                    <p className="text-xs text-white/70">{picks.fruit.meaning}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
                    {picks.fruit.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`tag border-purple-500/20 ${DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.bg ?? 'bg-purple-500/10'} ${DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.color ?? 'text-purple-400'}`}>
                      {DEVIL_FRUIT_TYPE_INFO[picks.fruit.type]?.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-purple-400" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Random Arc */}
            <motion.div variants={fadeUp}>
              <Link
                href={`/arcs/${picks.arc.slug}`}
                className="bento-card group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:border-gold/25"
              >
                <div className="relative h-48 overflow-hidden bg-ocean-surface">
                  {arcImg && (
                    <Image
                      src={arcImg}
                      alt={picks.arc.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-expo-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-ocean-deep/60 px-2.5 py-0.5 text-[10px] font-bold text-gold backdrop-blur-md">
                    <Compass className="mr-1 inline h-2.5 w-2.5" />
                    Arc
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-lg font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {picks.arc.name}
                    </p>
                    <p className="text-xs text-white/70">{picks.arc.episodeCount} bölüm</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
                    {picks.arc.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    {picks.arc.saga && (
                      <span className="tag border-gold/20 bg-gold/[0.08] text-gold/70">
                        {picks.arc.saga.toUpperCase()}
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ─── Efsanevi Savaş Üçlüsü ───────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-luffy/25 bg-luffy/[0.08]">
              <Swords className="h-5 w-5 text-luffy" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-luffy">
                Serinin Zirvesi
              </p>
              <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                Üç Efsanevi Düello
              </h2>
            </div>
            <Link href="/battles" className="hidden text-xs font-semibold text-pirate-muted transition-colors hover:text-gold sm:flex sm:items-center sm:gap-1">
              Tüm savaşlar
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {topBattles.map((battle, i) => {
              const info = BATTLE_CATEGORIES[battle.category]
              const medalColor = i === 0 ? 'text-gold' : i === 1 ? 'text-pirate-text/70' : 'text-amber-600'
              const medalBg = i === 0 ? 'bg-gold/10 border-gold/25' : i === 1 ? 'bg-pirate-text/[0.06] border-pirate-text/20' : 'bg-amber-700/10 border-amber-700/25'
              return (
                <Link
                  key={battle.slug}
                  href="/battles"
                  className="bento-card group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:border-luffy/20"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${medalBg}`}>
                    <Trophy className={`h-4 w-4 ${medalColor}`} />
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    <span className={`tag ${info.color}`}>
                      {info.label}
                    </span>
                    <span className="tag border-sea/20 bg-sea/[0.08] text-sea/80">
                      {battle.arc}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-extrabold text-pirate-text transition-colors group-hover:text-gold sm:text-lg">
                    {battle.name}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-pirate-muted">
                    {battle.significance}
                  </p>

                  <div className="mt-auto space-y-2">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[10px]">
                        <Zap className="h-2.5 w-2.5 text-gold" />
                        <span className="font-semibold text-pirate-muted">Güç</span>
                        <span className="ml-auto font-bold text-gold">{battle.powerLevel}/5</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ocean-surface">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold-bright animate-grow-bar"
                          style={{ width: `${(battle.powerLevel / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[10px]">
                        <Heart className="h-2.5 w-2.5 text-luffy" />
                        <span className="font-semibold text-pirate-muted">Duygu</span>
                        <span className="ml-auto font-bold text-luffy">{battle.emotionalWeight}/5</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ocean-surface">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-luffy/80 to-red-400 animate-grow-bar"
                          style={{ width: `${(battle.emotionalWeight / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.section>

        {/* ─── Saga Rotaları ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sea/25 bg-sea/[0.08]">
              <Map className="h-5 w-5 text-sea" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sea">
                Grand Line Rotası
              </p>
              <h2 className="text-xl font-extrabold text-pirate-text sm:text-2xl">
                10 Saga — 36 Arc
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SAGAS.map((saga, i) => {
              const arcCount = ARCS.filter((a) => a.saga === saga.slug).length
              return (
                <Link
                  key={saga.slug}
                  href="/arcs"
                  className="bento-card group relative flex items-center gap-3 overflow-hidden rounded-xl p-4 transition-all duration-500 hover:border-sea/20"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sea/[0.08] border border-sea/15">
                    <span className="text-sm font-extrabold text-sea stat-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                      {saga.name}
                    </p>
                    <p className="text-[11px] text-pirate-muted/70">{arcCount} arc</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-pirate-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-sea" />
                </Link>
              )
            })}
          </div>
        </motion.section>
      </div>

      <div className="mt-8" />
    </main>
  )
}

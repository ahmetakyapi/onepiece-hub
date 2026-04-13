'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Play, Tv, Film, ArrowRight, ChevronDown, ChevronUp,
  Compass, Anchor, Sparkles, Star, Zap, Ship,
  Crown, Flame, Skull, Heart, Eye, Swords, Globe,
  CheckCircle2, ExternalLink, BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const EASE = [0.16, 1, 0.3, 1] as const

/* ─── Data ────────────────────────────────────────────────────────────── */

type GuideStep = {
  id: string
  label: string
  title: string
  episodes: string
  duration: string
  description: string
  icon: typeof Play
  color: string
  bgGrad: string
  borderColor: string
  highlights: string[]
  arcSlugs: string[]
}

const FULL_ANIME_PATH: GuideStep[] = [
  {
    id: 'east-blue',
    label: 'SAGA 1',
    title: 'East Blue',
    episodes: 'Arc 1-6',
    duration: '~61 bölüm',
    description: 'Luffy\'nin macerası burada başlıyor. Hasır Şapka mürettebatının ilk üyelerini topladığı, Grand Line\'a girmeden önceki efsanevi başlangıç.',
    icon: Anchor,
    color: 'text-sea',
    bgGrad: 'from-sea/20 to-sea/5',
    borderColor: 'border-sea/20',
    highlights: ['Luffy\'nin hikayesi', 'Zoro, Nami, Usopp, Sanji katılır', 'Arlong Park — ilk büyük duygusal doruk'],
    arcSlugs: ['romance-dawn', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown'],
  },
  {
    id: 'alabasta',
    label: 'SAGA 2',
    title: 'Alabasta',
    episodes: 'Arc 7-11',
    duration: '~63 bölüm',
    description: 'Grand Line\'a giriş! Chopper mürettebata katılır. Vivi\'nin krallığını kurtarmak için Crocodile\'a karşı destansı savaş.',
    icon: Globe,
    color: 'text-gold',
    bgGrad: 'from-gold/20 to-gold/5',
    borderColor: 'border-gold/20',
    highlights: ['Chopper katılır', 'Crocodile vs Luffy', 'Vivi\'nin fedakarlığı', 'Robin mürettebata katılır'],
    arcSlugs: ['reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'arabasta'],
  },
  {
    id: 'sky-island',
    label: 'SAGA 3',
    title: 'Sky Island',
    episodes: 'Arc 12-13',
    duration: '~43 bölüm',
    description: 'Gökyüzü adası Skypiea! Enel ile efsanevi savaş ve One Piece evreninin derinliklerini keşfettiğin büyüleyici macera.',
    icon: Sparkles,
    color: 'text-cyan-400',
    bgGrad: 'from-cyan-400/20 to-cyan-400/5',
    borderColor: 'border-cyan-400/20',
    highlights: ['Skypiea — gökyüzü adası', 'Enel vs Luffy', 'Poneglyph\'ler ve kayıp tarih'],
    arcSlugs: ['jaya', 'skypiea'],
  },
  {
    id: 'water-7',
    label: 'SAGA 4',
    title: 'Water 7 & Enies Lobby',
    episodes: 'Arc 14-17',
    duration: '~80 bölüm',
    description: 'One Piece\'in en duygusal ve aksiyonlu sagası. Going Merry\'nin vedası, Robin\'in geçmişi ve Franky\'nin katılımı.',
    icon: Heart,
    color: 'text-luffy',
    bgGrad: 'from-luffy/20 to-luffy/5',
    borderColor: 'border-luffy/20',
    highlights: ['Franky katılır', 'Robin\'in "Yaşamak istiyorum!" sahnesi', 'CP9 vs Hasır Şapkalar', 'Going Merry\'ye veda'],
    arcSlugs: ['long-ring-long-land', 'water-seven', 'enies-lobby', 'post-enies-lobby'],
  },
  {
    id: 'thriller-bark',
    label: 'SAGA 5',
    title: 'Thriller Bark',
    episodes: 'Arc 18',
    duration: '~24 bölüm',
    description: 'Brook mürettebata katılır! Moria\'nın dev gemi adasında korku ve komedi dolu macera.',
    icon: Skull,
    color: 'text-purple-400',
    bgGrad: 'from-purple-400/20 to-purple-400/5',
    borderColor: 'border-purple-400/20',
    highlights: ['Brook katılır', 'Zoro\'nun efsanevi fedakarlığı', '"Hiçbir şey olmadı" sahnesi'],
    arcSlugs: ['thriller-bark'],
  },
  {
    id: 'summit-war',
    label: 'SAGA 6',
    title: 'Summit War',
    episodes: 'Arc 19-23',
    duration: '~79 bölüm',
    description: 'One Piece\'in en epik sagası. Ace\'i kurtarmak için Impel Down\'a iniş, Marineford Savaşı ve serinin dönüm noktası.',
    icon: Flame,
    color: 'text-orange-400',
    bgGrad: 'from-orange-400/20 to-orange-400/5',
    borderColor: 'border-orange-400/20',
    highlights: ['Impel Down cezaevi kaçışı', 'Marineford — tüm güçlerin savaşı', 'Ace\'in kaderi', '2 yıllık eğitim'],
    arcSlugs: ['sabaody-archipelago', 'amazon-lily', 'impel-down', 'marineford', 'post-war'],
  },
  {
    id: 'fish-man-island',
    label: 'SAGA 7',
    title: 'Fish-Man Island',
    episodes: 'Arc 24-25',
    duration: '~32 bölüm',
    description: '2 yıllık eğitim sonrası mürettebat yeniden bir araya gelir! Denizaltı macerası ve Jinbe ile tanışma.',
    icon: Ship,
    color: 'text-teal-400',
    bgGrad: 'from-teal-400/20 to-teal-400/5',
    borderColor: 'border-teal-400/20',
    highlights: ['Mürettebat güçlenerek geri döner', 'Fish-Man Island', 'Jinbe ile ittifak'],
    arcSlugs: ['return-to-sabaody', 'fish-man-island'],
  },
  {
    id: 'dressrosa',
    label: 'SAGA 8',
    title: 'Dressrosa',
    episodes: 'Arc 26-27',
    duration: '~69 bölüm',
    description: 'Doflamingo\'nun imparatorluğuna karşı dev savaş! Law ile ittifak ve Gear 4\'ün ilk kullanımı.',
    icon: Swords,
    color: 'text-rose-400',
    bgGrad: 'from-rose-400/20 to-rose-400/5',
    borderColor: 'border-rose-400/20',
    highlights: ['Law-Luffy ittifakı', 'Doflamingo vs Luffy — Gear 4', 'Hasır Şapka Büyük Filosu kurulur'],
    arcSlugs: ['punk-hazard', 'dressrosa'],
  },
  {
    id: 'four-emperors',
    label: 'SAGA 9',
    title: 'Four Emperors',
    episodes: 'Arc 28-31',
    duration: '~130 bölüm',
    description: 'İmparatorlara meydan okuma! Whole Cake Island\'da Big Mom, Wano\'da Kaido ile destansı savaşlar.',
    icon: Crown,
    color: 'text-gold-bright',
    bgGrad: 'from-gold-bright/20 to-gold-bright/5',
    borderColor: 'border-gold-bright/20',
    highlights: ['Sanji\'nin geçmişi ve kurtarılması', 'Wano — samuray ülkesi', 'Kaido vs Luffy — Gear 5', 'Luffy Yonko olur'],
    arcSlugs: ['zou', 'whole-cake-island', 'reverie', 'wano'],
  },
  {
    id: 'final',
    label: 'SAGA 10',
    title: 'Final Saga',
    episodes: 'Arc 32+',
    duration: 'Devam ediyor',
    description: 'Son saga başladı! Vegapunk, Dünya Hükümeti\'nin sırları ve One Piece\'e giden yolun son adımları.',
    icon: Star,
    color: 'text-amber-300',
    bgGrad: 'from-amber-300/20 to-amber-300/5',
    borderColor: 'border-amber-300/20',
    highlights: ['Egghead — Vegapunk adası', 'Dünya Hükümeti\'nin sırları', 'Void Century ortaya çıkıyor'],
    arcSlugs: ['egghead'],
  },
]

type NetflixStep = {
  id: string
  season: string
  title: string
  covers: string
  description: string
  animeEquivalent: string
  arcSlugs: string[]
}

const NETFLIX_PATH: NetflixStep[] = [
  {
    id: 'netflix-s1',
    season: 'Sezon 1',
    title: 'Netflix Live Action — Sezon 1',
    covers: 'East Blue Saga (Romance Dawn → Arlong Park)',
    description: 'Live action seri, East Blue sagasının büyük bölümünü kapsıyor. Luffy, Zoro, Nami, Usopp ve Sanji\'nin hikayesi.',
    animeEquivalent: 'Anime Arc 1-5 (Romance Dawn — Arlong Park)',
    arcSlugs: ['romance-dawn', 'orange-town', 'syrup-village', 'baratie', 'arlong-park'],
  },
  {
    id: 'netflix-s2',
    season: 'Sezon 2',
    title: 'Netflix Live Action — Sezon 2',
    covers: 'Loguetown + Alabasta Saga başlangıcı',
    description: 'Grand Line\'a giriş ve Alabasta sagasının başlangıç arc\'ları. Chopper\'ın katılımı ve çöl macerası.',
    animeEquivalent: 'Anime Arc 6-11 (Loguetown — Alabasta)',
    arcSlugs: ['loguetown', 'reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'arabasta'],
  },
]

const CONTINUE_AFTER_NETFLIX: GuideStep[] = FULL_ANIME_PATH.filter(
  (step) => ['sky-island', 'water-7', 'thriller-bark', 'summit-war', 'fish-man-island', 'dressrosa', 'four-emperors', 'final'].includes(step.id)
)

/* ─── Components ──────────────────────────────────────────────────────── */

function SagaStep({ step, index, isLast }: { step: GuideStep; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.08, 0.4) }}
      className="relative"
    >
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-pirate-border/30 via-pirate-border/15 to-transparent sm:left-8" />
      )}

      <div
        className={`bento-card group relative overflow-hidden transition-all duration-500 ${expanded ? 'ring-1 ring-white/[0.06]' : ''}`}
      >
        {/* Top gradient accent */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${step.color.replace('text-', 'via-')}/30 to-transparent`} />

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start gap-4 p-4 text-left sm:items-center sm:gap-5 sm:p-5"
        >
          {/* Step icon */}
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.bgGrad} border ${step.borderColor} transition-transform duration-500 group-hover:scale-105 sm:h-14 sm:w-14`}>
            <step.icon className={`h-5 w-5 ${step.color} sm:h-6 sm:w-6`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${step.color}/70`}>
                {step.label}
              </span>
              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-pirate-muted/60">
                {step.duration}
              </span>
            </div>
            <h3 className="text-base font-bold text-pirate-text transition-colors group-hover:text-white sm:text-lg">
              {step.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-pirate-muted/70 sm:text-sm">
              {step.description}
            </p>
          </div>

          {/* Expand toggle */}
          <div className="flex-shrink-0 text-pirate-muted/40 transition-colors group-hover:text-pirate-muted">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, ease: EASE }}
            className="border-t border-pirate-border/20 px-4 pb-4 sm:px-5 sm:pb-5"
          >
            <div className="pt-4">
              {/* Highlights */}
              <div className="mb-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-pirate-muted/50">
                  Neler olacak?
                </p>
                <div className="space-y-2">
                  {step.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2">
                      <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${step.color}`} />
                      <span className="text-xs text-pirate-muted sm:text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arc links */}
              <div className="flex flex-wrap gap-2">
                {step.arcSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/arcs/${slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-pirate-border/30 bg-ocean-surface/30 px-3 py-1.5 text-[11px] font-medium text-pirate-muted transition-all hover:border-gold/20 hover:text-gold"
                  >
                    <Play className="h-3 w-3" />
                    {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'scratch' | 'netflix'>('scratch')
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-28 sm:pt-32">
        {/* Decorative background orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-[20%] h-[500px] w-[500px] rounded-full bg-gold/[0.03] blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] h-[400px] w-[400px] rounded-full bg-sea/[0.03] blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-luffy/[0.02] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6">
          {/* ─── Hero Section ──────────────────────────────────────── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 32 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-12 text-center sm:mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 backdrop-blur-md"
            >
              <Compass className="h-3.5 w-3.5 text-gold" />
              <span className="text-[11px] font-semibold tracking-wide text-gold">YOLCULUK BAŞLIYOR</span>
            </motion.div>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-gold-gradient">One Piece</span>{' '}
              <span className="text-pirate-text">İzleme Rehberi</span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-pirate-muted sm:text-base">
              Nereden başlayacağını bilmiyor musun? Sıfırdan başla ya da Netflix
              Live Action izlediysen kaldığın yerden devam et. Seni adım adım
              yönlendiriyoruz.
            </p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.6 }}
              className="mx-auto mt-8 h-px w-32 origin-center"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(244,163,0,0.4), rgba(30,144,255,0.4), transparent)' }}
            />
          </motion.div>

          {/* ─── Tab Selector ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            className="mb-10 flex justify-center"
          >
            <div className="inline-flex rounded-2xl border border-pirate-border/30 bg-ocean-surface/30 p-1 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('scratch')}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'scratch'
                    ? 'bg-gold/[0.12] text-gold shadow-[0_0_20px_rgba(244,163,0,0.08)]'
                    : 'text-pirate-muted hover:text-pirate-text'
                }`}
              >
                <Film className="h-4 w-4" />
                <span className="hidden sm:inline">Sıfırdan Başla</span>
                <span className="sm:hidden">Sifirdan</span>
              </button>
              <button
                onClick={() => setActiveTab('netflix')}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'netflix'
                    ? 'bg-luffy/[0.12] text-luffy shadow-[0_0_20px_rgba(231,76,60,0.08)]'
                    : 'text-pirate-muted hover:text-pirate-text'
                }`}
              >
                <Tv className="h-4 w-4" />
                <span className="hidden sm:inline">Netflix Sonrası</span>
                <span className="sm:hidden">Netflix</span>
              </button>
            </div>
          </motion.div>

          {/* ─── Scratch Path ──────────────────────────────────────── */}
          {activeTab === 'scratch' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Intro card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="bento-card mb-8 overflow-hidden p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-sea/10 border border-gold/15">
                    <Zap className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="mb-1 text-lg font-bold text-pirate-text">Sıfırdan Anime Yolu</h2>
                    <p className="text-sm text-pirate-muted">
                      One Piece&apos;i en başından izlemek istiyorsan bu yol sana göre.
                      Her saga özet bilgisi ve hangi arc&apos;ları içerdiğini görebilirsin.
                      Filler&apos;sız, saf hikaye.
                    </p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-ocean-surface/40 p-3 text-center">
                    <p className="text-lg font-extrabold text-gold stat-number">10</p>
                    <p className="text-[10px] font-medium text-pirate-muted/60">Saga</p>
                  </div>
                  <div className="rounded-xl bg-ocean-surface/40 p-3 text-center">
                    <p className="text-lg font-extrabold text-sea stat-number">32</p>
                    <p className="text-[10px] font-medium text-pirate-muted/60">Arc</p>
                  </div>
                  <div className="rounded-xl bg-ocean-surface/40 p-3 text-center">
                    <p className="text-lg font-extrabold text-luffy stat-number">580+</p>
                    <p className="text-[10px] font-medium text-pirate-muted/60">Bölüm</p>
                  </div>
                </div>
              </motion.div>

              {/* Steps */}
              <div className="space-y-4">
                {FULL_ANIME_PATH.map((step, i) => (
                  <SagaStep key={step.id} step={step} index={i} isLast={i === FULL_ANIME_PATH.length - 1} />
                ))}
              </div>

              {/* CTA at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-10 text-center"
              >
                <Link href="/arcs/romance-dawn" className="btn-gold group inline-flex text-sm sm:text-base">
                  <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Hemen Başla: Romance Dawn
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* ─── Netflix Path ──────────────────────────────────────── */}
          {activeTab === 'netflix' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Netflix intro */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="bento-card mb-8 overflow-hidden p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-luffy/20 to-luffy/5 border border-luffy/15">
                    <Tv className="h-6 w-6 text-luffy" />
                  </div>
                  <div>
                    <h2 className="mb-1 text-lg font-bold text-pirate-text">Netflix Live Action Sonrası</h2>
                    <p className="text-sm text-pirate-muted">
                      Netflix&apos;te One Piece Live Action izledin ve anime ile devam etmek mi
                      istiyorsun? Aşağıda Live Action&apos;ın hangi anime arc&apos;larını kapsamadığını
                      ve nereden devam etmen gerektiğini görüyorsun.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* What Netflix covers */}
              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-pirate-muted/70">
                  <Eye className="h-4 w-4 text-luffy/60" />
                  Netflix&apos;te İzlediklerin
                </h3>

                <div className="space-y-3">
                  {NETFLIX_PATH.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                      className="bento-card overflow-hidden p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-luffy/10 border border-luffy/15">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full bg-luffy/10 px-2 py-0.5 text-[10px] font-bold text-luffy">
                              {item.season}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold">İZLEDİN</span>
                          </div>
                          <h4 className="text-sm font-bold text-pirate-text sm:text-base">{item.title}</h4>
                          <p className="mt-1 text-xs text-pirate-muted/70">{item.description}</p>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sea/70">
                            <BookOpen className="h-3 w-3" />
                            <span>Kapsam: {item.covers}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Transition banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative mb-6 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/[0.06] via-gold/[0.03] to-sea/[0.06] p-5 sm:p-6"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,163,0,0.08),transparent_60%)]" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gold/15 border border-gold/20">
                    <ArrowRight className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gold sm:text-lg">Buradan Devam Et</h3>
                    <p className="text-sm text-pirate-muted">
                      Netflix Live Action 2. sezon sonrası anime ile Sky Island Saga&apos;dan
                      devam edebilirsin. Aşağıdaki adımları takip et.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Continue steps */}
              <div className="space-y-4">
                {CONTINUE_AFTER_NETFLIX.map((step, i) => (
                  <SagaStep key={step.id} step={step} index={i} isLast={i === CONTINUE_AFTER_NETFLIX.length - 1} />
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-10 text-center"
              >
                <Link href="/arcs/jaya" className="btn-gold group inline-flex text-sm sm:text-base">
                  <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Devam Et: Jaya Arc
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* ─── Bottom Info ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-16 mb-8 text-center"
          >
            <div className="bento-card inline-flex items-center gap-3 rounded-2xl px-5 py-3">
              <Sparkles className="h-4 w-4 text-gold/60" />
              <p className="text-xs text-pirate-muted sm:text-sm">
                Tüm bölümler filler&apos;sız, OnePaceTR ile izlenebilir.{' '}
                <Link href="/arcs" className="text-gold transition-colors hover:text-gold-bright">
                  Arc Haritası&apos;na git
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

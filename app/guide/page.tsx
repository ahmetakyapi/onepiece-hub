'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion'
import {
  Play, Tv, Film, ArrowRight, ChevronDown,
  Compass, Anchor, Sparkles, Star, Zap, Ship,
  Crown, Flame, Skull, Heart, Eye, Swords, Globe,
  CheckCircle2, BookOpen, MapPin
} from 'lucide-react'
import Link from 'next/link'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Types ───────────────────────────────────────────────────────────── */

type GuideStep = {
  id: string
  num: number
  title: string
  episodes: string
  duration: string
  description: string
  icon: typeof Play
  color: string
  hex: string
  highlights: string[]
  arcSlugs: string[]
}

type NetflixStep = {
  id: string
  season: string
  title: string
  covers: string
  description: string
  arcSlugs: string[]
}

/* ─── Data ────────────────────────────────────────────────────────────── */

const FULL_PATH: GuideStep[] = [
  {
    id: 'east-blue', num: 1,
    title: 'East Blue',
    episodes: '6 Arc', duration: '~61 bölüm',
    description: 'Luffy\'nin macerası burada başlıyor. Hasır Şapka mürettebatının ilk üyelerini topladığı efsanevi başlangıç.',
    icon: Anchor, color: 'text-sea', hex: '#1e90ff',
    highlights: ['Luffy\'nin hikayesi başlıyor', 'Zoro, Nami, Usopp, Sanji katılır', 'Arlong Park — ilk büyük duygusal doruk'],
    arcSlugs: ['romance-dawn', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown'],
  },
  {
    id: 'alabasta', num: 2,
    title: 'Alabasta',
    episodes: '5 Arc', duration: '~63 bölüm',
    description: 'Grand Line\'a giriş! Chopper katılır. Vivi\'nin krallığı için Crocodile\'a karşı destansı savaş.',
    icon: Globe, color: 'text-gold', hex: '#f4a300',
    highlights: ['Chopper katılır', 'Crocodile vs Luffy', 'Vivi\'nin fedakarlığı', 'Robin mürettebata katılır'],
    arcSlugs: ['reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'arabasta'],
  },
  {
    id: 'sky-island', num: 3,
    title: 'Sky Island',
    episodes: '2 Arc', duration: '~43 bölüm',
    description: 'Gökyüzü adası Skypiea! Enel ile efsanevi savaş ve One Piece evreninin derinlikleri.',
    icon: Sparkles, color: 'text-cyan-400', hex: '#22d3ee',
    highlights: ['Skypiea — gökyüzü adası', 'Enel vs Luffy', 'Poneglyph\'ler ve kayıp tarih'],
    arcSlugs: ['jaya', 'skypiea'],
  },
  {
    id: 'water-7', num: 4,
    title: 'Water 7 & Enies Lobby',
    episodes: '4 Arc', duration: '~80 bölüm',
    description: 'One Piece\'in en duygusal sagası. Robin\'in geçmişi, Going Merry\'nin vedası.',
    icon: Heart, color: 'text-luffy', hex: '#e74c3c',
    highlights: ['Franky katılır', 'Robin\'in "Yaşamak istiyorum!" sahnesi', 'CP9 vs Hasır Şapkalar', 'Going Merry\'ye veda'],
    arcSlugs: ['long-ring-long-land', 'water-seven', 'enies-lobby', 'post-enies-lobby'],
  },
  {
    id: 'thriller-bark', num: 5,
    title: 'Thriller Bark',
    episodes: '1 Arc', duration: '~24 bölüm',
    description: 'Brook mürettebata katılır! Moria\'nın dev gemi adasında korku ve komedi.',
    icon: Skull, color: 'text-purple-400', hex: '#a855f7',
    highlights: ['Brook katılır', 'Zoro\'nun efsanevi fedakarlığı', '"Hiçbir şey olmadı" sahnesi'],
    arcSlugs: ['thriller-bark'],
  },
  {
    id: 'summit-war', num: 6,
    title: 'Summit War',
    episodes: '5 Arc', duration: '~79 bölüm',
    description: 'En epik saga. Ace\'i kurtarmak için Impel Down, Marineford Savaşı ve serinin dönüm noktası.',
    icon: Flame, color: 'text-orange-400', hex: '#fb923c',
    highlights: ['Impel Down cezaevi kaçışı', 'Marineford — tüm güçlerin savaşı', 'Ace\'in kaderi', '2 yıllık eğitim'],
    arcSlugs: ['sabaody-archipelago', 'amazon-lily', 'impel-down', 'marineford', 'post-war'],
  },
  {
    id: 'fish-man-island', num: 7,
    title: 'Fish-Man Island',
    episodes: '2 Arc', duration: '~32 bölüm',
    description: '2 yıllık eğitim sonrası mürettebat geri döner! Denizaltı macerası ve Jinbe.',
    icon: Ship, color: 'text-teal-400', hex: '#2dd4bf',
    highlights: ['Mürettebat güçlenerek geri döner', 'Fish-Man Island', 'Jinbe ile ittifak'],
    arcSlugs: ['return-to-sabaody', 'fish-man-island'],
  },
  {
    id: 'dressrosa', num: 8,
    title: 'Dressrosa',
    episodes: '2 Arc', duration: '~69 bölüm',
    description: 'Doflamingo\'nun imparatorluğuna karşı dev savaş! Law ittifakı ve Gear 4.',
    icon: Swords, color: 'text-rose-400', hex: '#fb7185',
    highlights: ['Law-Luffy ittifakı', 'Doflamingo vs Luffy — Gear 4', 'Hasır Şapka Büyük Filosu kurulur'],
    arcSlugs: ['punk-hazard', 'dressrosa'],
  },
  {
    id: 'four-emperors', num: 9,
    title: 'Four Emperors',
    episodes: '4 Arc', duration: '~130 bölüm',
    description: 'İmparatorlara meydan okuma! Big Mom, Kaido ve destansı Wano savaşı.',
    icon: Crown, color: 'text-gold-bright', hex: '#fbbf24',
    highlights: ['Sanji\'nin geçmişi ve kurtarılması', 'Wano — samuray ülkesi', 'Kaido vs Luffy — Gear 5', 'Luffy Yonko olur'],
    arcSlugs: ['zou', 'whole-cake-island', 'reverie', 'wano'],
  },
  {
    id: 'final', num: 10,
    title: 'Final Saga',
    episodes: '1+ Arc', duration: 'Devam ediyor',
    description: 'Son saga! Vegapunk, Dünya Hükümeti sırları ve One Piece\'e giden yol.',
    icon: Star, color: 'text-amber-300', hex: '#fcd34d',
    highlights: ['Egghead — Vegapunk adası', 'Dünya Hükümeti\'nin sırları', 'Void Century ortaya çıkıyor'],
    arcSlugs: ['egghead'],
  },
]

const NETFLIX_PATH: NetflixStep[] = [
  {
    id: 'netflix-s1', season: 'Sezon 1',
    title: 'Netflix Live Action — Sezon 1',
    covers: 'East Blue Saga (Romance Dawn → Arlong Park)',
    description: 'Live action seri, East Blue sagasının büyük bölümünü kapsıyor. Luffy, Zoro, Nami, Usopp ve Sanji\'nin hikayesi.',
    arcSlugs: ['romance-dawn', 'orange-town', 'syrup-village', 'baratie', 'arlong-park'],
  },
  {
    id: 'netflix-s2', season: 'Sezon 2',
    title: 'Netflix Live Action — Sezon 2',
    covers: 'Loguetown → Drum Island (Chopper\'ın katılımına kadar)',
    description: 'Grand Line\'a giriş, Whiskey Peak, Little Garden ve Drum Island. Chopper mürettebata katılıyor ama Alabasta arc\'ına henüz girilmiyor.',
    arcSlugs: ['loguetown', 'reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island'],
  },
]

const CONTINUE_AFTER_NETFLIX = FULL_PATH.filter(
  (s) => !['east-blue'].includes(s.id)
)

/* ─── Saga Card Component ─────────────────────────────────────────────── */

function SagaCard({ step, index, total }: { step: GuideStep; index: number; total: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const isLast = index === total - 1

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useTransform(mouseX, (v) => `${v}px`)
  const glowY = useTransform(mouseY, (v) => `${v}px`)

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  return (
    <div ref={ref} className="relative flex gap-4 sm:gap-6">
      {/* ── Timeline rail ─────────────────────────────────── */}
      <div className="relative flex flex-col items-center pt-1">
        {/* Glowing dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 + index * 0.06 }}
          className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
          style={{
            background: `radial-gradient(circle, ${step.hex}22 0%, transparent 70%)`,
            boxShadow: `0 0 20px ${step.hex}15, 0 0 40px ${step.hex}08`,
          }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold sm:h-8 sm:w-8 sm:text-sm"
            style={{
              background: `linear-gradient(135deg, ${step.hex}30, ${step.hex}10)`,
              border: `1.5px solid ${step.hex}40`,
              color: step.hex,
            }}
          >
            {step.num}
          </span>
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 + index * 0.06 }}
            className="w-px flex-1 origin-top"
            style={{
              background: `linear-gradient(180deg, ${step.hex}30 0%, ${step.hex}08 100%)`,
            }}
          />
        )}
      </div>

      {/* ── Card ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.06 }}
        onMouseMove={handleMouse}
        className="group relative mb-6 flex-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md transition-all duration-500 hover:border-white/[0.1] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      >
        {/* Mouse-follow glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, ${step.hex}12, transparent 60%)`
            ),
          }}
        />

        {/* Top color accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${step.hex}50, transparent)` }}
        />

        {/* Main content */}
        <button
          onClick={() => setOpen(!open)}
          className="relative z-10 flex w-full items-start gap-3 p-4 text-left sm:gap-4 sm:p-5"
        >
          {/* Icon */}
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12"
            style={{
              background: `linear-gradient(135deg, ${step.hex}18, ${step.hex}06)`,
              border: `1px solid ${step.hex}20`,
            }}
          >
            <step.icon className={`h-5 w-5 ${step.color} sm:h-5 sm:w-5`} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-pirate-text transition-colors duration-300 group-hover:text-white sm:text-lg">
                {step.title}
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: `${step.hex}15`, color: step.hex }}
                >
                  {step.episodes}
                </span>
                <span className="text-[10px] font-medium text-pirate-muted/50">
                  {step.duration}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-pirate-muted/60 sm:text-[13px]">
              {step.description}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-1 flex-shrink-0 text-pirate-muted/30 transition-colors group-hover:text-pirate-muted/60"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="relative z-10 border-t border-white/[0.04] px-4 pb-5 pt-4 sm:px-5">
                {/* Highlights */}
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-pirate-muted/40">
                  Bu sagada neler olacak
                </p>
                <div className="mb-5 grid gap-2 sm:grid-cols-2">
                  {step.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 rounded-lg bg-white/[0.02] px-3 py-2">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: step.hex }}
                      />
                      <span className="text-xs leading-relaxed text-pirate-muted/80">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Arc links */}
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-pirate-muted/40">
                  Arc&apos;ları keşfet
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {step.arcSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/arcs/${slug}`}
                      className="group/arc inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[11px] font-medium text-pirate-muted/70 transition-all duration-300 hover:border-gold/20 hover:bg-gold/[0.04] hover:text-gold"
                    >
                      <Play className="h-2.5 w-2.5 transition-transform group-hover/arc:scale-110" />
                      {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function GuidePage() {
  const [tab, setTab] = useState<'scratch' | 'netflix'>('scratch')
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' })

  const activeSteps = tab === 'scratch' ? FULL_PATH : CONTINUE_AFTER_NETFLIX

  return (
      <main className="relative min-h-screen pt-28 sm:pt-32 overflow-hidden">

        {/* ─── Ambient Background ─────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-32 left-[15%] h-[600px] w-[600px] animate-float-slow rounded-full bg-gold/[0.025] blur-[100px]" />
          <div className="absolute top-[50%] right-[5%] h-[500px] w-[500px] animate-float-delayed rounded-full bg-sea/[0.025] blur-[100px]" />
          <div className="absolute bottom-[5%] left-[5%] h-[400px] w-[400px] rounded-full bg-luffy/[0.015] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 sm:px-6">

          {/* ─── Hero ─────────────────────────────────────────── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
            className="mb-14 text-center sm:mb-20"
          >
            {/* Animated compass icon */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/[0.08] to-gold/[0.02] shadow-[0_0_40px_rgba(244,163,0,0.06)] sm:h-20 sm:w-20 sm:rounded-3xl"
            >
              <Compass className="h-7 w-7 text-gold sm:h-9 sm:w-9" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mb-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
            >
              <span className="text-gold-gradient">İzleme</span>{' '}
              <span className="text-pirate-text">Rehberi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
              className="mx-auto max-w-xl text-sm leading-relaxed text-pirate-muted sm:text-base"
            >
              Nereden başlayacağını bilmiyor musun? Sıfırdan başla ya da Netflix
              Live Action sonrası kaldığın yerden devam et.
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              className="mx-auto mt-8 h-px w-40 origin-center"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(244,163,0,0.35), rgba(30,144,255,0.35), transparent)' }}
            />
          </motion.div>

          {/* ─── Tab Selector ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
            className="mb-12 flex justify-center sm:mb-14"
          >
            <div className="relative inline-flex rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5 backdrop-blur-md">
              {/* Active pill background */}
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-y-1.5 rounded-xl"
                style={{
                  left: tab === 'scratch' ? '6px' : '50%',
                  right: tab === 'netflix' ? '6px' : '50%',
                  background: tab === 'scratch'
                    ? 'linear-gradient(135deg, rgba(244,163,0,0.12), rgba(244,163,0,0.04))'
                    : 'linear-gradient(135deg, rgba(231,76,60,0.12), rgba(231,76,60,0.04))',
                  border: `1px solid ${tab === 'scratch' ? 'rgba(244,163,0,0.15)' : 'rgba(231,76,60,0.15)'}`,
                  boxShadow: tab === 'scratch'
                    ? '0 0 24px rgba(244,163,0,0.06)'
                    : '0 0 24px rgba(231,76,60,0.06)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />

              <button
                onClick={() => setTab('scratch')}
                className={`relative z-10 flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-300 sm:px-7 ${
                  tab === 'scratch' ? 'text-gold' : 'text-pirate-muted hover:text-pirate-text'
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Sıfırdan Başla</span>
              </button>
              <button
                onClick={() => setTab('netflix')}
                className={`relative z-10 flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-300 sm:px-7 ${
                  tab === 'netflix' ? 'text-luffy' : 'text-pirate-muted hover:text-pirate-text'
                }`}
              >
                <Tv className="h-4 w-4" />
                <span>Netflix Sonrası</span>
              </button>
            </div>
          </motion.div>

          {/* ─── Content ──────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* ── Netflix "already watched" section ─────────── */}
              {tab === 'netflix' && (
                <div className="mb-10">
                  {/* Section label */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-5 flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-pirate-muted/60">
                      Netflix&apos;te İzlediklerin
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/15 to-transparent" />
                  </motion.div>

                  {/* Netflix season cards */}
                  <div className="space-y-3">
                    {NETFLIX_PATH.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
                        className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-r from-emerald-500/[0.04] to-transparent"
                      >
                        {/* Left accent */}
                        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-emerald-400/60 to-emerald-400/20" />

                        <div className="flex items-start gap-4 p-4 pl-5 sm:p-5 sm:pl-6">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                {item.season}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-400/60">TAMAMLANDI</span>
                            </div>
                            <h4 className="text-sm font-bold text-pirate-text">{item.title}</h4>
                            <p className="mt-1 text-xs text-pirate-muted/60 leading-relaxed">{item.description}</p>
                            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-pirate-muted/40">
                              <BookOpen className="h-3 w-3" />
                              Kapsam: {item.covers}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Transition arrow */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
                    className="relative my-8 overflow-hidden rounded-2xl border border-gold/15 p-5 sm:p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(244,163,0,0.06) 0%, rgba(30,144,255,0.04) 50%, rgba(244,163,0,0.02) 100%)',
                    }}
                  >
                    {/* Mesh gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(244,163,0,0.08),transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(30,144,255,0.06),transparent_50%)]" />

                    <div className="relative flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 shadow-[0_0_24px_rgba(244,163,0,0.1)]">
                        <MapPin className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gold sm:text-lg">Buradan Devam Et</h3>
                        <p className="mt-0.5 text-sm text-pirate-muted/70">
                          Anime ile Alabasta arc&apos;ından (Crocodile savaşı) devam edebilirsin.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Section label for continue */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/15">
                      <Compass className="h-3.5 w-3.5 text-gold" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-pirate-muted/60">
                      Anime ile Devam
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent" />
                  </div>
                </div>
              )}

              {/* ── Intro card (scratch only) ────────────────── */}
              {tab === 'scratch' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-md sm:p-6"
                >
                  {/* Background mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(244,163,0,0.06),transparent_50%),radial-gradient(ellipse_at_100%_100%,rgba(30,144,255,0.04),transparent_50%)]" />

                  <div className="relative">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/15 to-gold/5 shadow-[0_0_24px_rgba(244,163,0,0.06)]">
                        <Zap className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h2 className="mb-1 text-lg font-bold text-pirate-text">Sıfırdan Anime Yolu</h2>
                        <p className="text-[13px] text-pirate-muted/60 leading-relaxed">
                          One Piece&apos;i en başından izlemek istiyorsan bu yol sana göre.
                          Filler&apos;sız, saf hikaye. Her saga adım adım.
                        </p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: '10', label: 'Saga', color: '#f4a300' },
                        { value: '32', label: 'Arc', color: '#1e90ff' },
                        { value: '580+', label: 'Bölüm', color: '#e74c3c' },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-3 text-center"
                        >
                          <p className="text-xl font-extrabold tabular-nums" style={{ color: stat.color }}>
                            {stat.value}
                          </p>
                          <p className="text-[10px] font-medium text-pirate-muted/40">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Timeline ─────────────────────────────────── */}
              <div ref={stepsRef} className="pl-1">
                {activeSteps.map((step, i) => (
                  <SagaCard key={step.id} step={step} index={i} total={activeSteps.length} />
                ))}
              </div>

              {/* ── Bottom CTA ────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-6 flex justify-center"
              >
                <Link
                  href={tab === 'scratch' ? '/arcs/romance-dawn' : '/arcs/arabasta'}
                  className="btn-gold group inline-flex text-sm sm:text-base"
                >
                  <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  {tab === 'scratch' ? 'Hemen Başla: Romance Dawn' : 'Devam Et: Arabasta Arc'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ─── Bottom note ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-20 mb-10 flex justify-center"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-5 py-3 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-gold/40" />
              <p className="text-xs text-pirate-muted/50 sm:text-[13px]">
                Tüm bölümler filler&apos;sız, OnePaceTR ile izlenebilir.{' '}
                <Link href="/arcs" className="font-medium text-gold/70 transition-colors hover:text-gold">
                  Arc Haritası
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
  )
}

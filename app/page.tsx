'use client'

import { motion, useScroll, useTransform, useInView, useMotionTemplate } from 'framer-motion'
import { Play, Compass, Cherry, Shield, Globe, Anchor, Swords, Trophy, Clock, ArrowRight, Sparkles, Map } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import dynamic from 'next/dynamic'

import WaveSeparator from '@/components/ui/WaveSeparator'
import MangaImpactDivider from '@/components/ui/MangaImpactDivider'
import { EASE } from '@/lib/variants'

const ParticleField = dynamic(() => import('@/components/home/ParticleField'), { ssr: false })
const WaveBackground = dynamic(() => import('@/components/home/WaveBackground'), { ssr: false })
const StatsBar = dynamic(() => import('@/components/home/StatsBar'), { ssr: false })
const ArcTimeline = dynamic(() => import('@/components/home/ArcTimeline'), { ssr: false })
const JourneyScroll = dynamic(() => import('@/components/home/JourneyScroll'), { ssr: false })
const PoneglyphOverlay = dynamic(() => import('@/components/home/PoneglyphOverlay'), { ssr: false })
const FeaturedArcSpotlight = dynamic(() => import('@/components/home/FeaturedArcSpotlight'), { ssr: false })

/* ─── Hero Text Animations ────────────────────────────────────────────── */
const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.8,
      ease: EASE,
    },
  }),
}

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE, delay: 1.2 },
  },
}

/* ─── Wiki Section Data ───────────────────────────────────────────────── */
const WIKI_ITEMS = [
  { icon: Cherry, label: 'Şeytan Meyveleri', href: '/devil-fruits', count: '43+', desc: 'Tüm meyveler', color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-500/5', borderHover: 'hover:border-purple-500/25' },
  { icon: Shield, label: 'Haki Rehberi', href: '/haki', count: '3', desc: 'Haki türleri', color: 'text-gold', bg: 'from-gold/15 to-gold/5', borderHover: 'hover:border-gold/25' },
  { icon: Globe, label: 'Dünya Haritası', href: '/world', count: '25+', desc: 'Lokasyonlar', color: 'text-sea', bg: 'from-sea/15 to-sea/5', borderHover: 'hover:border-sea/25' },
  { icon: Anchor, label: 'Organizasyonlar', href: '/crews', count: '12', desc: 'Mürettebatlar', color: 'text-emerald-400', bg: 'from-emerald-400/15 to-emerald-400/5', borderHover: 'hover:border-emerald-400/25' },
  { icon: Swords, label: 'Efsanevi Savaşlar', href: '/battles', count: '12', desc: 'İkonik dövüşler', color: 'text-luffy', bg: 'from-luffy/15 to-luffy/5', borderHover: 'hover:border-luffy/25' },
  { icon: Trophy, label: 'Ödül Sıralaması', href: '/bounties', count: '30+', desc: 'Bounty listesi', color: 'text-gold-bright', bg: 'from-gold-bright/15 to-gold-bright/5', borderHover: 'hover:border-gold-bright/25' },
  { icon: Clock, label: 'Zaman Çizelgesi', href: '/timeline', count: '25+', desc: 'Kronolojik olaylar', color: 'text-cyan-400', bg: 'from-cyan-400/15 to-cyan-400/5', borderHover: 'hover:border-cyan-400/25' },
  { icon: Map, label: 'İzleme Rehberi', href: '/guide', count: 'Yeni', desc: 'Nereden başla?', color: 'text-emerald-400', bg: 'from-emerald-400/15 to-emerald-400/5', borderHover: 'hover:border-emerald-400/25' },
  { icon: Compass, label: 'Tüm Arc\'lar', href: '/arcs', count: '32', desc: 'Arc rehberi', color: 'text-sea-light', bg: 'from-sea-light/15 to-sea-light/5', borderHover: 'hover:border-sea-light/25' },
] as const

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  // Scene 1 (intro) — visible during first third of the sticky sequence
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.42], [1, 1, 0])
  const scene1Y = useTransform(scrollYProgress, [0, 0.42], [0, -60])

  // Scene 2 (poneglyph reveal) — emerges mid-way
  const scene2Opacity = useTransform(scrollYProgress, [0.38, 0.52, 0.82, 0.95], [0, 1, 1, 0])
  const scene2Y = useTransform(scrollYProgress, [0.38, 0.52], [40, 0])

  // Background parallax / zoom across full sequence
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.35])
  const bgBlur = useTransform(scrollYProgress, [0, 0.5, 1], ['0px', '0px', '6px'])
  const bgBrightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.78, 0.55])
  const bgFilter = useMotionTemplate`blur(${bgBlur}) brightness(${bgBrightness})`

  // Poneglyph overlay intensity
  const poneglyphOpacity = useTransform(scrollYProgress, [0.3, 0.55, 0.9, 1], [0, 0.55, 0.7, 0])

  // Exit fade — whole hero disappears into next section
  const heroExitOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

  const wikiRef = useRef<HTMLDivElement>(null)
  const wikiInView = useInView(wikiRef, { once: true, margin: '-80px' })

  return (
      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero — Sticky multi-scene sequence ─────────────────── */}
        <section
          ref={heroRef}
          className="relative z-10"
          style={{ height: '200vh' }}
        >
          <motion.div
            style={{ opacity: heroExitOpacity }}
            className="sticky top-0 h-screen overflow-hidden"
          >
            {/* Parallax background image */}
            <motion.div
              className="absolute inset-0"
              style={{ y: bgY, scale: bgScale, filter: bgFilter }}
            >
              <Image
                src="/hero.webp"
                alt="One Piece Hero"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Cinematic vignette overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/20 to-ocean-deep" />
              <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/50 via-transparent to-ocean-deep/50" />
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ocean-deep via-ocean-deep/80 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ocean-deep/60 to-transparent" />
            </motion.div>

            {/* Particles */}
            <ParticleField />

            {/* Poneglyph overlay — emerges in scene 2 */}
            <motion.div className="absolute inset-0" style={{ opacity: poneglyphOpacity }}>
              <PoneglyphOverlay />
            </motion.div>

            {/* Morphing decorative shape */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="h-[500px] w-[500px] animate-morph opacity-[0.04]"
                style={{
                  background: 'radial-gradient(circle, rgba(244,163,0,0.6), rgba(30,144,255,0.4), transparent 70%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
              />
            </div>

            {/* Scene 1 — Brand hero */}
            <motion.div
              style={{ opacity: scene1Opacity, y: scene1Y }}
              className="absolute inset-0 z-10 flex flex-col items-center px-6 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                className="mt-[22vh] inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 backdrop-blur-md sm:mt-[20vh]"
              >
                <Sparkles className="h-3 w-3 text-gold" />
                <span className="text-[11px] font-semibold tracking-wide text-gold">
                  FILLER&apos;SIZ ARC BAZLI
                </span>
              </motion.div>

              <div className="flex-1" />

              <div className="max-w-3xl pb-32 sm:pb-28">
                <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl lg:text-7xl">
                  {['One', 'Piece'].map((word, i) => (
                    <motion.span
                      key={word}
                      custom={i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block text-gold-gradient mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br className="sm:hidden" />
                  {['Evrenine', 'Dalmaya'].map((word, i) => (
                    <motion.span
                      key={word}
                      custom={i + 2}
                      variants={wordVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block text-white mr-3 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br className="hidden sm:block" />
                  <motion.span
                    custom={4}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block text-gold-gradient"
                  >
                    Hazır Mısın?
                  </motion.span>
                </h1>

                <motion.div
                  variants={lineReveal}
                  initial="hidden"
                  animate="visible"
                  className="mx-auto mb-6 h-px w-32 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(244,163,0,0.5), rgba(30,144,255,0.5), transparent)',
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.7, ease: EASE }}
                  className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base"
                >
                  Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                  izleme takibi ve daha fazlası.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.15, duration: 0.7, ease: EASE }}
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  <Link href="/arcs" className="btn-gold group text-sm sm:text-base">
                    <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    İzlemeye Başla
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link href="/characters" className="btn-ghost border-white/10 text-white text-sm sm:text-base group">
                    <Compass className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
                    Karakterleri Keşfet
                  </Link>
                </motion.div>

                {/* Scroll hint — only visible in scene 1 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="mt-10 flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40"
                >
                  <span>Scroll — Poneglyph&apos;in sırrı</span>
                  <span className="block h-6 w-px animate-pulse bg-gradient-to-b from-gold/60 to-transparent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Scene 2 — Poneglyph reveal */}
            <motion.div
              style={{ opacity: scene2Opacity, y: scene2Y }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sea/25 bg-ocean-deep/60 px-4 py-1.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-sea-light">
                    POSEIDON&apos;UN SESİ
                  </span>
                </div>

                <h2 className="mb-5 text-3xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl">
                  <span className="block text-white/90">Void Century&apos;nin</span>
                  <span className="block text-gold-gradient">sırları burada.</span>
                </h2>

                <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-base">
                  800 yıl önce kaybolan bir çağ. 32 arc&apos;lık destansı yolculuk.
                  <span className="text-gold"> 61 karakter, 12 mürettebat, 43 Şeytan Meyvesi </span>
                  ve henüz söylenmemiş binlerce hikaye.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/timeline" className="btn-ghost border-gold/20 bg-gold/[0.06] text-gold group">
                    <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                    Zaman Çizelgesi
                  </Link>
                  <Link href="/world" className="btn-ghost border-sea/20 bg-sea/[0.06] text-sea group">
                    <Map className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                    Dünya Haritası
                  </Link>
                  <Link href="/devil-fruits" className="btn-ghost border-purple-400/20 bg-purple-400/[0.06] text-purple-300 group">
                    <Cherry className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                    Şeytan Meyveleri
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Wave transition — persists across scenes */}
            <WaveBackground />
          </motion.div>
        </section>

        {/* ─── Stats ─────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 py-16 sm:py-20">
          <StatsBar />
        </section>

        {/* ─── Wave separator ──────────────────────────────────── */}
        <WaveSeparator variant="bold" />

        {/* ─── Arc Timeline ──────────────────────────────────────── */}
        <ArcTimeline />

        {/* ─── Wave separator ──────────────────────────────────── */}
        <WaveSeparator variant="gold" />

        {/* ─── Featured Arc Spotlight ─────────────────────────── */}
        <FeaturedArcSpotlight />

        {/* ─── Journey Scroll Storytelling ────────────────────────── */}
        <JourneyScroll />

        {/* ─── Manga impact divider ─────────────────────────────── */}
        <MangaImpactDivider sfx="DON!" subtitle="Wiki &amp; Ansiklopedi" />

        {/* ─── Wiki / Bento Grid ─────────────────────────────────── */}
        <section ref={wikiRef} className="relative z-10 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={wikiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-12 text-center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={wikiInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/15 bg-gold/[0.06]"
              >
                <Sparkles className="h-6 w-6 text-gold" />
              </motion.div>
              <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                <span className="text-gold-gradient">Ansiklopedi</span>{' '}
                <span className="text-pirate-text">& Wiki</span>
              </h2>
              <p className="mx-auto max-w-lg text-sm text-pirate-muted sm:text-base">
                One Piece evreninin derinliklerine dal. Şeytan Meyvelerinden Haki&apos;ye,
                dünya coğrafyasından efsanevi savaşlara kadar her şey burada.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {WIKI_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={wikiInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    className={`bento-card group flex items-center gap-4 p-4 transition-all duration-500 ${item.borderHover}`}
                  >
                    {/* Icon with gradient background */}
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg} transition-transform duration-500 group-hover:scale-110`}>
                      <item.icon className={`h-5 w-5 ${item.color} transition-transform duration-500 group-hover:rotate-12`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-pirate-text transition-colors duration-300 group-hover:text-white">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-pirate-muted/60">{item.desc}</p>
                    </div>
                    <span className={`text-lg font-extrabold ${item.color} opacity-60 transition-opacity group-hover:opacity-100`}>
                      {item.count}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
  )
}

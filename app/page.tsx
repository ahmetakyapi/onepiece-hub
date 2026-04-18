'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Play, Compass, Cherry, Shield, Globe, Anchor, Swords, Trophy, Clock, ArrowRight, Sparkles, Map, Skull, ChevronDown, Zap, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import WaveSeparator from '@/components/ui/WaveSeparator'
import MangaImpactDivider from '@/components/ui/MangaImpactDivider'
import { EASE } from '@/lib/variants'

const ParticleField = dynamic(() => import('@/components/home/ParticleField'), { ssr: false })
const WaveBackground = dynamic(() => import('@/components/home/WaveBackground'), { ssr: false })
const StatsBar = dynamic(() => import('@/components/home/StatsBar'), { ssr: false })
const ArcTimeline = dynamic(() => import('@/components/home/ArcTimeline'), { ssr: false })
const JourneyScroll = dynamic(() => import('@/components/home/JourneyScroll'), { ssr: false })
const FeaturedArcSpotlight = dynamic(() => import('@/components/home/FeaturedArcSpotlight'), { ssr: false })
const VoidCenturySection = dynamic(() => import('@/components/home/VoidCenturySection'), { ssr: false })

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

/* ─── Interactive Tools Section Data ──────────────────────────────────── */
const TOOLS = [
  {
    icon: BookOpen,
    label: 'Sagalar',
    href: '/sagas',
    desc: 'One Piece\'in 10 destansı sagası, cinematic showcase',
    tag: 'Yeni',
    accent: 'text-cyan-400',
    hoverAccent: 'group-hover:text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    glow: 'bg-cyan-500/[0.12]',
  },
  {
    icon: Swords,
    label: 'Güç Sıralaması',
    href: '/power',
    desc: 'Karakter stat\'leri, tier sistemi ve podium',
    tag: 'Dinamik',
    accent: 'text-gold',
    hoverAccent: 'group-hover:text-gold',
    accentBg: 'bg-gold/10',
    accentBorder: 'border-gold/30',
    glow: 'bg-gold/[0.12]',
  },
  {
    icon: Zap,
    label: 'Teknikler',
    href: '/techniques',
    desc: 'Haki, meyve, kılıç — 200+ yetenek arşivi',
    tag: 'Filtre',
    accent: 'text-purple-400',
    hoverAccent: 'group-hover:text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    glow: 'bg-purple-500/[0.12]',
  },
  {
    icon: Swords,
    label: 'Karşılaştır',
    href: '/vs',
    desc: 'İki karakter seç, tüm stat\'ler yan yana',
    tag: 'Etkileşimli',
    accent: 'text-luffy',
    hoverAccent: 'group-hover:text-luffy',
    accentBg: 'bg-luffy/10',
    accentBorder: 'border-luffy/30',
    glow: 'bg-luffy/[0.12]',
  },
] as const

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
  { icon: Skull, label: 'Wanted Poster', href: '/wanted-poster', count: 'Oluştur', desc: 'Kendi ödülünü tasarla', color: 'text-gold', bg: 'from-gold/15 to-gold/5', borderHover: 'hover:border-gold/30' },
] as const

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Subtle parallax on the hero background as the user scrolls past it
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(heroProgress, [0, 1], ['0%', '20%'])
  const bgScale = useTransform(heroProgress, [0, 1], [1.08, 1.18])
  const heroContentOpacity = useTransform(heroProgress, [0, 0.6, 1], [1, 1, 0.2])

  // On mobile the Ken-burns animation already provides motion for the hero
  // image, and scroll-driven transforms add noticeable jank. Gate parallax so
  // the style prop doesn't subscribe to the motion values on small screens.
  const [parallaxEnabled, setParallaxEnabled] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setParallaxEnabled(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const wikiRef = useRef<HTMLDivElement>(null)
  const wikiInView = useInView(wikiRef, { once: true, margin: '-80px' })

  const toolsRef = useRef<HTMLDivElement>(null)
  const toolsInView = useInView(toolsRef, { once: true, margin: '-80px' })

  return (
      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero — Single-screen, normal scroll ────────────────── */}
        <section
          ref={heroRef}
          className="relative z-10 h-screen min-h-[640px] overflow-hidden"
        >
          {/* Single full-bleed background image with Ken Burns */}
          <motion.div
            className="absolute inset-0"
            style={parallaxEnabled ? { y: bgY, scale: bgScale } : undefined}
          >
            <Image
              src="/hero.webp"
              alt="One Piece Hero"
              fill
              className="object-cover animate-ken-burns"
              priority
              sizes="100vw"
            />
            {/* Cinematic vignette — stronger bottom so CTAs stay readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/50 via-ocean-deep/30 to-ocean-deep" />
            <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ocean-deep via-ocean-deep/85 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ocean-deep/75 to-transparent" />
          </motion.div>

          {/* Hero content — positioned center-bottom */}
          <motion.div
            style={parallaxEnabled ? { opacity: heroContentOpacity } : undefined}
            className="relative z-10 flex h-full flex-col items-center px-6 pt-[8vh] text-center sm:pt-[12vh] md:pt-[16vh]"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="text-[11px] font-semibold tracking-wide text-gold">
                FILLER&apos;SIZ ARC BAZLI
              </span>
            </motion.div>

            <div className="flex-1" />

            <div className="max-w-3xl pb-16 sm:pb-28 md:pb-32">
              <h1 className="mb-4 text-4xl font-extrabold leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
                {['One', 'Piece'].map((word, i) => (
                  <motion.span
                    key={word}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block text-gold-shimmer mr-3"
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
                  className="inline-block text-gold-shimmer"
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
                className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:mb-8 sm:text-base"
              >
                Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                izleme takibi ve daha fazlası.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7, ease: EASE }}
                className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link
                  href="/arcs"
                  className="btn-gold shine-hover group relative !px-7 !py-3.5 text-sm shadow-[0_10px_40px_-8px_rgba(244,163,0,0.55)] sm:min-w-[220px] sm:text-base"
                >
                  <Play className="relative z-[2] h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-[2]">İzlemeye Başla</span>
                  <ArrowRight className="relative z-[2] h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/characters"
                  className="btn-ghost shine-hover group !px-7 !py-3.5 text-sm text-white !border-white/15 hover:!border-gold/40 sm:min-w-[220px] sm:text-base"
                >
                  <Compass className="relative z-[2] h-4 w-4 text-gold transition-transform duration-500 group-hover:rotate-90" />
                  <span className="relative z-[2]">Karakterleri Keşfet</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom scroll hint — bounces gently */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-1.5 sm:bottom-8"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Keşfetmeye başla
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 bg-ocean-deep/60 backdrop-blur-md"
            >
              <ChevronDown className="h-3.5 w-3.5 text-gold" />
            </motion.div>
          </motion.div>

          {/* Wave transition at bottom */}
          <WaveBackground />
        </section>

        {/* ─── Stats — tight-to-hero ─────────────────────────────── */}
        <section className="relative z-10 -mt-4 px-6 pt-2 pb-12 sm:mt-0 sm:pt-10 sm:pb-20">
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

        {/* ─── Void Century Section (Scene 2 reborn as chapter break) ─── */}
        <VoidCenturySection />

        {/* ─── Journey Scroll Storytelling ────────────────────────── */}
        <JourneyScroll />

        {/* ─── Interactive Tools Showcase ────────────────────────── */}
        <section ref={toolsRef} className="relative z-10 px-6 py-20 sm:py-24">
          <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-gold/[0.05] blur-[100px]" />
          <div className="pointer-events-none absolute -left-32 bottom-10 h-64 w-64 rounded-full bg-luffy/[0.04] blur-[90px]" />

          <div className="relative mx-auto max-w-6xl">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={toolsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-10 text-center sm:mb-12"
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={toolsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-gold/70"
              >
                ⚡ Etkileşimli Araçlar
              </motion.p>
              <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                <span className="text-gold-gradient">Araştır</span>{' '}
                <span className="text-pirate-text">& Karşılaştır</span>
              </h2>
              <p className="mx-auto max-w-xl text-sm text-pirate-muted sm:text-base">
                One Piece evrenini kendi yöntemlerinle keşfet — saga&apos;lardan güç sıralamasına, teknik arşivinden karakter karşılaştırmalarına.
              </p>
            </motion.div>

            {/* Tools Grid — 2 col sm, 4 col lg */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={toolsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 }}
                >
                  <Link
                    href={tool.href}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${tool.accentBorder} bg-ocean-surface/30 p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-ocean-surface/50 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]`}
                  >
                    <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${tool.glow} blur-[60px] transition-opacity duration-500 group-hover:opacity-150`} />

                    {/* Tag */}
                    <div className="relative mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.accentBg} border ${tool.accentBorder} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <tool.icon className={`h-5 w-5 ${tool.accent}`} />
                      </div>
                      <span className={`rounded-full ${tool.accentBg} px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${tool.accent}`}>
                        {tool.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1">
                      <h3 className={`mb-2 text-lg font-extrabold text-pirate-text transition-colors duration-300 ${tool.hoverAccent} sm:text-xl`}>
                        {tool.label}
                      </h3>
                      <p className="text-xs leading-relaxed text-pirate-muted sm:text-[13px]">
                        {tool.desc}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="relative mt-5 flex items-center gap-1.5 text-xs font-bold">
                      <span className={tool.accent}>Dene</span>
                      <ArrowRight className={`h-3.5 w-3.5 ${tool.accent} transition-transform duration-300 group-hover:translate-x-1`} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

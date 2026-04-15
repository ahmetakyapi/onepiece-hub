'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Play, Compass, Cherry, Shield, Globe, Anchor, Swords, Trophy, Clock, ArrowRight, Sparkles, Map } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import dynamic from 'next/dynamic'

import WaveSeparator from '@/components/ui/WaveSeparator'

const ParticleField = dynamic(() => import('@/components/home/ParticleField'), { ssr: false })
const WaveBackground = dynamic(() => import('@/components/home/WaveBackground'), { ssr: false })
const StatsBar = dynamic(() => import('@/components/home/StatsBar'), { ssr: false })
const ArcTimeline = dynamic(() => import('@/components/home/ArcTimeline'), { ssr: false })

const EASE = [0.16, 1, 0.3, 1] as const

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
  { icon: Trophy, label: 'Ödül Sıralamas��', href: '/bounties', count: '30+', desc: 'Bounty listesi', color: 'text-gold-bright', bg: 'from-gold-bright/15 to-gold-bright/5', borderHover: 'hover:border-gold-bright/25' },
  { icon: Clock, label: 'Zaman Çizelgesi', href: '/timeline', count: '25+', desc: 'Kronolojik olaylar', color: 'text-cyan-400', bg: 'from-cyan-400/15 to-cyan-400/5', borderHover: 'hover:border-cyan-400/25' },
  { icon: Map, label: 'İzleme Rehberi', href: '/guide', count: 'Yeni', desc: 'Nereden başla?', color: 'text-emerald-400', bg: 'from-emerald-400/15 to-emerald-400/5', borderHover: 'hover:border-emerald-400/25' },
  { icon: Compass, label: 'Tüm Arc\'lar', href: '/arcs', count: '32', desc: 'Arc rehberi', color: 'text-sea-light', bg: 'from-sea-light/15 to-sea-light/5', borderHover: 'hover:border-sea-light/25' },
] as const

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -80])

  const wikiRef = useRef<HTMLDivElement>(null)
  const wikiInView = useInView(wikiRef, { once: true, margin: '-80px' })

  return (
      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative z-10 min-h-screen">
          {/* Parallax background image */}
          <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
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
            {/* Extra bottom overlay for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ocean-deep via-ocean-deep/80 to-transparent" />
            {/* Top fade for header blend */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ocean-deep/60 to-transparent" />
          </motion.div>

          {/* Particles */}
          <ParticleField />

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

          {/* Hero content — split into top badge + bottom title */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="relative z-10 flex min-h-screen flex-col items-center px-6 text-center"
          >
            {/* Top badge — positioned at ~28% from top (above Luffy's hat) */}
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

            {/* Spacer — pushes title below Luffy's face */}
            <div className="flex-1" />

            {/* Bottom section — title, subtitle, buttons */}
            <div className="max-w-3xl pb-32 sm:pb-28">
              {/* Title — word-by-word reveal with blur */}
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

              {/* Decorative line */}
              <motion.div
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                className="mx-auto mb-6 h-px w-32 origin-left"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(244,163,0,0.5), rgba(30,144,255,0.5), transparent)',
                }}
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7, ease: EASE }}
                className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base"
              >
                Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                izleme takibi ve daha fazlası.
              </motion.p>

              {/* CTA Buttons */}
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
            </div>
          </motion.div>

          {/* Wave transition */}
          <WaveBackground />
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

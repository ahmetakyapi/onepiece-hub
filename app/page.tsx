'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Play, Compass, Cherry, Shield, Globe, Anchor, Swords, Trophy, Clock, ArrowRight, Sparkles, Map, Skull, Zap, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import WaveSeparator from '@/components/ui/WaveSeparator'
import MangaImpactDivider from '@/components/ui/MangaImpactDivider'
import { EASE } from '@/lib/variants'
import { EASE_REVEAL } from '@/lib/motion'
import { SITE_STATS } from '@/lib/constants/stats'
import { useIntroReady } from '@/hooks/useIntroReady'
import SplitText from '@/components/motion/SplitText'
import VelocityMarquee from '@/components/motion/VelocityMarquee'

const ParticleField = dynamic(() => import('@/components/home/ParticleField'), { ssr: false })
const WaveBackground = dynamic(() => import('@/components/home/WaveBackground'), { ssr: false })
const StatsBar = dynamic(() => import('@/components/home/StatsBar'), { ssr: false })
const RouteConcierge = dynamic(() => import('@/components/home/RouteConcierge'), { ssr: false })
const ArcTimeline = dynamic(() => import('@/components/home/ArcTimeline'), { ssr: false })
const JourneyScroll = dynamic(() => import('@/components/home/JourneyScroll'), { ssr: false })
const FeaturedArcSpotlight = dynamic(() => import('@/components/home/FeaturedArcSpotlight'), { ssr: false })
const VoidCenturySection = dynamic(() => import('@/components/home/VoidCenturySection'), { ssr: false })
const SagaVoyage = dynamic(() => import('@/components/home/SagaVoyage'), { ssr: false })
/* localStorage okur → ssr:false zorunlu */
const ResumeBar = dynamic(() => import('@/components/watch/ResumeBar'), { ssr: false })
const SeriesStatus = dynamic(() => import('@/components/series/SeriesStatus'), { ssr: false })

/* ─── Hero Text Animations ────────────────────────────────────────────── */
/* Maskeli yükselme: her kelime kendi taşma kutusunun altından eğimle çıkar.
   Animasyonlar `useIntroReady` ile açılış perdesinin kalkmasını bekler —
   yoksa preloader'ın arkasında oynayıp biterdi. */
const wordVariants = {
  hidden: { y: '115%', rotate: 6 },
  visible: (i: number) => ({
    y: '0%',
    rotate: 0,
    transition: {
      delay: 0.15 + i * 0.09,
      duration: 1.1,
      ease: EASE_REVEAL,
    },
  }),
}

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE, delay: 0.8 },
  },
}

/* Kayan şerit içeriği — sayılar SITE_STATS'ten (elle yazılmaz) */
const MARQUEE_PRIMARY = [
  "FILLER'SIZ",
  `${SITE_STATS.arcs} ARC`,
  `${SITE_STATS.episodes} BÖLÜM`,
  `${SITE_STATS.sagas} SAGA`,
  `${SITE_STATS.characters} KARAKTER`,
] as const
const MARQUEE_SECONDARY = [
  'Romance Dawn', 'Arlong Park', 'Alabasta', 'Skypiea', 'Enies Lobby',
  'Marineford', 'Dressrosa', 'Whole Cake', 'Wano', 'Egghead',
] as const

function HeroWord({ word, i, ready, className }: { word: string; i: number; ready: boolean; className: string }) {
  return (
    <span className="mr-3 inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom last:mr-0">
      <motion.span
        custom={i}
        variants={wordVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        className={`inline-block ${className}`}
        style={{ transformOrigin: '0% 100%' }}
      >
        {word}
      </motion.span>
    </span>
  )
}

/* ─── Interactive Tools Section Data ──────────────────────────────────── */
/* Dört aracın vurgu rengi bir sınıflandırma skalasıdır — kartları birbirinden
   ayırır. Üçü zaten marka token'ı (gold · fruit · luffy); dördüncüsü ham
   `cyan-*` yazılıydı, light temada beyaz kart üstünde CTA metni ve rozet
   okunmuyordu. `accent-cyan` tema ile 400 → 700 seviyeye döner, dört rengin
   ayrımı iki temada da korunur. */
/* Bento ritmi: satırlar 7/5 ve 5/7 olarak ofsetlenir. Dört öğe → dört hücre,
   eşit dört sütun tekrarı da boş hücre de yok. */
const TOOL_CELL = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
] as const

const TOOLS = [
  {
    icon: BookOpen,
    label: 'Sagalar',
    href: '/sagas',
    desc: `One Piece'in ${SITE_STATS.sagas} sagası, sinematik vitrinle`,
    tag: 'Yeni',
    accent: 'text-accent-cyan',
    hoverAccent: 'group-hover:text-accent-cyan',
    accentBg: 'bg-accent-cyan/10',
    accentBorder: 'border-accent-cyan/30',
    glow: 'bg-accent-cyan/[0.12]',
    /* Yalnız büyük hücrede kullanılır: kartların hepsi düz yüzey olmasın */
    featureBg: 'from-accent-cyan/[0.10] via-ocean-surface/40 to-ocean-surface/20',
  },
  {
    icon: Swords,
    label: 'Güç Sıralaması',
    href: '/power',
    desc: 'Karakter statleri, tier sistemi ve podyum',
    tag: 'Dinamik',
    accent: 'text-gold',
    hoverAccent: 'group-hover:text-gold',
    accentBg: 'bg-gold/10',
    accentBorder: 'border-gold/30',
    glow: 'bg-gold/[0.12]',
    featureBg: 'from-gold/[0.10] via-ocean-surface/40 to-ocean-surface/20',
  },
  {
    icon: Zap,
    label: 'Teknikler',
    href: '/techniques',
    desc: `Haki, meyve ve kılıç: ${SITE_STATS.techniques} yetenek arşivi`,
    tag: 'Filtre',
    accent: 'text-fruit',
    hoverAccent: 'group-hover:text-fruit',
    accentBg: 'bg-fruit-strong/10',
    accentBorder: 'border-fruit-strong/30',
    glow: 'bg-fruit-strong/[0.12]',
    featureBg: 'from-fruit-strong/[0.10] via-ocean-surface/40 to-ocean-surface/20',
  },
  {
    icon: Swords,
    label: 'Karşılaştır',
    href: '/vs',
    desc: 'İki karakter seç, tüm statler yan yana',
    tag: 'Etkileşimli',
    accent: 'text-luffy',
    hoverAccent: 'group-hover:text-luffy',
    accentBg: 'bg-luffy/10',
    accentBorder: 'border-luffy/30',
    glow: 'bg-luffy/[0.12]',
    featureBg: 'from-luffy/[0.10] via-ocean-surface/40 to-ocean-surface/20',
  },
] as const

/* ─── Wiki Section Data ───────────────────────────────────────────────── */
/* `count` SITE_STATS'ten türetilir, elle sayı yazılmaz. `null` = sayılabilir
   bir koleksiyon değil (eylem/rehber kartı); sayı yerine ok render edilir. */
const WIKI_ITEMS = [
  { icon: Cherry, label: 'Şeytan Meyveleri', href: '/devil-fruits', count: String(SITE_STATS.devilFruits), desc: 'Tüm meyveler', color: 'text-fruit', bg: 'from-fruit-strong/15 to-fruit-strong/5', borderHover: 'hover:border-fruit-strong/25' },
  { icon: Shield, label: 'Haki Rehberi', href: '/haki', count: '3', desc: 'Haki türleri', color: 'text-gold', bg: 'from-gold/15 to-gold/5', borderHover: 'hover:border-gold/25' },
  { icon: Globe, label: 'Dünya Haritası', href: '/world', count: String(SITE_STATS.locations), desc: 'Lokasyonlar', color: 'text-sea', bg: 'from-sea/15 to-sea/5', borderHover: 'hover:border-sea/25' },
  { icon: Anchor, label: 'Organizasyonlar', href: '/crews', count: String(SITE_STATS.crews), desc: 'Mürettebatlar', color: 'text-accent-emerald', bg: 'from-accent-emerald/15 to-accent-emerald/5', borderHover: 'hover:border-accent-emerald/25' },
  { icon: Swords, label: 'Efsanevi Savaşlar', href: '/battles', count: String(SITE_STATS.battles), desc: 'İkonik dövüşler', color: 'text-luffy', bg: 'from-luffy/15 to-luffy/5', borderHover: 'hover:border-luffy/25' },
  { icon: Trophy, label: 'Ödül Sıralaması', href: '/bounties', count: String(SITE_STATS.bounties), desc: 'Bounty listesi', color: 'text-gold-bright', bg: 'from-gold-bright/15 to-gold-bright/5', borderHover: 'hover:border-gold-bright/25' },
  { icon: Clock, label: 'Zaman Çizelgesi', href: '/timeline', count: null, desc: 'Kronolojik olaylar', color: 'text-accent-cyan', bg: 'from-accent-cyan/15 to-accent-cyan/5', borderHover: 'hover:border-accent-cyan/25' },
  { icon: Map, label: 'İzleme Rehberi', href: '/guide', count: null, desc: 'Nereden başla?', color: 'text-accent-emerald', bg: 'from-accent-emerald/15 to-accent-emerald/5', borderHover: 'hover:border-accent-emerald/25' },
  { icon: Compass, label: 'Tüm Arc\'lar', href: '/arcs', count: String(SITE_STATS.arcs), desc: 'Arc rehberi', color: 'text-sea-light', bg: 'from-sea-light/15 to-sea-light/5', borderHover: 'hover:border-sea-light/25' },
  { icon: Skull, label: 'Wanted Poster', href: '/wanted-poster', count: null, desc: 'Kendi ödülünü tasarla', color: 'text-gold', bg: 'from-gold/15 to-gold/5', borderHover: 'hover:border-gold/30' },
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
  const heroContentY = useTransform(heroProgress, [0, 1], ['0%', '-18%'])
  /* Kaydırınca hero görseli kenarlardan içeri çekilip yuvarlak köşeli bir
     karta dönüşür — sahne "uzaklaşır". */
  const heroClip = useTransform(
    heroProgress,
    [0, 1],
    ['inset(0% 0% 0% 0% round 0px)', 'inset(6% 4% 10% 4% round 40px)'],
  )
  const ready = useIntroReady()

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

  /* `<main>` `overflow-x-clip` taşır, `overflow-hidden` DEĞİL: hidden bir
     kaydırma kabı yaratır ve içindeki `position: sticky` (SagaVoyage)
     çalışmaz. */
  return (
      <main className="relative min-h-screen overflow-x-clip">
        {/* ─── Hero — Single-screen, normal scroll ────────────────── */}
        <section
          ref={heroRef}
          className="relative z-10 min-h-[max(100dvh,640px)] overflow-hidden"
        >
          {/* Tam ekran görsel — açılışta çerçeveden genişleyerek açılır,
              kaydırınca karta dönüşür (clip-path, iki ayrı katman: biri
              açılış animasyonunu, diğeri kaydırma kırpmasını taşır). */}
          <motion.div
            className="absolute inset-0"
            style={parallaxEnabled ? { clipPath: heroClip } : undefined}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: 'inset(14% 12% 14% 12% round 32px)' }}
              animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 0px)' } : undefined}
              transition={{ duration: 1.6, ease: EASE_REVEAL }}
            >
              <motion.div
                className="absolute inset-0"
                style={parallaxEnabled ? { y: bgY, scale: bgScale } : undefined}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.35 }}
                  animate={ready ? { scale: 1 } : undefined}
                  transition={{ duration: 2.2, ease: EASE_REVEAL }}
                >
                  <Image
                    src="/hero.webp"
                    alt="One Piece Hero"
                    fill
                    className="object-cover animate-ken-burns"
                    priority
                    sizes="100vw"
                  />
                </motion.div>
                {/* Cinematic vignette — stronger bottom so CTAs stay readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/50 via-ocean-deep/30 to-ocean-deep" />
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ocean-deep via-ocean-deep/85 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ocean-deep/75 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero content — positioned center-bottom */}
          <motion.div
            style={parallaxEnabled ? { opacity: heroContentOpacity, y: heroContentY } : undefined}
            className="relative z-10 flex min-h-[max(100dvh,640px)] flex-col items-center px-6 pt-[8vh] text-center sm:pt-[12vh] md:pt-[16vh]"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="eyebrow-lg text-gold">
                FILLER&apos;SIZ ARC BAZLI
              </span>
            </motion.div>

            <div className="flex-1" />

            <div className="max-w-3xl pb-16 sm:pb-28 md:pb-32">
              <h1 className="mb-4 text-4xl font-extrabold leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
                {['One', 'Piece'].map((word, i) => (
                  <HeroWord key={word} word={word} i={i} ready={ready} className="text-gold-shimmer" />
                ))}
                <br className="sm:hidden" />
                {['Evrenine', 'Dalmaya'].map((word, i) => (
                  <HeroWord
                    key={word}
                    word={word}
                    i={i + 2}
                    ready={ready}
                    /* Gölge kelimeye değil h1'e: kelime maske kutusunda
                       (overflow-hidden) drop-shadow kenardan kesilip
                       dikdörtgen leke bırakıyordu. */
                    className="text-pirate-text"
                  />
                ))}
                <br className="hidden sm:block" />
                <HeroWord word="Hazır" i={4} ready={ready} className="text-gold-shimmer" />
                <HeroWord word="Mısın?" i={5} ready={ready} className="text-gold-shimmer" />
              </h1>

              <motion.div
                variants={lineReveal}
                initial="hidden"
                animate={ready ? 'visible' : 'hidden'}
                className="mx-auto mb-6 h-px w-32 origin-left"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgb(var(--gold) / 0.5), rgb(var(--sea) / 0.5), transparent)',
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
                className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-pirate-text/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:mb-8 sm:text-base"
              >
                Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                izleme takibi ve daha fazlası.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link
                  href="/arcs"
                  className="btn-gold shine-hover group relative !px-7 !py-3.5 text-sm shadow-[0_10px_40px_-8px_rgb(var(--gold)/0.55)] sm:min-w-[220px] sm:text-base"
                >
                  <Play className="relative z-[2] h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-[2]">İzlemeye Başla</span>
                  <ArrowRight className="relative z-[2] h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/characters"
                  className="btn-ghost shine-hover group !px-7 !py-3.5 text-sm text-pirate-text !border-ink/15 hover:!border-gold/40 sm:min-w-[220px] sm:text-base"
                >
                  <Compass className="relative z-[2] h-4 w-4 text-gold transition-transform duration-500 group-hover:rotate-90" />
                  <span className="relative z-[2]">Karakterleri Keşfet</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Kaydırma ipucu — ince çizgi içinde akan altın damla */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="pointer-events-none absolute bottom-10 right-6 z-10 hidden items-center gap-3 md:flex lg:right-10"
            aria-hidden
          >
            <span className="relative block h-12 w-px overflow-hidden bg-pirate-text/15">
              <span className="scroll-cue-drop absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-pirate-text/60 [writing-mode:vertical-rl]">
              Kaydır
            </span>
          </motion.div>

          {/* Wave transition at bottom */}
          <WaveBackground />
        </section>

        {/* ─── Stats — tight-to-hero ─────────────────────────────── */}
        <section className="relative z-10 -mt-4 px-6 pt-2 pb-12 sm:mt-0 sm:pt-10 sm:pb-20">
          <StatsBar />
        </section>

        {/* ─── Kayan şerit — kaydırma hızına duyarlı ────────────────── */}
        <section className="relative z-10 -rotate-[1.5deg] select-none border-y border-gold/15 bg-ocean-surface/40 py-5 sm:py-7" aria-label={`${SITE_STATS.arcs} arc, ${SITE_STATS.episodes} bölüm, filler yok`}>
          <VelocityMarquee baseVelocity={-2.2}>
            {MARQUEE_PRIMARY.map((t) => (
              <span key={t} className="flex items-center">
                <span className="text-outline px-6 text-5xl font-extrabold uppercase tracking-tight sm:px-10 sm:text-7xl lg:text-8xl">
                  {t}
                </span>
                <span className="text-2xl text-gold sm:text-4xl">✦</span>
              </span>
            ))}
          </VelocityMarquee>
          <VelocityMarquee baseVelocity={1.6} className="mt-2 sm:mt-3">
            {MARQUEE_SECONDARY.map((t) => (
              <span key={t} className="flex items-center">
                <span className="px-5 font-mono text-sm font-bold uppercase tracking-[0.3em] text-gold sm:text-base">
                  {t}
                </span>
                <span className="h-1 w-1 rounded-full bg-pirate-muted/50" />
              </span>
            ))}
          </VelocityMarquee>
        </section>

        {/* ─── Kaldığın yerden devam et ──────────────────────────── */}
        <section className="relative z-10 mx-auto -mt-6 mb-6 max-w-3xl px-6 sm:-mt-10 sm:mb-10">
          <ResumeBar compact />
        </section>

        {/* ─── Seri durumu — manga / anime / One Pace ────────────── */}
        <SeriesStatus />

        <RouteConcierge />

        {/* ─── Wave separator ──────────────────────────────────── */}
        <WaveSeparator variant="bold" />

        {/* ─── Arc Timeline ──────────────────────────────────────── */}
        <ArcTimeline />

        {/* ─── Wave separator ──────────────────────────────────── */}
        <WaveSeparator variant="gold" />

        {/* ─── Featured Arc Spotlight ─────────────────────────── */}
        <FeaturedArcSpotlight />

        {/* ─── Saga Rotası — sabitlenmiş yatay galeri ──────────────── */}
        <SagaVoyage />

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
              className="mb-10 max-w-2xl sm:mb-12"
            >
              <SplitText
                as="h2"
                className="mb-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl"
                parts={[
                  { text: 'Araştır', className: 'text-gold-gradient' },
                  { text: '& Karşılaştır', className: 'text-pirate-text' },
                ]}
              />
              <p className="text-sm leading-relaxed text-pirate-muted sm:text-base">
                Saga vitrininden güç sıralamasına, teknik arşivinden karakter
                karşılaştırmasına: evreni kendi sorularınla dolaş.
              </p>
            </motion.div>

            {/* Tools bento — mobilde tek, sm'de iki, lg'de asimetrik 12 sütun */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={toolsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 }}
                  className={TOOL_CELL[i]}
                >
                  <Link
                    href={tool.href}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${tool.accentBorder} ${
                      i === 0
                        ? `bg-gradient-to-br ${tool.featureBg} p-6 sm:p-7`
                        : 'bg-ocean-surface/30 p-5 hover:bg-ocean-surface/50'
                    } transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]`}
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
                      <h3 className={`mb-2 font-extrabold text-pirate-text transition-colors duration-300 ${tool.hoverAccent} ${i === 0 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                        {tool.label}
                      </h3>
                      <p className={`leading-relaxed text-pirate-muted ${i === 0 ? 'text-[13px] sm:text-sm' : 'text-xs sm:text-[13px]'}`}>
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
              <SplitText
                as="h2"
                className="mb-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl"
                parts={[{ text: 'Ansiklopedi', className: 'text-gold-gradient' }]}
              />
              <p className="mx-auto max-w-lg text-sm text-pirate-muted sm:text-base">
                Şeytan Meyvelerinden Haki&apos;ye, dünya coğrafyasından efsanevi
                savaşlara: on başlıkta tüm referans.
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
                  className={i >= WIKI_ITEMS.length - 2 ? 'lg:col-span-2' : undefined}
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
                      <p className="text-sm font-bold text-pirate-text">{item.label}</p>
                      <p className="text-[10px] text-pirate-muted/60">{item.desc}</p>
                    </div>
                    {item.count ? (
                      <span className={`font-mono text-lg font-extrabold ${item.color} opacity-60 transition-opacity group-hover:opacity-100`}>
                        {item.count}
                      </span>
                    ) : (
                      <ArrowRight
                        className={`h-4 w-4 flex-shrink-0 ${item.color} opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100`}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
  )
}

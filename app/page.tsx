'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Compass, Cherry, Shield, Globe, Anchor, Swords, Trophy, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { staggerContainer } from '@/lib/variants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WaveBackground from '@/components/home/WaveBackground'
import StatsBar from '@/components/home/StatsBar'
import ArcTimeline from '@/components/home/ArcTimeline'
import ParticleField from '@/components/home/ParticleField'

const EASE = [0.22, 1, 0.36, 1] as const

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.04, duration: 0.6, ease: EASE },
  }),
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span style={{ perspective: '600px' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={letterVariants}
          className={`inline-block ${className ?? ''}`}
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative z-10 min-h-screen">
          {/* Parallax background image */}
          <motion.div className="absolute inset-0" style={{ y: bgY }}>
            <Image
              src="/hero.png"
              alt="One Piece Hero"
              fill
              className="object-cover scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-transparent to-ocean-deep" />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/50 via-transparent to-ocean-deep/50" />
          </motion.div>

          {/* Floating particles */}
          <ParticleField />

          {/* Content — pushed to bottom so characters stay visible */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-32 text-center"
          >
            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              {/* Title with letter animation */}
              <motion.h1
                className="mb-5 text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl"
                style={{ perspective: '600px' }}
              >
                <motion.div
                  variants={staggerContainer(0.02)}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatedTitle text="One Piece" className="text-gold-gradient" />
                  {' '}
                  <AnimatedTitle text="Evrenine" className="text-white" />
                  <br />
                  <AnimatedTitle text="Dalmaya " className="text-white" />
                  <AnimatedTitle text="Hazır Mısın?" className="text-gold-gradient" />
                </motion.div>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUpVariant}
                className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-md sm:text-lg"
              >
                Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                izleme takibi ve daha fazlası.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/arcs" className="btn-gold group text-base">
                  <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                  İzlemeye Başla
                </Link>
                <Link href="/characters" className="btn-ghost border-white/20 text-white hover:border-gold/40 text-base group">
                  <Compass className="h-5 w-5 transition-transform group-hover:rotate-45" />
                  Karakterleri Keşfet
                </Link>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Wave at bottom of hero */}
          <WaveBackground />
        </section>

        {/* ─── Divider ───────────────────────────────────────────────────── */}
        <div className="divider-glow" />

        {/* ─── Stats ─────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 py-16">
          <StatsBar />
        </section>

        {/* ─── Divider ───────────────────────────────────────────────────── */}
        <div className="divider-glow" />

        {/* ─── Arc Timeline ──────────────────────────────────────────────── */}
        <ArcTimeline />

        {/* ─── Divider ───────────────────────────────────────────────────── */}
        <div className="divider-glow" />

        {/* ─── Wiki Section ──────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-12 text-center"
            >
              <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">
                <span className="text-gold-gradient">Ansiklopedi</span>{' '}
                <span className="text-pirate-text">& Wiki</span>
              </h2>
              <p className="mx-auto max-w-xl text-sm text-pirate-muted">
                One Piece evreninin derinliklerine dal. Şeytan Meyvelerinden Haki&apos;ye,
                dünya coğrafyasından efsanevi savaşlara kadar her şey burada.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { icon: Cherry, label: 'Şeytan Meyveleri', href: '/devil-fruits', count: '43+', desc: 'Tüm meyveler', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: Shield, label: 'Haki Rehberi', href: '/haki', count: '3', desc: 'Haki türleri', color: 'text-gold', bg: 'bg-gold/10' },
                { icon: Globe, label: 'Dünya Haritası', href: '/world', count: '25+', desc: 'Lokasyonlar', color: 'text-sea', bg: 'bg-sea/10' },
                { icon: Anchor, label: 'Organizasyonlar', href: '/crews', count: '12', desc: 'Mürettebatlar', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { icon: Swords, label: 'Efsanevi Savaşlar', href: '/battles', count: '12', desc: 'İkonik dövüşler', color: 'text-luffy', bg: 'bg-luffy/10' },
                { icon: Trophy, label: 'Ödül Sıralaması', href: '/bounties', count: '30+', desc: 'Bounty listesi', color: 'text-gold-bright', bg: 'bg-gold-bright/10' },
                { icon: Clock, label: 'Zaman Çizelgesi', href: '/timeline', count: '25+', desc: 'Kronolojik olaylar', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                { icon: Compass, label: 'Tüm Arc\'lar', href: '/arcs', count: '32', desc: 'Arc rehberi', color: 'text-sea-light', bg: 'bg-sea-light/10' },
              ] as const).map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="glass group flex items-center gap-4 rounded-xl p-4 transition-all hover:border-gold/30 hover:shadow-gold-glow"
                  >
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                      <item.icon className={`h-5 w-5 ${item.color} transition-transform group-hover:scale-110`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-pirate-muted">{item.desc}</p>
                    </div>
                    <span className={`text-lg font-extrabold ${item.color}`}>{item.count}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

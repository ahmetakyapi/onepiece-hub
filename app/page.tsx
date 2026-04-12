'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Compass, ChevronDown } from 'lucide-react'
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
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/30 to-ocean-deep" />
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

            {/* Enhanced scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-white/40 tracking-widest uppercase">Keşfet</span>
                <div className="relative h-10 w-6 rounded-full border-2 border-white/15 p-1">
                  <motion.div
                    animate={{ y: [0, 14, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(244,163,0,0.5)]"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-white/20" />
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
      </main>

      <Footer />
    </>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Play, Compass } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fadeUp, staggerContainer } from '@/lib/variants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WaveBackground from '@/components/home/WaveBackground'
import StatsBar from '@/components/home/StatsBar'
import ArcTimeline from '@/components/home/ArcTimeline'

export default function Home() {
  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative z-10 min-h-screen">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/hero.png"
              alt="One Piece Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/30 to-ocean-deep" />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/50 via-transparent to-ocean-deep/50" />
          </div>

          {/* Content — pushed to bottom so characters stay visible */}
          <div className="relative flex min-h-screen flex-col items-center justify-end px-6 pb-32 text-center">
            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              {/* Title */}
              <motion.h1
                variants={fadeUp}
                className="mb-5 text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl"
              >
                <span className="text-gold-gradient">One Piece</span>{' '}
                <span className="text-white">Evrenine</span>
                <br />
                <span className="text-white">Dalmaya </span>
                <span className="text-gold-gradient">Hazır Mısın?</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-md sm:text-lg"
              >
                Filler&apos;sız arc bazlı bölümler, karakter ansiklopedisi,
                izleme takibi ve daha fazlası.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/arcs" className="btn-gold text-base">
                  <Play className="h-5 w-5" />
                  İzlemeye Başla
                </Link>
                <Link href="/characters" className="btn-ghost border-white/20 text-white hover:border-gold/40 text-base">
                  <Compass className="h-5 w-5" />
                  Karakterleri Keşfet
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-white/50">Keşfetmeye başla</span>
                <div className="h-8 w-5 rounded-full border-2 border-white/20 p-1">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-1.5 w-1.5 rounded-full bg-gold"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Wave at bottom of hero */}
          <WaveBackground />
        </section>

        {/* ─── Stats ─────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 py-12">
          <StatsBar />
        </section>

        {/* ─── Arc Timeline ──────────────────────────────────────────────── */}
        <ArcTimeline />
      </main>

      <Footer />
    </>
  )
}

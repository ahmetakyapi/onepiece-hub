'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Sparkles, Map, Cherry } from 'lucide-react'
import { EASE } from '@/lib/variants'

const PoneglyphOverlay = dynamic(() => import('@/components/home/PoneglyphOverlay'), { ssr: false })

export default function VoidCenturySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '15%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.08, 1.18])
  const poneglyphOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0.5, 0.65, 0.3])

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden py-20 sm:py-28"
    >
      {/* Parallax ocean-deep background with vignette */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-ocean-surface/80 to-ocean-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(244,163,0,0.08),transparent_70%)]" />
      </motion.div>

      {/* Poneglyph overlay — scroll-progress driven */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: poneglyphOpacity }}
      >
        <PoneglyphOverlay />
      </motion.div>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-gold/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-sea/[0.08] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Pulsing lore badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-sea/25 bg-ocean-deep/60 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-sea-light sm:text-[11px]">
            POSEIDON&apos;UN SESİ
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="mb-5 text-[28px] font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl"
        >
          <span className="block text-white/90">Void Century&apos;nin</span>
          <span className="block text-gold-gradient">sırları burada.</span>
        </motion.h2>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          className="mx-auto mb-6 h-px w-32 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(244,163,0,0.6), rgba(30,144,255,0.5), transparent)',
          }}
        />

        {/* Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          className="mx-auto mb-8 max-w-xl text-[13px] leading-relaxed text-white/75 sm:text-base"
        >
          800 yıl önce kaybolan bir çağ. 32 arc&apos;lık destansı yolculuk.
          <span className="text-gold"> 61 karakter, 12 mürettebat, 43 Şeytan Meyvesi </span>
          ve henüz söylenmemiş binlerce hikaye.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm"
        >
          <Link
            href="/timeline"
            className="btn-ghost border-gold/20 bg-gold/[0.06] text-gold group !py-2 !px-3 sm:!py-2.5 sm:!px-4"
          >
            <Sparkles className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-12 sm:h-4 sm:w-4" />
            Zaman Çizelgesi
          </Link>
          <Link
            href="/world"
            className="btn-ghost border-sea/20 bg-sea/[0.06] text-sea group !py-2 !px-3 sm:!py-2.5 sm:!px-4"
          >
            <Map className="h-3.5 w-3.5 transition-transform duration-500 group-hover:scale-110 sm:h-4 sm:w-4" />
            Dünya Haritası
          </Link>
          <Link
            href="/devil-fruits"
            className="btn-ghost border-purple-400/20 bg-purple-400/[0.06] text-purple-300 group !py-2 !px-3 sm:!py-2.5 sm:!px-4"
          >
            <Cherry className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-12 sm:h-4 sm:w-4" />
            Şeytan Meyveleri
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

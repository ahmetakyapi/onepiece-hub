'use client'

import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useRef } from 'react'
import { Crown, Globe, Anchor, Compass, Flame, Swords } from 'lucide-react'

type Era = {
  id: string
  label: string
  headline: string
  desc: string
  icon: typeof Crown
  rgb: string
  years: string
}

const ERAS: Era[] = [
  {
    id: 'ancient',
    label: 'Antik Tarih',
    headline: 'Büyük Krallık',
    desc: 'Joy Boy\'un yaşadığı çağ. Poneglyph\'lerin yaratıldığı, Dünya Hükümeti\'nin kurulduğu dönem. Tarih bu noktadan sonra susturuldu.',
    icon: Crown,
    rgb: '251,191,36',
    years: '~900 yıl önce',
  },
  {
    id: 'past',
    label: 'Geçmiş',
    headline: 'Rocks & Roger Çağı',
    desc: 'God Valley olayı, Rocks Korsanları\'nın çöküşü. Roger Grand Line\'ı fethetti, One Piece Laugh Tale\'e bırakıldı. Ohara yok edildi.',
    icon: Globe,
    rgb: '168,85,247',
    years: '~40 – 26 yıl önce',
  },
  {
    id: 'pre-story',
    label: 'Hikaye Öncesi',
    headline: 'Hasır Şapkanın Sözü',
    desc: 'Shanks küçük Luffy\'ye hasır şapkayı emanet etti. Ace, Sabo, Luffy kardeşlik yemini etti. Korsan Kralı olma hayali doğdu.',
    icon: Anchor,
    rgb: '30,144,255',
    years: '~12 yıl önce',
  },
  {
    id: 'east-blue',
    label: 'East Blue',
    headline: 'Mürettebat Kuruluyor',
    desc: 'Luffy 17 yaşında denize açıldı. Zoro, Nami, Usopp, Sanji — her biri kendi hayalinin peşinde katıldı. Arlong yenildi, Grand Line bekliyor.',
    icon: Compass,
    rgb: '96,165,250',
    years: 'Yıl 1',
  },
  {
    id: 'grand-line',
    label: 'Grand Line',
    headline: 'Cennetten Cehenneme',
    desc: 'Alabasta\'dan Marineford\'a. Dünya Hükümeti\'ne savaş ilan edildi, Ace kaybedildi. 2 yıllık eğitim sonrası mürettebat geri döndü.',
    icon: Flame,
    rgb: '244,163,0',
    years: 'Yıl 1 – 3',
  },
  {
    id: 'new-world',
    label: 'New World',
    headline: 'Joy Boy Uyanıyor',
    desc: 'Doflamingo, Big Mom, Kaido birer birer yenildi. Luffy Gear 5\'i uyandırdı — Nika geri döndü. Yonko ilan edildi. Laugh Tale yakında.',
    icon: Swords,
    rgb: '231,76,60',
    years: 'Yıl 3+',
  },
]

function EraScene({ era, index, total, scrollYProgress }: {
  era: Era
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const segment = 1 / total
  const start = index * segment
  const end = (index + 1) * segment
  const mid = start + segment / 2
  const fadeIn = start + segment * 0.15
  const fadeOut = end - segment * 0.15

  const opacity = useTransform(
    scrollYProgress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0],
  )
  const scale = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.8, 1, 1.2],
  )
  const blur = useTransform(
    scrollYProgress,
    [start, fadeIn, fadeOut, end],
    ['12px', '0px', '0px', '12px'],
  )
  const filter = useMotionTemplate`blur(${blur})`

  const Icon = era.icon

  return (
    <motion.div
      style={{ opacity, scale, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 800px 500px at 50% 50%, rgba(${era.rgb}, 0.22), transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border sm:mb-6 sm:h-16 sm:w-16"
          style={{
            borderColor: `rgba(${era.rgb}, 0.4)`,
            background: `rgba(${era.rgb}, 0.12)`,
            boxShadow: `0 0 40px rgba(${era.rgb}, 0.3)`,
          }}
        >
          <Icon className="h-5 w-5 sm:h-7 sm:w-7" style={{ color: `rgb(${era.rgb})` }} />
        </div>

        <p
          className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] sm:mb-3 sm:text-[11px] sm:tracking-[0.3em]"
          style={{ color: `rgb(${era.rgb})` }}
        >
          {era.years} • Bölüm {index + 1} / {total}
        </p>

        <p
          className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] sm:mb-2 sm:text-xs sm:tracking-[0.2em]"
          style={{ color: `rgba(${era.rgb}, 0.85)` }}
        >
          {era.label}
        </p>

        <h3 className="mb-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-pirate-text drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:mb-5 sm:text-5xl md:text-6xl">
          {era.headline}
        </h3>

        <p className="mx-auto max-w-xl text-[13px] leading-relaxed text-pirate-muted sm:text-base">
          {era.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function EraShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={ref}
      className="relative h-[490vh] sm:h-[630vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-ocean-deep">
        {ERAS.map((era, i) => (
          <EraScene
            key={era.id}
            era={era}
            index={i}
            total={ERAS.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto max-w-sm px-6 sm:bottom-10">
          <div className="rounded-full border border-pirate-border/30 bg-ocean-deep/70 p-3 backdrop-blur-md">
            <div className="h-[3px] overflow-hidden rounded-full bg-pirate-border/40">
              <motion.div
                className="h-full bg-gradient-to-r from-gold via-sea to-luffy"
                style={{ width: progress }}
              />
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-gold/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Kaydırmaya devam — 900 yıllık yolculuk
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

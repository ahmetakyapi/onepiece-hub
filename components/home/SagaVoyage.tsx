'use client'

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { SAGAS } from '@/lib/constants/sagas'
import { SAGA_META } from '@/lib/constants/saga-meta'
import { getArcsBySaga } from '@/lib/constants/arcs'
import { getArcImage } from '@/lib/constants/images'
import { useMotionGate } from '@/hooks/useMotionGate'
import SplitText from '@/components/motion/SplitText'

/* ═══ Saga Rotası — sabitlenmiş yatay galeri ══════════════════════════════
   Desktop: bölüm ekrana sabitlenir, dikey kaydırma 10 sagalık şeridi yatayda
   sürer. Her kartın görseli kendi içinde ters yönde kayar (iç parallax).
   Mobil / hareket azaltma: sabitleme yok, yerel yatay kaydırma + snap.

   Sabitleme `position: sticky` ile — bu yüzden ATA elemanlarda
   `overflow: hidden` OLMAMALI (sticky'yi öldürür). Ana sayfa `<main>`i bu
   sebeple `overflow-x-clip` taşır. */

const DATA = SAGAS.map((saga, i) => {
  const meta = SAGA_META[saga.slug]
  const arcs = getArcsBySaga(saga.slug)
  return {
    index: i + 1,
    slug: saga.slug,
    name: saga.name,
    tagline: meta?.tagline ?? '',
    era: meta?.era ?? '',
    image: getArcImage(meta?.featuredArc ?? saga.arcs[0]),
    arcCount: arcs.length,
    episodes: arcs.reduce((s, a) => s + a.episodeCount, 0),
  }
})

type Item = (typeof DATA)[number]

const SagaPanel = memo(function SagaPanel({
  item,
  progress,
  total,
  pinned,
}: {
  item: Item
  progress: MotionValue<number>
  total: number
  pinned: boolean
}) {
  // Kart şeritteki konumuna göre görselini ters yönde kaydırır
  const center = (item.index - 0.5) / total
  const imgX = useTransform(progress, [center - 0.5, center + 0.5], ['12%', '-12%'])

  return (
    <Link
      href={`/sagas/${item.slug}`}
      className={`group relative flex shrink-0 snap-center flex-col overflow-hidden rounded-[28px] border border-pirate-border/30 bg-ocean-surface ${
        pinned ? 'h-[68vh] w-[min(42vw,560px)]' : 'h-[460px] w-[82vw] max-w-[380px]'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-y-0 -inset-x-[16%]" style={pinned ? { x: imgX } : undefined}>
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 768px) 42vw, 82vw"
            className="object-cover transition-transform duration-[1.4s] ease-expo-out group-hover:scale-[1.06]"
          />
        </motion.div>
        {/* Görsel sahnesi her iki temada koyu kalır — metin beyaz üstünde okunur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between p-6 sm:p-7">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
          {item.era}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-black">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative mt-auto p-6 sm:p-7">
        <span className="saga-index pointer-events-none block font-mono text-[72px] font-bold leading-none sm:text-[110px]">
          {String(item.index).padStart(2, '0')}
        </span>
        <h3 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{item.name}</h3>
        <p className="mt-1 text-sm text-white/75 sm:text-base">{item.tagline}</p>
        <div className="mt-5 flex items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
          <span>{item.arcCount} arc</span>
          <span className="h-px w-6 bg-white/30" />
          <span>{item.episodes} bölüm</span>
        </div>
      </div>
    </Link>
  )
})

export default function SagaVoyage() {
  const pinned = useMotionGate()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const barScale = useTransform(smooth, [0, 1], [0.04, 1])
  const counter = useTransform(smooth, (v) =>
    String(Math.min(DATA.length, Math.max(1, Math.round(v * (DATA.length - 1)) + 1))).padStart(2, '0'),
  )

  useEffect(() => {
    if (!pinned) return
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [pinned])

  const heading = (
    <div className="flex max-w-xl flex-col">
      <SplitText
        as="h2"
        className="text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl"
        parts={[
          { text: 'On saga,', className: 'text-pirate-text' },
          { text: 'tek rota.', className: 'text-gold-gradient' },
        ]}
        breakAfter={[{ index: 0 }]}
      />
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-pirate-muted sm:text-base">
        East Blue&apos;dan Egghead&apos;e kadar Grand Line&apos;ın her durağı.
        Kaydır, rotayı takip et.
      </p>
    </div>
  )

  if (!pinned) {
    return (
      <section className="relative z-10 py-20">
        <div className="px-6">{heading}</div>
        <div className="scrollbar-thin mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {DATA.map((item) => (
            <SagaPanel key={item.slug} item={item} progress={smooth} total={DATA.length} pinned={false} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative z-10" style={{ height: `${DATA.length * 55 + 60}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} className="flex items-center gap-6 pl-[6vw] pr-[6vw]" style={{ x }}>
          <div className="w-[min(34vw,460px)] shrink-0 pr-6">{heading}</div>
          {DATA.map((item) => (
            <SagaPanel key={item.slug} item={item} progress={smooth} total={DATA.length} pinned />
          ))}
        </motion.div>

        {/* İlerleme — sayaç + çizgi */}
        <div className="absolute bottom-8 right-[6vw] flex w-[min(44vw,560px)] items-center gap-5 font-mono text-xs font-bold text-pirate-muted">
          <motion.span className="tabular-nums text-gold">{counter}</motion.span>
          <div className="h-px flex-1 bg-pirate-border/40">
            <motion.div className="h-full origin-left bg-gradient-to-r from-gold to-sea-light" style={{ scaleX: barScale }} />
          </div>
          <span className="tabular-nums">{String(DATA.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

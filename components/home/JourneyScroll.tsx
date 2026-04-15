'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Anchor, Compass, Crown, Flame, Skull, Swords, Waves } from 'lucide-react'
import { EASE } from '@/lib/variants'

/* ─── Journey milestones — Luffy's path through the Grand Line ────────── */
const MILESTONES = [
  {
    era: 'Başlangıç',
    title: 'Bir Rüya Doğuyor',
    subtitle: 'East Blue',
    description: 'Bir hasır şapka, bir söz ve sonsuz bir hayal. Luffy, korsan kralı olmak için Foosha Köyü\'nden yola çıkar.',
    icon: Anchor,
    color: 'text-sea',
    bg: 'from-sea/20 to-sea/5',
    glowColor: 'rgba(30,144,255,0.3)',
  },
  {
    era: 'Büyük Macera',
    title: 'Grand Line\'a Giriş',
    subtitle: 'Reverse Mountain',
    description: 'Okyanus tersine akar, dalgalar göklere yükselir. Hasır Şapkalar Grand Line\'a adım atar ve asıl macera başlar.',
    icon: Compass,
    color: 'text-gold',
    bg: 'from-gold/20 to-gold/5',
    glowColor: 'rgba(244,163,0,0.3)',
  },
  {
    era: 'Fırtına',
    title: 'Savaş ve Kayıp',
    subtitle: 'Marineford',
    description: 'Denizin ortasında bir savaş, yüz binlerce asker, ve bir kardeşin son nefesi. Luffy her şeyi kaybeder... ama ayağa kalkar.',
    icon: Swords,
    color: 'text-luffy',
    bg: 'from-luffy/20 to-luffy/5',
    glowColor: 'rgba(231,76,60,0.3)',
  },
  {
    era: 'Yeni Dünya',
    title: 'İmparatorların Denizi',
    subtitle: 'New World',
    description: 'Dört İmparator\'un hüküm sürdüğü sulara girmek, cesaret değil delilik gerektirir. Luffy\'nin ikisi de var.',
    icon: Crown,
    color: 'text-gold-bright',
    bg: 'from-gold-bright/20 to-gold-bright/5',
    glowColor: 'rgba(251,191,36,0.3)',
  },
  {
    era: 'Uyanış',
    title: 'Güneş Tanrısı Nika',
    subtitle: 'Gear 5',
    description: 'Efsane gerçek olur. Yüzyılların karanlığını aydınlatacak güç uyanır. Luffy artık sadece bir korsan değil — özgürlüğün kendisidir.',
    icon: Flame,
    color: 'text-gold',
    bg: 'from-gold/20 to-gold/5',
    glowColor: 'rgba(244,163,0,0.4)',
  },
  {
    era: 'Son Yolculuk',
    title: 'One Piece',
    subtitle: 'Laugh Tale',
    description: 'Tüm denizlerin sonu, tüm hikayelerin başlangıcı. Korsan Kralı\'nın hazinesi orada bekliyor...',
    icon: Skull,
    color: 'text-pirate-text',
    bg: 'from-pirate-text/10 to-pirate-text/5',
    glowColor: 'rgba(232,234,240,0.2)',
  },
]

function MilestoneCard({ milestone, index }: { milestone: typeof MILESTONES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex items-center gap-8 md:gap-12">
      {/* Timeline node */}
      <div className="absolute left-1/2 z-10 -translate-x-1/2 md:left-1/2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="relative flex h-12 w-12 items-center justify-center"
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-slow"
            style={{ boxShadow: `0 0 20px ${milestone.glowColor}, 0 0 40px ${milestone.glowColor}` }}
          />
          {/* Icon circle */}
          <div className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-current bg-ocean-deep ${milestone.color}`}>
            <milestone.icon className="h-4 w-4" />
          </div>
        </motion.div>
      </div>

      {/* Content card — alternating sides */}
      <motion.div
        initial={{
          opacity: 0,
          x: isLeft ? -60 : 60,
          filter: 'blur(8px)',
        }}
        animate={inView ? {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
        } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
        className={`hidden w-[calc(50%-3rem)] md:block ${isLeft ? 'mr-auto text-right' : 'ml-auto text-left'}`}
      >
        <span className={`mb-1 inline-block rounded-full bg-gradient-to-r ${milestone.bg} px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${milestone.color}`}>
          {milestone.era}
        </span>
        <h3 className="mb-1 text-xl font-extrabold text-pirate-text lg:text-2xl">
          {milestone.title}
        </h3>
        <p className="mb-2 text-xs font-semibold text-pirate-muted/50">{milestone.subtitle}</p>
        <p className="text-sm leading-relaxed text-pirate-muted">
          {milestone.description}
        </p>
      </motion.div>

      {/* Mobile: card below timeline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="ml-16 block w-full md:hidden"
      >
        <span className={`mb-1 inline-block rounded-full bg-gradient-to-r ${milestone.bg} px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${milestone.color}`}>
          {milestone.era}
        </span>
        <h3 className="mb-1 text-lg font-extrabold text-pirate-text">
          {milestone.title}
        </h3>
        <p className="mb-1 text-xs font-semibold text-pirate-muted/50">{milestone.subtitle}</p>
        <p className="text-sm leading-relaxed text-pirate-muted">
          {milestone.description}
        </p>
      </motion.div>
    </div>
  )
}

export default function JourneyScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section ref={containerRef} className="relative z-10 overflow-hidden px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={headerInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-sea/15 bg-sea/[0.06]"
          >
            <Waves className="h-6 w-6 text-sea" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mb-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl"
          >
            <span className="text-pirate-text">Luffy&apos;nin </span>
            <span className="text-gold-gradient">Yolculuğu</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="mx-auto max-w-lg text-sm text-pirate-muted sm:text-base"
          >
            Foosha Köyü&apos;nden Laugh Tale&apos;e — scroll ile bu destansı yolculuğu keşfet.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — background */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-pirate-border/30 to-transparent md:block hidden" />

          {/* Animated progress line */}
          <div className="absolute left-1/2 top-0 w-px -translate-x-1/2 overflow-hidden md:block hidden" style={{ height: '100%' }}>
            <motion.div
              className="w-full bg-gradient-to-b from-sea via-gold to-luffy"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Traveling glow dot */}
          <motion.div
            className="absolute left-1/2 z-20 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-gold-glow md:block hidden"
            style={{ top: glowY }}
          />

          {/* Mobile vertical line */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-pirate-border/30 to-transparent md:hidden" />

          {/* Milestones */}
          <div className="space-y-20 md:space-y-24">
            {MILESTONES.map((milestone, i) => (
              <MilestoneCard key={milestone.title} milestone={milestone} index={i} />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-col items-center"
          >
            <div className="h-8 w-px bg-gradient-to-b from-pirate-border/30 to-transparent" />
            <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <div className="h-2 w-2 rounded-full bg-gold" />
            </div>
            <p className="mt-3 text-xs italic text-pirate-muted/50">
              Macera devam ediyor...
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

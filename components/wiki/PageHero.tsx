'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import SplitText from '@/components/motion/SplitText'
import { EASE_REVEAL } from '@/lib/motion'
import { useMotionGate } from '@/hooks/useMotionGate'

// Pre-defined accent color classes to prevent Tailwind JIT purging
const ACCENT_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  gold:        { border: 'border-gold/20',        bg: 'bg-gold/[0.06]',        text: 'text-gold' },
  sea:         { border: 'border-sea/20',         bg: 'bg-sea/[0.06]',         text: 'text-sea' },
  luffy:       { border: 'border-luffy/20',       bg: 'bg-luffy/[0.06]',       text: 'text-luffy' },
  purple:      { border: 'border-fruit-strong/20',  bg: 'bg-fruit-strong/[0.06]',  text: 'text-fruit-strong' },
  'fruit':{ border: 'border-fruit/20',  bg: 'bg-fruit/[0.06]',  text: 'text-fruit' },
} as const

type Orb = {
  color: string
  size: number
  x: string
  y: string
  delay: number
}

type PageHeroProps = {
  icon: LucideIcon
  title: string
  titleGradient?: string
  subtitle: string
  description?: string
  accentColor: string
  orbs: Orb[]
  children?: React.ReactNode
  gridOverlay?: boolean
}

export default function PageHero({
  icon: Icon,
  title,
  titleGradient,
  subtitle,
  description,
  accentColor,
  orbs,
  children,
  gridOverlay = true,
}: PageHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const parallax = useMotionGate()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])
  const accent = ACCENT_STYLES[accentColor]

  /* Kart çerçevesi açılışta ortadan dışa doğru açılır (clip-path); başlık
     maskeli kelimelerle yükselir, ikon dönerek yerine oturur. Kaydırınca
     içerik zeminden yavaş kayar (desktop). */
  return (
    <motion.section
      ref={heroRef}
      className="relative mb-12 overflow-hidden rounded-3xl border border-pirate-border/20"
      initial={reduced ? false : { clipPath: 'inset(8% 6% 8% 6% round 48px)', opacity: 0 }}
      animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1, transitionEnd: { clipPath: 'none' } }}
      transition={{ duration: 1.2, ease: EASE_REVEAL }}
    >
      {/* Background */}
      <div className="absolute inset-0 -top-20 -bottom-20">
        {/* Animated gradient orbs — CSS animation instead of Framer Motion */}
        {orbs.slice(0, 2).map((orb, i) => (
          <div
            key={i}
            className="orb animate-orb-breathe"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: orb.color,
              '--orb-duration': `${6 + i * 2}s`,
              animationDelay: `${orb.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Grid overlay */}
      {gridOverlay && (
        <div className="absolute inset-0 bg-grid-dot opacity-40" />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 px-8 py-14 sm:px-12 sm:py-20"
        style={parallax ? { y: contentY, opacity: contentOpacity } : undefined}
      >
        {/* Icon badge */}
        <motion.div
          initial={reduced ? false : { scale: 0.4, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_REVEAL, delay: 0.25 }}
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${accent?.border ?? 'border-gold/20'} ${accent?.bg ?? 'bg-gold/[0.06]'}`}
        >
          <Icon className={`h-7 w-7 ${accent?.text ?? 'text-gold'}`} />
        </motion.div>

        {/* Title */}
        <SplitText
          as="h1"
          play
          delay={0.3}
          stagger={0.07}
          className="mb-3 text-3xl font-bold sm:text-4xl lg:text-5xl"
          parts={[
            { text: title, className: titleGradient ?? 'text-gold-gradient' },
            { text: subtitle, className: 'text-pirate-text' },
          ]}
        />

        {/* Description */}
        {description && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_REVEAL, delay: 0.55 }}
            className="max-w-2xl text-sm leading-relaxed text-pirate-muted sm:text-base"
          >
            {description}
          </motion.p>
        )}

        {/* Extra content */}
        {children && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_REVEAL, delay: 0.68 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}

        {/* Altın çizgi — başlığın altından soldan sağa çekilir */}
        <motion.div
          aria-hidden
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE_REVEAL, delay: 0.5 }}
          className="mt-8 h-px w-40 origin-left bg-gradient-to-r from-gold/60 via-sea/40 to-transparent"
        />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ocean-deep to-transparent" />
    </motion.section>
  )
}

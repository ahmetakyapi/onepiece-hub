'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

// Pre-defined accent color classes to prevent Tailwind JIT purging
const ACCENT_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  gold:        { border: 'border-gold/20',        bg: 'bg-gold/[0.06]',        text: 'text-gold' },
  sea:         { border: 'border-sea/20',         bg: 'bg-sea/[0.06]',         text: 'text-sea' },
  luffy:       { border: 'border-luffy/20',       bg: 'bg-luffy/[0.06]',       text: 'text-luffy' },
  purple:      { border: 'border-purple-500/20',  bg: 'bg-purple-500/[0.06]',  text: 'text-purple-500' },
  'purple-400':{ border: 'border-purple-400/20',  bg: 'bg-purple-400/[0.06]',  text: 'text-purple-400' },
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
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Only track scroll on desktop — saves scroll event overhead on mobile
  const shouldParallax = !isMobile && !prefersReducedMotion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <motion.section
      ref={heroRef}
      style={shouldParallax ? { opacity } : undefined}
      className="relative mb-12 overflow-hidden rounded-3xl border border-pirate-border/20"
    >
      {/* Background */}
      <motion.div
        style={shouldParallax ? { y: bgY } : undefined}
        className="absolute inset-0 -top-20 -bottom-20"
      >
        {/* Animated gradient orbs — fewer on mobile */}
        {(isMobile ? orbs.slice(0, 2) : orbs).map((orb, i) => (
          <motion.div
            key={i}
            className="orb"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: orb.color,
            }}
            animate={prefersReducedMotion ? undefined : {
              scale: [1, 1.3, 1],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Grid overlay */}
      {gridOverlay && (
        <div className="absolute inset-0 bg-grid-dot opacity-40" />
      )}

      {/* Content */}
      <div className="relative z-10 px-8 py-14 sm:px-12 sm:py-20">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${ACCENT_STYLES[accentColor]?.border ?? 'border-gold/20'} ${ACCENT_STYLES[accentColor]?.bg ?? 'bg-gold/[0.06]'}`}
        >
          <Icon className={`h-7 w-7 ${ACCENT_STYLES[accentColor]?.text ?? 'text-gold'}`} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mb-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl"
        >
          <span className={titleGradient ?? 'text-gold-gradient'}>{title}</span>{' '}
          <span className="text-pirate-text">{subtitle}</span>
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="max-w-2xl text-sm leading-relaxed text-pirate-muted sm:text-base"
          >
            {description}
          </motion.p>
        )}

        {/* Extra content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ocean-deep to-transparent" />
    </motion.section>
  )
}

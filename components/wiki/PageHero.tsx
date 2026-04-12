'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EASE } from '@/lib/variants'

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
  description: string
  accentColor: string       // e.g. 'gold', 'sea', 'luffy', 'purple-400'
  orbs: Orb[]
  children?: React.ReactNode // extra content inside hero (stats, badges, etc.)
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity }}
      className="relative mb-12 overflow-hidden rounded-3xl border border-pirate-border/50"
    >
      {/* Background gradient */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-20 -bottom-20"
      >
        {/* Animated gradient orbs */}
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: orb.color,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
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
        <div className="absolute inset-0 bg-grid-ocean bg-grid opacity-30" />
      )}

      {/* Content */}
      <div className="relative z-10 px-8 py-14 sm:px-12 sm:py-20">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-${accentColor}/30 bg-${accentColor}/10 shadow-lg`}
        >
          <Icon className={`h-8 w-8 text-${accentColor}`} />
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="max-w-2xl text-base leading-relaxed text-pirate-muted sm:text-lg"
        >
          {description}
        </motion.p>

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

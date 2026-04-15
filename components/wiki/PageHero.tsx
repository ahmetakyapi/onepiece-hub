'use client'

import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

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

  return (
    <section
      ref={heroRef}
      className="relative mb-12 overflow-hidden rounded-3xl border border-pirate-border/20"
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
      <div className="relative z-10 px-8 py-14 sm:px-12 sm:py-20">
        {/* Icon badge */}
        <div
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border animate-fade-in-up ${ACCENT_STYLES[accentColor]?.border ?? 'border-gold/20'} ${ACCENT_STYLES[accentColor]?.bg ?? 'bg-gold/[0.06]'}`}
        >
          <Icon className={`h-7 w-7 ${ACCENT_STYLES[accentColor]?.text ?? 'text-gold'}`} />
        </div>

        {/* Title */}
        <h1
          className="mb-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl animate-fade-in-up"
          style={{ animationDelay: '0.05s' }}
        >
          <span className={titleGradient ?? 'text-gold-gradient'}>{title}</span>{' '}
          <span className="text-pirate-text">{subtitle}</span>
        </h1>

        {/* Description */}
        {description && (
          <p
            className="max-w-2xl text-sm leading-relaxed text-pirate-muted sm:text-base animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            {description}
          </p>
        )}

        {/* Extra content */}
        {children && (
          <div
            className="mt-6 animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ocean-deep to-transparent" />
    </section>
  )
}

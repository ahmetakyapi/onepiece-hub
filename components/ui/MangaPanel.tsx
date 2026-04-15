'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { EASE } from '@/lib/variants'
import type { ReactNode } from 'react'

/* ─── Manga-style panel grid ─────────────────────────────────────────── */
interface MangaPanelGridProps {
  children: ReactNode
  layout?: 'classic' | 'action' | 'wide'
  className?: string
}

const layoutClasses: Record<string, string> = {
  classic: 'manga-grid-classic',
  action: 'manga-grid-action',
  wide: 'manga-grid-wide',
}

export function MangaPanelGrid({ children, layout = 'classic', className }: MangaPanelGridProps) {
  return (
    <div className={cn('manga-grid', layoutClasses[layout], className)}>
      {children}
    </div>
  )
}

/* ─── Single manga panel ─────────────────────────────────────────────── */
interface MangaPanelProps {
  children: ReactNode
  className?: string
  diagonal?: boolean
  highlight?: boolean
}

export function MangaPanel({ children, className, diagonal, highlight }: MangaPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        'manga-panel relative overflow-hidden',
        diagonal && 'manga-panel-diagonal',
        highlight && 'manga-panel-highlight',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

/* ─── Manga-style section divider ────────────────────────────────────── */
interface MangaDividerProps {
  variant?: 'speed-lines' | 'impact' | 'slash'
  className?: string
}

export function MangaDivider({ variant = 'speed-lines', className }: MangaDividerProps) {
  if (variant === 'impact') {
    return (
      <div className={cn('manga-divider-impact relative my-12 flex items-center justify-center', className)} aria-hidden="true">
        <div className="manga-impact-burst" />
      </div>
    )
  }

  if (variant === 'slash') {
    return (
      <div className={cn('relative my-10 h-16 overflow-hidden', className)} aria-hidden="true">
        <svg viewBox="0 0 1200 64" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,32 L400,28 L500,4 L550,60 L600,12 L650,52 L700,8 L800,36 L1200,32"
            fill="none"
            stroke="url(#slash-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="slash-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgba(244,163,0,0.4)" />
              <stop offset="50%" stopColor="rgba(231,76,60,0.6)" />
              <stop offset="70%" stopColor="rgba(244,163,0,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  // speed-lines
  return (
    <div className={cn('manga-speed-lines relative my-10 h-12', className)} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="manga-speed-line"
          style={{
            top: `${8 + Math.random() * 84}%`,
            left: `${Math.random() * 20}%`,
            width: `${60 + Math.random() * 40}%`,
            animationDelay: `${i * 0.05}s`,
            opacity: 0.15 + Math.random() * 0.25,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Manga-style effect text (SFX) ──────────────────────────────────── */
interface MangaSFXProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sfxSizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
}

export function MangaSFX({ text, className, size = 'md' }: MangaSFXProps) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -12, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={cn(
        'manga-sfx inline-block font-extrabold italic',
        sfxSizes[size],
        className,
      )}
      style={{
        WebkitTextStroke: '1px rgba(6,14,26,0.5)',
        textShadow: '3px 3px 0 rgba(6,14,26,0.3)',
        paintOrder: 'stroke fill',
      }}
    >
      {text}
    </motion.span>
  )
}

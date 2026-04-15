'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Anchor, Users, Crown, Shield, Skull, Swords, Sparkles } from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/wiki/PageHero'
import { CREWS, CREW_TYPE_LABELS } from '@/lib/constants/crews'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const TYPE_ICONS: Record<string, typeof Anchor> = {
  pirate: Skull,
  marine: Shield,
  government: Crown,
  revolutionary: Swords,
  other: Anchor,
}

const TYPE_COLORS: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  pirate: { border: 'border-gold/50', glow: 'shadow-[0_0_24px_rgba(244,163,0,0.3)]', text: 'text-gold', bg: 'bg-gold/10' },
  marine: { border: 'border-sea/50', glow: 'shadow-[0_0_24px_rgba(30,144,255,0.3)]', text: 'text-sea', bg: 'bg-sea/10' },
  government: { border: 'border-amber-400/50', glow: 'shadow-[0_0_24px_rgba(251,191,36,0.3)]', text: 'text-amber-400', bg: 'bg-amber-400/10' },
  revolutionary: { border: 'border-green-400/50', glow: 'shadow-[0_0_24px_rgba(74,222,128,0.3)]', text: 'text-green-400', bg: 'bg-green-400/10' },
  other: { border: 'border-pirate-muted/50', glow: 'shadow-[0_0_24px_rgba(200,200,220,0.15)]', text: 'text-pirate-muted', bg: 'bg-pirate-muted/10' },
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; ring: string }> = {
  active: { label: 'Aktif', dot: 'bg-green-400', ring: 'ring-green-400/30' },
  defeated: { label: 'Yenilmiş', dot: 'bg-luffy', ring: 'ring-luffy/30' },
  disbanded: { label: 'Dağıtılmış', dot: 'bg-pirate-muted/60', ring: 'ring-pirate-muted/20' },
  unknown: { label: 'Bilinmiyor', dot: 'bg-pirate-muted/40', ring: 'ring-pirate-muted/10' },
}

const CREW_BORDER_COLORS: Record<string, string> = {
  'text-gold': 'from-gold/80 via-gold/40 to-transparent',
  'text-gold-bright': 'from-gold-bright/80 via-gold-bright/40 to-transparent',
  'text-luffy': 'from-luffy/80 via-luffy/40 to-transparent',
  'text-sea': 'from-sea/80 via-sea/40 to-transparent',
  'text-green-400': 'from-green-400/80 via-green-400/40 to-transparent',
  'text-emerald-400': 'from-emerald-400/80 via-emerald-400/40 to-transparent',
  'text-purple-400': 'from-purple-400/80 via-purple-400/40 to-transparent',
  'text-pink-400': 'from-pink-400/80 via-pink-400/40 to-transparent',
  'text-amber-400': 'from-amber-400/80 via-amber-400/40 to-transparent',
  'text-slate-400': 'from-slate-400/80 via-slate-400/40 to-transparent',
  'text-pirate-text': 'from-pirate-text/60 via-pirate-text/30 to-transparent',
}

const CREW_HOVER_GLOW: Record<string, string> = {
  'text-gold': 'hover:shadow-[0_0_30px_rgba(244,163,0,0.15)]',
  'text-gold-bright': 'hover:shadow-[0_0_30px_rgba(244,163,0,0.15)]',
  'text-luffy': 'hover:shadow-[0_0_30px_rgba(231,76,60,0.15)]',
  'text-sea': 'hover:shadow-[0_0_30px_rgba(30,144,255,0.15)]',
  'text-green-400': 'hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]',
  'text-emerald-400': 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
  'text-purple-400': 'hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]',
  'text-pink-400': 'hover:shadow-[0_0_30px_rgba(244,114,182,0.15)]',
  'text-amber-400': 'hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]',
  'text-slate-400': 'hover:shadow-[0_0_30px_rgba(148,163,184,0.1)]',
  'text-pirate-text': 'hover:shadow-[0_0_30px_rgba(200,200,220,0.1)]',
}

function AvatarStack({ count }: { count: number }) {
  const shown = Math.min(count, 5)
  const extra = count - shown
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {Array.from({ length: shown }).map((_, i) => (
          <div
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ocean-deep bg-pirate-border/40 text-[8px] font-bold text-pirate-muted"
            style={{ zIndex: shown - i }}
          >
            <Users className="h-3 w-3" />
          </div>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-1.5 text-[10px] font-semibold text-pirate-muted">
          +{extra}
        </span>
      )}
      <span className="ml-2 text-xs text-pirate-muted">
        {count} üye
      </span>
    </div>
  )
}

export default function CrewsPage() {
  const [activeType, setActiveType] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return activeType ? CREWS.filter((c) => c.type === activeType) : CREWS
  }, [activeType])

  const types = [...new Set(CREWS.map((c) => c.type))]

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <PageHero
            icon={Anchor}
            title="Mürettebat"
            subtitle="& Organizasyonlar"
            description="Yonko mürettebatlarından Deniz Kuvvetleri'ne, Devrimci Ordu'dan Dünya Hükümeti'ne kadar One Piece evreninin tüm büyük güçleri."
            accentColor="gold"
            orbs={[
              { color: 'rgba(244,163,0,0.4)', size: 280, x: '5%', y: '10%', delay: 0 },
              { color: 'rgba(30,144,255,0.3)', size: 200, x: '70%', y: '20%', delay: 1.5 },
              { color: 'rgba(231,76,60,0.25)', size: 160, x: '85%', y: '60%', delay: 3 },
              { color: 'rgba(74,222,128,0.2)', size: 140, x: '30%', y: '70%', delay: 2 },
            ]}
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-pirate-muted">
              <span className="flex items-center gap-1.5">
                <Skull className="h-4 w-4 text-gold/70" />
                <span className="font-semibold text-pirate-text">{CREWS.length}</span> organizasyon
              </span>
              <span className="h-4 w-px bg-pirate-border" />
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-sea/70" />
                <span className="font-semibold text-pirate-text">
                  {CREWS.reduce((s, c) => s + c.notableMembers.length, 0)}+
                </span> bilinen üye
              </span>
            </div>
          </PageHero>

          {/* Type Filter Cards */}
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {/* All filter */}
            <motion.button
              variants={fadeUp}
              onClick={() => setActiveType(null)}
              className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
                !activeType
                  ? 'border-gold/40 bg-gold/10 shadow-[0_0_20px_rgba(244,163,0,0.2)]'
                  : 'border-pirate-border/50 bg-ocean-surface/30 hover:border-pirate-border hover:bg-ocean-surface/50'
              }`}
            >
              <Sparkles className={`h-6 w-6 transition-colors ${!activeType ? 'text-gold' : 'text-pirate-muted group-hover:text-pirate-text'}`} />
              <span className={`text-xs font-semibold transition-colors ${!activeType ? 'text-gold' : 'text-pirate-muted group-hover:text-pirate-text'}`}>
                Tümü
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${!activeType ? 'bg-gold/20 text-gold' : 'bg-pirate-border/30 text-pirate-muted'}`}>
                {CREWS.length}
              </span>
            </motion.button>

            {types.map((type) => {
              const Icon = TYPE_ICONS[type] ?? Anchor
              const count = CREWS.filter((c) => c.type === type).length
              const colors = TYPE_COLORS[type] ?? TYPE_COLORS.other
              const isActive = activeType === type

              return (
                <motion.button
                  key={type}
                  variants={fadeUp}
                  onClick={() => setActiveType(activeType === type ? null : type)}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
                    isActive
                      ? `${colors.border} ${colors.bg} ${colors.glow}`
                      : 'border-pirate-border/50 bg-ocean-surface/30 hover:border-pirate-border hover:bg-ocean-surface/50'
                  }`}
                >
                  <Icon className={`h-6 w-6 transition-colors ${isActive ? colors.text : 'text-pirate-muted group-hover:text-pirate-text'}`} />
                  <span className={`text-xs font-semibold transition-colors ${isActive ? colors.text : 'text-pirate-muted group-hover:text-pirate-text'}`}>
                    {CREW_TYPE_LABELS[type]}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? `${colors.bg} ${colors.text}` : 'bg-pirate-border/30 text-pirate-muted'}`}>
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-pirate-muted"
          >
            <span className="font-semibold text-pirate-text">{filtered.length}</span> sonuç gösteriliyor
          </motion.p>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType ?? 'all'}
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((crew) => {
                const borderGradient = CREW_BORDER_COLORS[crew.color] ?? 'from-pirate-border/60 via-pirate-border/30 to-transparent'
                const hoverGlow = CREW_HOVER_GLOW[crew.color] ?? ''
                const status = STATUS_CONFIG[crew.status] ?? STATUS_CONFIG.unknown

                return (
                  <motion.div key={crew.slug} variants={fadeUp}>
                    <Link
                      href={`/crews/${crew.slug}`}
                      className={`bento-card group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:border-gold/20 ${hoverGlow} h-full`}
                    >
                      {/* Top border gradient */}
                      <div className={`h-1 w-full bg-gradient-to-r ${borderGradient}`} />

                      {/* Shine sweep on hover */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute -left-full top-0 h-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-all duration-700 group-hover:left-[120%]" />
                      </div>

                      <div className="relative flex flex-1 flex-col p-5">
                        {/* Header row */}
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className={`mb-1 text-base font-bold ${crew.color} transition-colors group-hover:text-gold`}>
                              {crew.name}
                            </h3>
                            <p className="font-mono text-[10px] text-pirate-muted/50">{crew.japaneseName}</p>
                          </div>
                          {/* Status dot */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className={`relative flex h-2.5 w-2.5`}>
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-40`} />
                              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot} ring-2 ${status.ring}`} />
                            </span>
                            <span className="text-[10px] font-medium text-pirate-muted">
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Type badge */}
                        <div className="mb-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${crew.bg} ${crew.color}`}>
                            {(() => { const TIcon = TYPE_ICONS[crew.type] ?? Anchor; return <TIcon className="h-2.5 w-2.5" /> })()}
                            {CREW_TYPE_LABELS[crew.type]}
                          </span>
                        </div>

                        {/* Captain section */}
                        {crew.captain && (
                          <div className="mb-3 flex items-center gap-2 rounded-lg border border-gold/10 bg-gold/5 px-3 py-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15">
                              <Crown className="h-3.5 w-3.5 text-gold" />
                            </div>
                            <div>
                              <p className="text-[9px] font-medium uppercase tracking-wider text-gold/60">Kaptan</p>
                              <p className="text-xs font-bold text-pirate-text">{crew.captain}</p>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <p className="mb-4 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                          {crew.description}
                        </p>

                        {/* Stats footer */}
                        <div className="mt-auto space-y-3 border-t border-pirate-border/50 pt-3">
                          {/* Member avatar stack */}
                          <AvatarStack count={crew.notableMembers.length} />

                          {/* Bounty badge */}
                          {crew.totalBounty && (
                            <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2">
                              <Skull className="h-3.5 w-3.5 text-gold" />
                              <div>
                                <p className="text-[9px] font-medium uppercase tracking-wider text-gold/50">Toplam Ödül</p>
                                <p className="text-xs font-bold text-gold">{crew.totalBounty} Berry</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16" />
      </main>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  MapPin,
  Anchor,
  Shield,
  Skull,
  Compass,
  Star,
  Waves,
  Map,
  Navigation,
} from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/wiki/PageHero'
import WorldMap from '@/components/world/WorldMap'
import { SEAS, LOCATIONS, getLocationsBySea } from '@/lib/constants/locations'
import { getArcBySlug } from '@/lib/constants/arcs'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const DANGER_COLORS = [
  '',
  'text-green-400',
  'text-yellow-400',
  'text-orange-400',
  'text-luffy',
  'text-red-500',
] as const

const DANGER_BAR_COLORS = [
  '',
  'from-green-500 to-green-400',
  'from-green-400 to-yellow-400',
  'from-yellow-400 to-orange-400',
  'from-orange-400 to-red-500',
  'from-red-500 to-red-600',
] as const

const DANGER_LABELS = ['', 'Güvenli', 'Düşük', 'Orta', 'Yüksek', 'Ölümcül'] as const

const TYPE_LABELS: Record<string, string> = {
  island: 'Ada',
  sea: 'Deniz',
  city: 'Şehir',
  fortress: 'Kale',
  ship: 'Gemi',
  other: 'Diger',
}

const TYPE_ICONS: Record<string, typeof MapPin> = {
  island: MapPin,
  sea: Waves,
  city: Map,
  fortress: Shield,
  ship: Anchor,
  other: Navigation,
}

const SEA_BORDER_COLORS: Record<string, string> = {
  'east-blue': 'border-l-blue-400',
  'west-blue': 'border-l-orange-400',
  'north-blue': 'border-l-cyan-400',
  'south-blue': 'border-l-green-400',
  'grand-line': 'border-l-gold',
  'new-world': 'border-l-luffy',
  'calm-belt': 'border-l-pirate-muted',
  'red-line': 'border-l-luffy',
}

const SEA_GRADIENT_BG: Record<string, string> = {
  'east-blue': 'from-blue-500/20 via-blue-600/10 to-transparent',
  'west-blue': 'from-orange-500/20 via-orange-600/10 to-transparent',
  'north-blue': 'from-cyan-500/20 via-cyan-600/10 to-transparent',
  'south-blue': 'from-green-500/20 via-green-600/10 to-transparent',
  'grand-line': 'from-gold/20 via-gold/10 to-transparent',
  'new-world': 'from-luffy/20 via-luffy/10 to-transparent',
  'calm-belt': 'from-slate-500/15 via-slate-600/10 to-transparent',
  'red-line': 'from-red-500/20 via-red-600/10 to-transparent',
}

const SEA_ACCENT_BG: Record<string, string> = {
  'east-blue': 'bg-blue-400/10 border-blue-400/20',
  'west-blue': 'bg-orange-400/10 border-orange-400/20',
  'north-blue': 'bg-cyan-400/10 border-cyan-400/20',
  'south-blue': 'bg-green-400/10 border-green-400/20',
  'grand-line': 'bg-gold/10 border-gold/20',
  'new-world': 'bg-luffy/10 border-luffy/20',
  'calm-belt': 'bg-slate-400/10 border-slate-400/20',
  'red-line': 'bg-red-400/10 border-red-400/20',
}

const HERO_ORBS = [
  { color: 'rgba(30, 144, 255, 0.4)', size: 300, x: '5%', y: '10%', delay: 0 },
  { color: 'rgba(30, 144, 255, 0.25)', size: 200, x: '70%', y: '20%', delay: 1.5 },
  { color: 'rgba(244, 163, 0, 0.2)', size: 180, x: '85%', y: '60%', delay: 3 },
  { color: 'rgba(6, 182, 212, 0.2)', size: 160, x: '30%', y: '70%', delay: 2 },
]

const WORLD_STRUCTURE_ITEMS = [
  {
    label: 'Red Line',
    color: 'text-luffy',
    bgColor: 'bg-luffy/10 border-luffy/30',
    icon: '|',
    description: 'Dünyayı dikey olarak ikiye bölen devasa kırmızı kıta. Mary Geoise üzerindedir.',
  },
  {
    label: 'Grand Line',
    color: 'text-gold',
    bgColor: 'bg-gold/10 border-gold/30',
    icon: '--',
    description: 'Dünyayı yatay ikiye ayıran "Korsan Mezarlığı". Paradise ve New World olarak iki yarıya ayrılır.',
  },
  {
    label: 'Calm Belt',
    color: 'text-pirate-muted',
    bgColor: 'bg-slate-400/10 border-slate-400/30',
    icon: '~~',
    description: 'Grand Line\'in iki yanındaki rüzgarsız kuşak. Dev Deniz Kralları\'nın yaşadığı alan.',
  },
  {
    label: 'Paradise',
    color: 'text-sea',
    bgColor: 'bg-sea/10 border-sea/30',
    icon: null,
    description: 'Grand Line\'in ilk yarısı. New World\'e kıyasla cennet gibi kaldığı için bu isim verilmiştir.',
  },
  {
    label: 'New World',
    color: 'text-luffy',
    bgColor: 'bg-luffy/10 border-luffy/30',
    icon: null,
    description: 'Dört İmparator\'un hüküm sürdüğü, dünyanın en tehlikeli bölgesi.',
  },
]

const FOUR_SEAS = [
  { name: 'East Blue', color: 'text-blue-400', bgColor: 'bg-blue-400' },
  { name: 'West Blue', color: 'text-orange-400', bgColor: 'bg-orange-400' },
  { name: 'North Blue', color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
  { name: 'South Blue', color: 'text-green-400', bgColor: 'bg-green-400' },
]

export default function WorldPage() {
  const [activeSea, setActiveSea] = useState<string | null>(null)

  const totalLocations = LOCATIONS.length

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <PageHero
            icon={Globe}
            title="Dünya"
            subtitle="Haritası"
            description="One Piece dünyası dört deniz, Grand Line, New World, Red Line ve Calm Belt'ten oluşur. Her bölge kendine özgü tehlikeleri ve hikayeleri barındırır."
            accentColor="sea"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-sea/30 bg-sea/10 px-4 py-1.5">
                <MapPin className="h-4 w-4 text-sea" />
                <span className="text-sm font-semibold text-sea">{totalLocations} Lokasyon</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
                <Compass className="h-4 w-4 text-gold" />
                <span className="text-sm font-semibold text-gold">{SEAS.length} Bölge</span>
              </div>
            </div>
          </PageHero>

          {/* Interactive World Map */}
          <WorldMap />

          {/* Sea overview cards */}
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SEAS.map((sea) => {
              const locationCount = getLocationsBySea(sea.slug).length
              const isActive = activeSea === sea.slug

              return (
                <motion.button
                  key={sea.slug}
                  variants={fadeUp}
                  onClick={() => setActiveSea(isActive ? null : sea.slug)}
                  className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'border-gold/40 shadow-gold-glow bg-ocean-surface/80'
                      : 'border-pirate-border/50 bg-ocean-surface/30 hover:border-pirate-border'
                  }`}
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${SEA_GRADIENT_BG[sea.slug]} opacity-60 transition-opacity group-hover:opacity-100`}
                  />

                  {/* Wave pattern at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-12 opacity-10">
                    <svg viewBox="0 0 400 50" className="h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M0,25 C100,45 200,5 300,25 C350,35 400,15 400,25 L400,50 L0,50 Z"
                        fill="currentColor"
                        className={sea.color.replace('text-', 'text-')}
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 p-5">
                    {/* Top row: icon + count */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${SEA_ACCENT_BG[sea.slug]}`}>
                        <Compass className={`h-5 w-5 ${sea.color}`} />
                      </div>
                      {locationCount > 0 && (
                        <div className="flex flex-col items-end">
                          <span className={`text-2xl font-extrabold ${sea.color}`}>
                            {locationCount}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-pirate-muted">
                            lokasyon
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className={`mb-1.5 text-base font-bold ${sea.color}`}>{sea.name}</h3>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-pirate-muted line-clamp-2">
                      {sea.description}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="seaIndicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* World structure - visual infographic */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sea/30 bg-sea/10">
                <Globe className="h-5 w-5 text-sea" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-pirate-text">Dünya Yapısı</h2>
                <p className="text-xs text-pirate-muted">One Piece evreninin cografyasi</p>
              </div>
            </div>

            <div className="bento-card overflow-hidden">
              {/* Visual diagram */}
              <div className="border-b border-pirate-border/50 bg-gradient-to-br from-ocean-surface/50 to-transparent p-6 sm:p-8">
                {/* Four seas grid */}
                <div className="mb-6">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-pirate-muted">
                    Dort Deniz
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {FOUR_SEAS.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center gap-2 rounded-lg border border-pirate-border/50 bg-ocean-deep/50 px-3 py-2"
                      >
                        <div className={`h-2.5 w-2.5 rounded-full ${s.bgColor}`} />
                        <span className={`text-sm font-semibold ${s.color}`}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structure badges */}
                <div className="space-y-3">
                  {WORLD_STRUCTURE_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-2 rounded-xl border border-pirate-border/30 bg-ocean-deep/40 p-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex shrink-0 items-center justify-center rounded-lg border px-3 py-1 text-xs font-bold ${item.bgColor} ${item.color}`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-pirate-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary text */}
              <div className="p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-pirate-muted">
                  <span className="font-semibold text-luffy">Red Line</span> ve{' '}
                  <span className="font-semibold text-gold">Grand Line</span> dunyayi dort denize boler.
                  Grand Line&apos;in ilk yarısı <span className="font-semibold text-sea">Paradise</span>,
                  ikinci yarısı <span className="font-semibold text-luffy">New World</span> olarak bilinir.
                  Dört Road Poneglyph&apos;in işaret ettiği koordinatların kesişim noktasında ise efsanevi{' '}
                  <span className="font-semibold text-gold">Laugh Tale</span> bulunur.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Locations grouped by sea */}
          <AnimatePresence mode="wait">
            {(activeSea ? SEAS.filter((s) => s.slug === activeSea) : SEAS).map((sea) => {
              const locations = getLocationsBySea(sea.slug)
              if (locations.length === 0) return null

              return (
                <motion.section
                  key={sea.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mb-14"
                >
                  {/* Section banner */}
                  <div
                    className={`relative mb-6 overflow-hidden rounded-2xl border border-pirate-border/50 bg-gradient-to-r ${SEA_GRADIENT_BG[sea.slug]}`}
                  >
                    <div className="relative z-10 flex items-center gap-4 px-6 py-5 sm:px-8">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${SEA_ACCENT_BG[sea.slug]}`}>
                        <Compass className={`h-6 w-6 ${sea.color}`} />
                      </div>
                      <div>
                        <h2 className={`text-xl font-extrabold sm:text-2xl ${sea.color}`}>
                          {sea.name}
                        </h2>
                        <p className="text-xs text-pirate-muted">
                          {locations.length} lokasyon
                        </p>
                      </div>
                    </div>
                    {/* Subtle wave at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-8 opacity-5">
                      <svg viewBox="0 0 800 30" className="h-full w-full" preserveAspectRatio="none">
                        <path
                          d="M0,15 C200,30 400,0 600,15 C700,22 800,8 800,15 L800,30 L0,30 Z"
                          fill="currentColor"
                          className={sea.color.replace('text-', 'text-')}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {locations.map((loc, locIndex) => {
                      const TypeIcon = TYPE_ICONS[loc.type] ?? MapPin

                      return (
                        <motion.div
                          key={loc.slug}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, ease: EASE, delay: locIndex * 0.05 }}
                          className={`bento-card group rounded-xl border-l-[3px] ${SEA_BORDER_COLORS[sea.slug]} p-5 transition-all hover:border-gold/20`}
                        >
                          {/* Header */}
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${SEA_ACCENT_BG[sea.slug]}`}>
                                <TypeIcon className={`h-4 w-4 ${sea.color}`} />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-pirate-text">{loc.name}</h3>
                                <span className="text-[10px] text-pirate-muted">
                                  {TYPE_LABELS[loc.type]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="mb-3 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                            {loc.description}
                          </p>

                          {/* Danger level bar */}
                          <div className="mb-3">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Shield className={`h-3 w-3 ${DANGER_COLORS[loc.dangerLevel]}`} />
                                <span className={`text-[10px] font-semibold ${DANGER_COLORS[loc.dangerLevel]}`}>
                                  Tehlike: {DANGER_LABELS[loc.dangerLevel]}
                                </span>
                              </div>
                              <span className={`text-[10px] font-bold ${DANGER_COLORS[loc.dangerLevel]}`}>
                                {loc.dangerLevel}/5
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ocean-surface">
                              <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${DANGER_BAR_COLORS[loc.dangerLevel]}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(loc.dangerLevel / 5) * 100}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                              />
                            </div>
                          </div>

                          {/* Significance */}
                          <div className="mb-3">
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
                              Önemli Olaylar
                            </p>
                            <ul className="space-y-1.5">
                              {loc.significance.slice(0, 3).map((sig, idx) => (
                                <li key={sig} className="flex gap-2 text-[11px] text-pirate-muted">
                                  <span
                                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${SEA_ACCENT_BG[sea.slug]} ${sea.color}`}
                                  >
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{sig}</span>
                                </li>
                              ))}
                              {loc.significance.length > 3 && (
                                <li className="pl-6 text-[11px] text-gold/60">
                                  +{loc.significance.length - 3} daha
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Related arcs */}
                          {loc.relatedArcs.length > 0 && (
                            <div className="flex flex-wrap gap-1 border-t border-pirate-border/50 pt-3">
                              {loc.relatedArcs.map((arcSlug) => {
                                const arc = getArcBySlug(arcSlug)
                                return (
                                  <Link
                                    key={arcSlug}
                                    href={`/arcs/${arcSlug}`}
                                    className="rounded-full bg-ocean-surface px-2.5 py-0.5 text-[10px] font-medium text-sea transition-colors hover:bg-sea/10 hover:text-sea-light"
                                  >
                                    {arc?.name ?? arcSlug}
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.section>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="mt-16" />
      </main>
  )
}

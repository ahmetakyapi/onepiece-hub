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
import { GlassCard } from '@/components/ui/GlassCard'
import { SEAS, LOCATIONS, getLocationsBySea } from '@/lib/constants/locations'
import { getArcBySlug } from '@/lib/constants/arcs'
import { EASE } from '@/lib/variants'

const DANGER_COLORS = [
  '',
  'text-accent-lime',
  'text-accent-amber',
  'text-accent-orange',
  'text-luffy',
  'text-luffy',
] as const

const DANGER_BAR_COLORS = [
  '',
  'from-accent-lime to-accent-lime',
  'from-accent-lime to-accent-amber',
  'from-accent-amber to-accent-orange',
  'from-accent-orange to-luffy',
  'from-luffy to-luffy',
] as const

const DANGER_LABELS = ['', 'Güvenli', 'Düşük', 'Orta', 'Yüksek', 'Ölümcül'] as const

const TYPE_LABELS: Record<string, string> = {
  island: 'Ada', sea: 'Deniz', city: 'Şehir', fortress: 'Kale', ship: 'Gemi', other: 'Diger',
}

const TYPE_ICONS: Record<string, typeof MapPin> = {
  island: MapPin, sea: Waves, city: Map, fortress: Shield, ship: Anchor, other: Navigation,
}

const SEA_BORDER_COLORS: Record<string, string> = {
  'east-blue': 'border-l-blue-400', 'west-blue': 'border-l-orange-400', 'north-blue': 'border-l-cyan-400',
  'south-blue': 'border-l-green-400', 'grand-line': 'border-l-gold', 'new-world': 'border-l-luffy',
  'calm-belt': 'border-l-pirate-muted', 'red-line': 'border-l-luffy',
}

/* Dört Deniz'in mavi/turuncu/cyan/yeşili İÇERİK paletidir — her denizin kendi
   kimlik rengi var, tema ile dönmez. Buna karşılık Grand Line (altın), New
   World + Red Line (luffy kırmızısı) ve Calm Belt (nötr gri) marka
   token'larıdır; ham `slate-*` / `red-*` yerine token yazılır. */
const SEA_GRADIENT_BG: Record<string, string> = {
  'east-blue': 'from-sea/20 via-sea/10 to-transparent', 'west-blue': 'from-accent-orange/20 via-accent-orange/10 to-transparent',
  'north-blue': 'from-accent-cyan/20 via-accent-cyan/10 to-transparent', 'south-blue': 'from-accent-lime/20 via-accent-lime/10 to-transparent',
  'grand-line': 'from-gold/20 via-gold/10 to-transparent', 'new-world': 'from-luffy/20 via-luffy/10 to-transparent',
  'calm-belt': 'from-pirate-muted/15 via-pirate-muted/10 to-transparent', 'red-line': 'from-luffy/20 via-luffy/10 to-transparent',
}

const SEA_ACCENT_BG: Record<string, string> = {
  'east-blue': 'bg-sea/10 border-sea/20', 'west-blue': 'bg-accent-orange/10 border-accent-orange/20',
  'north-blue': 'bg-accent-cyan/10 border-accent-cyan/20', 'south-blue': 'bg-accent-lime/10 border-accent-lime/20',
  'grand-line': 'bg-gold/10 border-gold/20', 'new-world': 'bg-luffy/10 border-luffy/20',
  'calm-belt': 'bg-pirate-muted/10 border-pirate-muted/20', 'red-line': 'bg-luffy/10 border-luffy/20',
}

const HERO_ORBS = [
  { color: 'rgb(var(--sea) / 0.4)', size: 300, x: '5%', y: '10%', delay: 0 },
  { color: 'rgb(var(--sea) / 0.25)', size: 200, x: '70%', y: '20%', delay: 1.5 },
  { color: 'rgb(var(--gold) / 0.2)', size: 180, x: '85%', y: '60%', delay: 3 },
  { color: 'rgb(var(--sea-light) / 0.2)', size: 160, x: '30%', y: '70%', delay: 2 },
]

const WORLD_STRUCTURE_ITEMS = [
  { label: 'Red Line', color: 'text-luffy', bgColor: 'bg-luffy/10 border-luffy/30', description: 'Dünyayı dikey olarak ikiye bölen devasa kırmızı kıta. Mary Geoise üzerindedir.' },
  { label: 'Grand Line', color: 'text-gold', bgColor: 'bg-gold/10 border-gold/30', description: 'Dünyayı yatay ikiye ayıran "Korsan Mezarlığı". Paradise ve New World olarak iki yarıya ayrılır.' },
  { label: 'Calm Belt', color: 'text-pirate-muted', bgColor: 'bg-pirate-muted/10 border-pirate-muted/30', description: 'Grand Line\'in iki yanındaki rüzgarsız kuşak. Dev Deniz Kralları\'nın yaşadığı alan.' },
  { label: 'Paradise', color: 'text-sea', bgColor: 'bg-sea/10 border-sea/30', description: 'Grand Line\'in ilk yarısı. New World\'e kıyasla cennet gibi kaldığı için bu isim verilmiştir.' },
  { label: 'New World', color: 'text-luffy', bgColor: 'bg-luffy/10 border-luffy/30', description: 'Dört İmparator\'un hüküm sürdüğü, dünyanın en tehlikeli bölgesi.' },
]

const FOUR_SEAS = [
  { name: 'East Blue', color: 'text-sea', bgColor: 'bg-sea' },
  { name: 'West Blue', color: 'text-accent-orange', bgColor: 'bg-accent-orange' },
  { name: 'North Blue', color: 'text-accent-cyan', bgColor: 'bg-accent-cyan' },
  { name: 'South Blue', color: 'text-accent-lime', bgColor: 'bg-accent-lime' },
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
          <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
            {SEAS.map((sea) => {
              const locationCount = getLocationsBySea(sea.slug).length
              const isActive = activeSea === sea.slug

              return (
                <button
                  key={sea.slug}
                  onClick={() => setActiveSea(isActive ? null : sea.slug)}
                  className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'border-gold/40 shadow-gold-glow bg-ocean-surface/80'
                      : 'border-pirate-border/50 bg-ocean-surface/30 hover:border-pirate-border'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${SEA_GRADIENT_BG[sea.slug]} opacity-60 transition-opacity group-hover:opacity-100`}
                  />

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
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${SEA_ACCENT_BG[sea.slug]}`}>
                        <Compass className={`h-5 w-5 ${sea.color}`} />
                      </div>
                      {locationCount > 0 && (
                        <div className="flex flex-col items-end">
                          <span className={`font-display text-2xl font-extrabold ${sea.color}`}>
                            {locationCount}
                          </span>
                          <span className="eyebrow text-pirate-muted">
                            lokasyon
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className={`mb-1.5 font-display text-base font-bold ${sea.color}`}>{sea.name}</h3>
                    <p className="text-xs leading-relaxed text-pirate-muted line-clamp-2">
                      {sea.description}
                    </p>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="seaIndicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* World structure - visual infographic */}
          <div className="mb-14">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sea/30 bg-sea/10">
                <Globe className="h-5 w-5 text-sea" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-pirate-text">Dünya Yapısı</h2>
                <p className="text-xs text-pirate-muted">One Piece evreninin coğrafyası</p>
              </div>
            </div>

            <div className="bento-card overflow-hidden">
              <div className="border-b border-pirate-border/50 bg-gradient-to-br from-ocean-surface/50 to-transparent p-6 sm:p-8">
                <div className="mb-6">
                  <p className="eyebrow-lg mb-3 text-pirate-muted">
                    Dört Deniz
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

              <div className="p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-pirate-muted">
                  <span className="font-semibold text-luffy">Red Line</span> ve{' '}
                  <span className="font-semibold text-gold">Grand Line</span> dünyayı dört denize böler.
                  Grand Line&apos;in ilk yarısı <span className="font-semibold text-sea">Paradise</span>,
                  ikinci yarısı <span className="font-semibold text-luffy">New World</span> olarak bilinir.
                  Dört Road Poneglyph&apos;in işaret ettiği koordinatların kesişim noktasında ise efsanevi{' '}
                  <span className="font-semibold text-gold">Laugh Tale</span> bulunur.
                </p>
              </div>
            </div>
          </div>

          {/* Locations grouped by sea */}
          <AnimatePresence mode="wait">
            {(activeSea ? SEAS.filter((s) => s.slug === activeSea) : SEAS).map((sea) => {
              const locations = getLocationsBySea(sea.slug)
              if (locations.length === 0) return null

              return (
                <section
                  key={sea.slug}
                  className="mb-14"
                >
                  {/* Section banner */}
                  <div
                    className={`glass-lift relative mb-6 overflow-hidden rounded-2xl border ${SEA_ACCENT_BG[sea.slug]} bg-gradient-to-r ${SEA_GRADIENT_BG[sea.slug]} p-6 sm:p-8 shadow-card-hover`}
                  >
                    {/* Ambient glow behind — `sea.color` bir Tailwind sınıfı
                        olduğu için eskiden inline `background` ile geçersiz CSS
                        üretiliyordu; artık `bg-current` ile o renkten besleniyor. */}
                    <div className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-current opacity-10 blur-3xl ${sea.color}`} />

                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 ${SEA_ACCENT_BG[sea.slug]} shadow-gold-glow`}>
                        <Compass className={`h-7 w-7 ${sea.color}`} />
                      </div>
                      <div className="flex-1">
                        {/* Düz renk — degrade metin `background-clip` desteklenmeyen
                            yerde harfi tamamen görünmez bırakıyordu. */}
                        <h2 className={`font-display text-2xl font-extrabold sm:text-3xl ${sea.color}`}>
                          {sea.name}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-pirate-muted/70">
                          {locations.length} lokasyon • {sea.slug === 'east-blue' ? 'Başlangıç' : 'Keşfet'}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-8 opacity-5">
                      <svg viewBox="0 0 800 30" className="h-full w-full" preserveAspectRatio="none">
                        <path
                          d="M0,15 C200,30 400,0 600,15 C700,22 800,8 800,15 L800,30 L0,30 Z"
                          fill="currentColor"
                          className={sea.color}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {locations.map((loc) => {
                      const TypeIcon = TYPE_ICONS[loc.type] ?? MapPin

                      return (
                        <GlassCard key={loc.slug} tilt glow className={`border-l-[3px] ${SEA_BORDER_COLORS[sea.slug]} group rounded-xl p-5`}>
                          <div>
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${SEA_ACCENT_BG[sea.slug]}`}>
                                <TypeIcon className={`h-4 w-4 ${sea.color}`} />
                              </div>
                              <div>
                                <h3 className="font-display text-sm font-bold text-pirate-text">{loc.name}</h3>
                                <span className="text-[10px] text-pirate-muted">
                                  {TYPE_LABELS[loc.type]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="mb-3 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                            {loc.description}
                          </p>

                          {/* Danger level bar — CSS only */}
                          <div className="mb-3">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Shield className={`h-3 w-3 ${DANGER_COLORS[loc.dangerLevel]}`} />
                                <span className={`text-[10px] font-semibold ${DANGER_COLORS[loc.dangerLevel]}`}>
                                  Tehlike: {DANGER_LABELS[loc.dangerLevel]}
                                </span>
                              </div>
                              <span className={`font-mono text-[10px] font-bold ${DANGER_COLORS[loc.dangerLevel]}`}>
                                {loc.dangerLevel}/5
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ocean-surface">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${DANGER_BAR_COLORS[loc.dangerLevel]} transition-[width] duration-700 ease-out`}
                                style={{ width: `${(loc.dangerLevel / 5) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="eyebrow mb-1.5 text-pirate-muted">
                              Önemli Olaylar
                            </p>
                            <ul className="space-y-1.5">
                              {loc.significance.slice(0, 3).map((sig, idx) => (
                                <li key={sig} className="flex gap-2 text-[11px] text-pirate-muted">
                                  <span
                                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold ${SEA_ACCENT_BG[sea.slug]} ${sea.color}`}
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
                          </div>
                        </GlassCard>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="mt-16" />
      </main>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Search, Cherry, Filter, Skull, Sparkles, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/wiki/PageHero'
import EmptyState from '@/components/ui/EmptyState'
import { DEVIL_FRUITS, DEVIL_FRUIT_TYPE_INFO } from '@/lib/constants/devil-fruits'
import { getCharacterImage } from '@/lib/constants/images'

const TYPES = Object.keys(DEVIL_FRUIT_TYPE_INFO)

const TYPE_ORDER = ['Mythical Zoan', 'Logia', 'Ancient Zoan', 'Zoan', 'Paramecia', 'Special Paramecia']

const HERO_ORBS = [
  { color: 'rgba(168, 85, 247, 0.4)', size: 300, x: '70%', y: '10%', delay: 0 },
  { color: 'rgba(244, 163, 0, 0.3)', size: 200, x: '10%', y: '60%', delay: 2 },
  { color: 'rgba(30, 144, 255, 0.3)', size: 250, x: '85%', y: '70%', delay: 4 },
  { color: 'rgba(231, 76, 60, 0.2)', size: 180, x: '40%', y: '20%', delay: 1 },
]

export default function DevilFruitsPage() {
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return DEVIL_FRUITS.filter((df) => {
      const matchesSearch =
        df.name.toLowerCase().includes(search.toLowerCase()) ||
        df.user.toLowerCase().includes(search.toLowerCase()) ||
        df.description.toLowerCase().includes(search.toLowerCase()) ||
        df.meaning.toLowerCase().includes(search.toLowerCase())
      const matchesType = !activeType || df.type === activeType
      return matchesSearch && matchesType
    })
  }, [search, activeType])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const df of DEVIL_FRUITS) {
      counts[df.type] = (counts[df.type] || 0) + 1
    }
    return counts
  }, [])

  const groupedByType = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const df of filtered) {
      if (!groups[df.type]) groups[df.type] = []
      groups[df.type].push(df)
    }
    return groups
  }, [filtered])

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero Section */}
          <PageHero
            icon={Cherry}
            title="Şeytan Meyveleri"
            subtitle="Ansiklopedisi"
            accentColor="purple-400"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2">
                <Cherry className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-300">{DEVIL_FRUITS.length}</span>
                <span className="text-xs text-pirate-muted">Meyve</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm font-bold text-gold">{TYPES.length}</span>
                <span className="text-xs text-pirate-muted">Tür</span>
              </div>
            </div>
          </PageHero>

          {/* Type Filter Cards */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            {TYPES.map((type) => {
              const info = DEVIL_FRUIT_TYPE_INFO[type]
              const count = typeCounts[type] || 0
              const isActive = activeType === type
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(isActive ? null : type)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-gold/50 shadow-gold-glow'
                      : 'border-pirate-border/50 hover:border-pirate-border'
                  }`}
                >
                  <div className={`absolute inset-0 ${info.bg} opacity-50 transition-opacity group-hover:opacity-80`} />
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`text-base font-extrabold ${info.color}`}>{info.label}</span>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${info.bg} text-sm font-bold ${info.color}`}>
                        {count}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-pirate-muted line-clamp-2">
                      {info.description}
                    </p>
                    <div className="mt-3 h-1 rounded-full bg-pirate-border/30">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r animate-grow-bar ${
                          info.color.includes('purple') ? 'from-purple-500 to-purple-400' :
                          info.color.includes('sea') ? 'from-sea to-sea-light' :
                          info.color.includes('luffy') ? 'from-luffy to-red-400' :
                          info.color.includes('gold') ? 'from-gold to-gold-bright' :
                          info.color.includes('emerald') ? 'from-emerald-500 to-emerald-400' :
                          info.color.includes('green') ? 'from-green-500 to-green-400' :
                          info.color.includes('yellow') ? 'from-yellow-500 to-yellow-400' :
                          info.color.includes('amber') ? 'from-amber-400 to-amber-300' :
                          info.color.includes('pink') ? 'from-pink-500 to-pink-400' :
                          'from-gold to-gold-bright'
                        }`}
                        style={{ width: `${(count / DEVIL_FRUITS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Meyve adı, kullanıcı veya güç ara..."
                aria-label="Şeytan meyvesi ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3.5 pl-12 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Active filter */}
          {activeType && (
            <div className="mb-6 flex items-center gap-2 animate-fade-in">
              <Filter className="h-3.5 w-3.5 text-pirate-muted" />
              <span className="text-xs text-pirate-muted">Filtre:</span>
              <button
                onClick={() => setActiveType(null)}
                className={`chip text-xs ${DEVIL_FRUIT_TYPE_INFO[activeType].color}`}
              >
                {DEVIL_FRUIT_TYPE_INFO[activeType].label}
                <span className="ml-1 text-pirate-muted">&times;</span>
              </button>
            </div>
          )}

          {/* Fruit Cards — grouped by type */}
          <div>
            {TYPE_ORDER.filter((type) => groupedByType[type]?.length).map((type) => {
              const typeInfo = DEVIL_FRUIT_TYPE_INFO[type]
              const fruits = groupedByType[type]
              return (
                <div key={type} className="mb-12">
                  {/* Type section header */}
                  {!activeType && (
                    <div className="mb-5 flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${typeInfo.bg} border border-current/10`}>
                        <Cherry className={`h-4 w-4 ${typeInfo.color}`} />
                      </div>
                      <h2 className={`text-lg font-extrabold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </h2>
                      <span className="text-xs text-pirate-muted">({fruits.length})</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-pirate-border/30 to-transparent" />
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {fruits.map((df) => {
                      const characterImage = df.userSlug ? getCharacterImage(df.userSlug) : ''
                      return (
                        <Link
                          key={df.slug}
                          href={`/devil-fruits/${df.slug}`}
                          className="bento-card group relative flex flex-col overflow-hidden transition-all hover:border-gold/20"
                        >
                          {/* Character image — large hero area */}
                          <div className={`relative h-44 w-full overflow-hidden ${typeInfo.bg}`}>
                            {characterImage ? (
                              <Image
                                src={characterImage}
                                alt={df.user}
                                fill
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Cherry className={`h-16 w-16 ${typeInfo.color} opacity-20`} />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent" />

                            <span className={`absolute right-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${typeInfo.bg} ${typeInfo.color} border border-current/10`}>
                              {typeInfo.label}
                            </span>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-base font-bold text-pirate-text transition-colors group-hover:text-gold leading-tight">
                                {df.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-pirate-muted/80">{df.meaning}</p>
                            </div>
                          </div>

                          <div className="p-4">
                            <p className="mb-3 font-mono text-[11px] text-pirate-muted/40">{df.japaneseName}</p>

                            <p className="mb-4 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                              {df.description}
                            </p>

                            <div className="flex items-center gap-2.5 border-t border-pirate-border/50 pt-3">
                              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-pirate-border/30 bg-ocean-surface">
                                {characterImage ? (
                                  <Image
                                    src={characterImage}
                                    alt={df.user}
                                    fill
                                    className="object-cover object-top"
                                    sizes="32px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Skull className="h-3.5 w-3.5 text-pirate-muted/40" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-pirate-text truncate block">{df.user}</span>
                              </div>
                              {df.status === 'deceased' && (
                                <span className="rounded-full bg-luffy/10 px-1.5 py-0.5 text-[9px] font-bold text-luffy">
                                  Ölü
                                </span>
                              )}
                              <ArrowRight className="h-4 w-4 text-pirate-muted/30 transition-all group-hover:text-gold group-hover:translate-x-1" />
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {df.abilities.slice(0, 2).map((ability) => (
                                <span
                                  key={ability}
                                  className="flex items-center gap-1 rounded-lg bg-ocean-surface px-2 py-1 text-[10px] text-pirate-muted"
                                >
                                  <Zap className="h-2.5 w-2.5 text-gold/50" />
                                  {ability.length > 30 ? ability.slice(0, 30) + '...' : ability}
                                </span>
                              ))}
                              {df.abilities.length > 2 && (
                                <span className="rounded-lg bg-ocean-surface px-2 py-1 text-[10px] font-semibold text-gold/60">
                                  +{df.abilities.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              theme="chopper-searching"
              title="Şeytan Meyvesi Bulunamadı"
              description="Aramanızla eşleşen Şeytan Meyvesi bulunamadı. Farklı bir filtre deneyin."
            />
          )}
        </div>

        <div className="mt-16" />
      </main>
  )
}

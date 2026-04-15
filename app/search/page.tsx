'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, Users, Compass, Swords, Anchor, Cherry,
  MapPin, X, ArrowRight
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { CHARACTERS } from '@/lib/constants/characters'
import { ARCS } from '@/lib/constants/arcs'
import { BATTLES } from '@/lib/constants/battles'
import { DEVIL_FRUITS } from '@/lib/constants/devil-fruits'
import { LOCATIONS } from '@/lib/constants/locations'
import { getCharacterImage, getArcImage } from '@/lib/constants/images'

type SearchResult = {
  type: 'character' | 'arc' | 'battle' | 'devil-fruit' | 'location'
  name: string
  slug: string
  href: string
  subtitle?: string
  image?: string
}

const TYPE_CONFIG = {
  character: { label: 'Karakter', icon: Users, color: 'text-sea', bg: 'bg-sea/10' },
  arc: { label: 'Arc', icon: Compass, color: 'text-gold', bg: 'bg-gold/10' },
  battle: { label: 'Savaş', icon: Swords, color: 'text-luffy', bg: 'bg-luffy/10' },
  'devil-fruit': { label: 'Şeytan Meyvesi', icon: Cherry, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  location: { label: 'Lokasyon', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
} as const

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState<string>('')

  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = []

    CHARACTERS.forEach((c) =>
      items.push({
        type: 'character',
        name: c.name,
        slug: c.slug,
        href: `/characters/${c.slug}`,
        subtitle: c.epithet || c.crew,
        image: getCharacterImage(c.slug),
      }),
    )

    ARCS.forEach((a) =>
      items.push({
        type: 'arc',
        name: a.name,
        slug: a.slug,
        href: `/arcs/${a.slug}`,
        subtitle: `${a.episodeCount} bölüm`,
        image: getArcImage(a.slug),
      }),
    )

    BATTLES.forEach((b) =>
      items.push({
        type: 'battle',
        name: b.name,
        slug: b.slug,
        href: '/battles',
        subtitle: b.arc,
      }),
    )

    DEVIL_FRUITS.forEach((df) =>
      items.push({
        type: 'devil-fruit',
        name: df.name,
        slug: df.slug,
        href: `/devil-fruits/${df.slug}`,
        subtitle: df.type,
      }),
    )

    LOCATIONS.forEach((loc) =>
      items.push({
        type: 'location',
        name: loc.name,
        slug: loc.slug,
        href: '/world',
        subtitle: loc.sea,
      }),
    )

    return items
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()
    return allItems
      .filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          (item.subtitle?.toLowerCase().includes(q) ?? false)
        const matchesType = activeType ? item.type === activeType : true
        return matchesQuery && matchesType
      })
      .slice(0, 30)
  }, [query, activeType, allItems])

  const typeCounts = useMemo(() => {
    if (!query.trim()) return {}
    const q = query.toLowerCase().trim()
    const counts: Record<string, number> = {}
    for (const item of allItems) {
      const matches =
        item.name.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false)
      if (matches) {
        counts[item.type] = (counts[item.type] || 0) + 1
      }
    }
    return counts
  }, [query, allItems])

  return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Title */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-8 text-center"
          >
            <motion.h1 variants={fadeUp} className="text-3xl font-extrabold text-pirate-text mb-2">
              Arama
            </motion.h1>
            <motion.p variants={fadeUp} className="text-sm text-pirate-muted">
              Karakter, arc, savaş, şeytan meyvesi veya lokasyon ara
            </motion.p>
          </motion.div>

          {/* Search input */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative mb-6"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pirate-muted/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Luffy, Marineford, Gomu Gomu..."
              aria-label="Karakter, arc, savaş veya şeytan meyvesi ara"
              autoFocus
              className="w-full rounded-2xl border border-pirate-border/30 bg-ocean-surface/50 py-4 pl-12 pr-12 text-base text-pirate-text placeholder-pirate-muted/40 outline-none transition-all focus:border-gold/30 focus:ring-2 focus:ring-gold/10"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setActiveType('') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-pirate-muted/50 hover:text-pirate-text transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {/* Type filters */}
          {query.trim() && Object.keys(typeCounts).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              <button
                onClick={() => setActiveType('')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  !activeType ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-ocean-surface text-pirate-muted border border-pirate-border/20 hover:border-gold/20'
                }`}
              >
                Tümü ({Object.values(typeCounts).reduce((a, b) => a + b, 0)})
              </button>
              {Object.entries(typeCounts).map(([type, count]) => {
                const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(activeType === type ? '' : type)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      activeType === type
                        ? `${config.bg} ${config.color} border border-current/30`
                        : 'bg-ocean-surface text-pirate-muted border border-pirate-border/20 hover:border-gold/20'
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {query.trim() && results.length > 0 && (
              <motion.div
                key="results"
                variants={staggerContainer(0.04)}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-1.5"
              >
                {results.map((item) => {
                  const config = TYPE_CONFIG[item.type]
                  const Icon = config.icon
                  return (
                    <motion.div key={`${item.type}-${item.slug}`} variants={fadeUp}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-ocean-surface/50"
                      >
                        {/* Image or icon */}
                        {item.image ? (
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-ocean-surface">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-pirate-text group-hover:text-gold transition-colors truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
                            {item.subtitle && (
                              <>
                                <span className="text-pirate-muted/30">&middot;</span>
                                <span className="text-[11px] text-pirate-muted/60 truncate">{item.subtitle}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-pirate-muted/30 group-hover:text-gold transition-colors" />
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {query.trim() && results.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <Search className="mx-auto mb-4 h-10 w-10 text-pirate-muted/20" />
                <p className="text-pirate-muted mb-1">
                  &ldquo;{query}&rdquo; için sonuç bulunamadı
                </p>
                <p className="text-sm text-pirate-muted/50">
                  Farklı bir anahtar kelime deneyin
                </p>
              </motion.div>
            )}

            {!query.trim() && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <Search className="mx-auto mb-4 h-10 w-10 text-pirate-muted/15" />
                <p className="text-sm text-pirate-muted/50">
                  Grand Line&apos;da ne arıyorsun?
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
  )
}

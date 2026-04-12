'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Anchor, ArrowUpDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CharacterAvatar from '@/components/ui/CharacterAvatar'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import type { CrewType } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

const CREW_FILTERS = Object.entries(CREW_LABELS) as [CrewType, string][]

type SortMode = 'default' | 'bounty-desc' | 'bounty-asc'

const SORT_LABELS: Record<SortMode, string> = {
  'default': 'Varsayılan',
  'bounty-desc': 'Ödül: Yüksek → Düşük',
  'bounty-asc': 'Ödül: Düşük → Yüksek',
}

function parseBounty(bounty?: string): number {
  if (!bounty) return 0
  return parseInt(bounty.replace(/,/g, ''), 10)
}

export default function CharactersPage() {
  const [search, setSearch] = useState('')
  const [activeCrew, setActiveCrew] = useState<CrewType | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('default')

  const filtered = useMemo(() => {
    let result = CHARACTERS.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      const matchesCrew = !activeCrew || c.crew === activeCrew
      return matchesSearch && matchesCrew
    })

    if (sortMode === 'bounty-desc') {
      result = [...result].sort((a, b) => parseBounty(b.bounty) - parseBounty(a.bounty))
    } else if (sortMode === 'bounty-asc') {
      result = [...result].sort((a, b) => parseBounty(a.bounty) - parseBounty(b.bounty))
    }

    return result
  }, [search, activeCrew, sortMode])

  const cycleSortMode = () => {
    setSortMode((prev) => {
      if (prev === 'default') return 'bounty-desc'
      if (prev === 'bounty-desc') return 'bounty-asc'
      return 'default'
    })
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/15 bg-gold/[0.06]"
            >
              <Users className="h-6 w-6 text-gold" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Karakter</span>{' '}
              <span className="text-pirate-text">Ansiklopedisi</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="text-sm text-pirate-muted sm:text-base"
            >
              One Piece evreninin efsanevi karakterleri
            </motion.p>
          </motion.div>

          {/* Search + Sort */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
              <input
                type="text"
                placeholder="Karakter ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>

            <button
              onClick={cycleSortMode}
              className={`chip flex items-center gap-1.5 transition-all duration-300 ${sortMode !== 'default' ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''}`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {SORT_LABELS[sortMode]}
            </button>
          </motion.div>

          {/* Crew Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCrew(null)}
              className={`chip transition-all duration-300 ${!activeCrew ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''}`}
            >
              Tümü
            </button>
            {CREW_FILTERS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCrew(key === activeCrew ? null : key)}
                className={`chip transition-all duration-300 ${activeCrew === key ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''}`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Character grid */}
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((char, i) => (
                <motion.div
                  key={char.slug}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Link
                    href={`/characters/${char.slug}`}
                    className="bento-card group flex h-full flex-col overflow-hidden"
                  >
                    {/* Avatar */}
                    <div className="relative h-44 overflow-hidden bg-ocean-surface">
                      <CharacterAvatar
                        slug={char.slug}
                        name={char.name}
                        crew={char.crew}
                        className="transition-transform duration-700 ease-expo-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/70 via-transparent to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-1.5 truncate text-sm font-bold text-pirate-text transition-colors duration-300 group-hover:text-gold">
                        {char.name}
                      </h3>
                      <span className="mb-2 inline-flex items-center gap-1 rounded-md bg-sea/[0.06] px-2 py-0.5 text-[10px] font-semibold text-sea/80">
                        <Anchor className="h-2.5 w-2.5" />
                        {CREW_LABELS[char.crew]}
                      </span>
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-pirate-muted/60">
                        {char.description}
                      </p>

                      {char.bounty && (
                        <div className="mt-auto flex items-center justify-between border-t border-pirate-border/20 pt-2.5">
                          <div>
                            <span className="text-[10px] text-pirate-muted/50">Ödül </span>
                            <span className="text-xs font-bold text-gold">{char.bounty} Berry</span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-pirate-muted/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold/40" />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <Users className="mx-auto mb-4 h-12 w-12 text-pirate-muted/30" />
              <p className="text-pirate-muted">Aramanızla eşleşen karakter bulunamadı.</p>
            </motion.div>
          )}
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

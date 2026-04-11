'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Anchor, ArrowUpDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCharacterImage } from '@/lib/constants/images'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import { fadeUp, staggerContainer } from '@/lib/variants'
import type { CrewType } from '@/types'

const CREW_FILTERS = Object.entries(CREW_LABELS) as [CrewType, string][]

type SortMode = 'default' | 'bounty-desc' | 'bounty-asc'

const SORT_LABELS: Record<SortMode, string> = {
  'default': 'Varsayılan',
  'bounty-desc': 'Ödül: Yüksekten Düşüğe',
  'bounty-asc': 'Ödül: Düşükten Yükseğe',
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
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.h1
              variants={fadeUp}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Karakter</span>{' '}
              <span className="text-pirate-text">Ansiklopedisi</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-pirate-muted">
              One Piece evreninin efsanevi karakterleri
            </motion.p>
          </motion.div>

          {/* Search + Sort */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Karakter ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-2.5 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>

            <button
              onClick={cycleSortMode}
              className={`chip flex items-center gap-1.5 transition-all ${sortMode !== 'default' ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {SORT_LABELS[sortMode]}
            </button>
          </div>

          {/* Crew Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCrew(null)}
              className={`chip transition-all ${!activeCrew ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
            >
              Tümü
            </button>
            {CREW_FILTERS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCrew(key === activeCrew ? null : key)}
                className={`chip transition-all ${activeCrew === key ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Character grid */}
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((char) => (
              <motion.div key={char.slug} variants={fadeUp}>
                <Link
                  href={`/characters/${char.slug}`}
                  className="glass group flex flex-col rounded-xl p-4 transition-all hover:border-gold/30 hover:shadow-gold-glow"
                >
                  {/* Avatar */}
                  <div className="relative mb-3 h-44 overflow-hidden rounded-lg bg-ocean-surface">
                    {getCharacterImage(char.slug) ? (
                      <Image
                        src={getCharacterImage(char.slug)}
                        alt={char.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Users className="h-10 w-10 text-sea/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <h3 className="mb-1 text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                    {char.name}
                  </h3>
                  <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-sea/10 px-2 py-0.5 text-xs font-medium text-sea">
                    <Anchor className="h-3 w-3" />
                    {CREW_LABELS[char.crew]}
                  </span>
                  <p className="line-clamp-2 text-xs leading-relaxed text-pirate-muted">
                    {char.description}
                  </p>

                  {char.bounty && (
                    <div className="mt-3 border-t border-pirate-border pt-2">
                      <span className="text-xs text-pirate-muted">Ödül: </span>
                      <span className="text-xs font-bold text-gold">{char.bounty} Berry</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
              <p className="text-pirate-muted">Aramanızla eşleşen karakter bulunamadı.</p>
            </div>
          )}
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

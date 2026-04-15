'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Compass, Anchor, Film } from 'lucide-react'
import { SAGAS } from '@/lib/constants/sagas'
import { ARCS, getArcsBySaga } from '@/lib/constants/arcs'
import ArcCard from '@/components/arcs/ArcCard'
import PageHero from '@/components/wiki/PageHero'
import WaveSeparator from '@/components/ui/WaveSeparator'
import { EASE } from '@/lib/variants'

const HERO_ORBS = [
  { color: 'rgba(30, 144, 255, 0.4)', size: 300, x: '70%', y: '10%', delay: 0 },
  { color: 'rgba(244, 163, 0, 0.3)', size: 200, x: '10%', y: '60%', delay: 2 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 250, x: '85%', y: '70%', delay: 4 },
  { color: 'rgba(231, 76, 60, 0.15)', size: 180, x: '40%', y: '20%', delay: 1 },
]

export default function ArcsPage() {
  const [search, setSearch] = useState('')
  const [activeSaga, setActiveSaga] = useState<string | null>(null)

  const totalEpisodes = useMemo(() => ARCS.reduce((sum, arc) => sum + arc.episodes.length, 0), [])

  const filteredArcs = ARCS.filter((arc) => {
    const matchesSearch = arc.name.toLowerCase().includes(search.toLowerCase()) ||
      arc.summary.toLowerCase().includes(search.toLowerCase())
    const matchesSaga = !activeSaga || arc.saga === activeSaga
    return matchesSearch && matchesSaga
  })

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero Section */}
          <PageHero
            icon={Compass}
            title="Arc"
            subtitle="Haritası"
            accentColor="sea"
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-sea/20 bg-sea/10 px-4 py-2">
                <Compass className="h-4 w-4 text-sea" />
                <span className="text-sm font-bold text-sea">{ARCS.length}</span>
                <span className="text-xs text-pirate-muted">Arc</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2">
                <Film className="h-4 w-4 text-gold" />
                <span className="text-sm font-bold text-gold">{totalEpisodes}</span>
                <span className="text-xs text-pirate-muted">Bölüm</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-luffy/20 bg-luffy/10 px-4 py-2">
                <Anchor className="h-4 w-4 text-luffy" />
                <span className="text-sm font-bold text-luffy">{SAGAS.length}</span>
                <span className="text-xs text-pirate-muted">Saga</span>
              </div>
            </div>
          </PageHero>

          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
              <input
                type="text"
                placeholder="Arc ara..."
                aria-label="Arc ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSaga(null)}
                className={`chip transition-all duration-300 ${!activeSaga ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''}`}
              >
                Tümü
              </button>
              {SAGAS.map((saga) => (
                <button
                  key={saga.slug}
                  onClick={() => setActiveSaga(saga.slug === activeSaga ? null : saga.slug)}
                  className={`chip transition-all duration-300 ${activeSaga === saga.slug ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''}`}
                >
                  {saga.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Arc grid */}
          {activeSaga ? (
            <motion.div
              layout
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredArcs.map((arc) => (
                <ArcCard key={arc.slug} arc={arc} />
              ))}
            </motion.div>
          ) : (
            <div className="space-y-12">
              {SAGAS.map((saga) => {
                const arcs = getArcsBySaga(saga.slug).filter((arc) =>
                  arc.name.toLowerCase().includes(search.toLowerCase()) ||
                  arc.summary.toLowerCase().includes(search.toLowerCase())
                )
                if (arcs.length === 0) return null
                return (
                  <div key={saga.slug}>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sea/[0.08] border border-sea/10">
                        <Anchor className="h-3.5 w-3.5 text-sea" />
                      </div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-sea">
                        {saga.name}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-sea/15 to-transparent" />
                      <span className="rounded-full bg-sea/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-sea/70">
                        {arcs.length} arc
                      </span>
                    </div>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {arcs.map((arc) => (
                        <ArcCard key={arc.slug} arc={arc} />
                      ))}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          )}

          <WaveSeparator variant="subtle" className="my-8" />

          {filteredArcs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <Compass className="mx-auto mb-4 h-12 w-12 text-pirate-muted/30" />
              <p className="text-pirate-muted">Aramanızla eşleşen arc bulunamadı.</p>
            </motion.div>
          )}
        </div>
      </main>
  )
}

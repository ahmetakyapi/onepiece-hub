'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Compass, Anchor } from 'lucide-react'
import { SAGAS } from '@/lib/constants/sagas'
import { ARCS, getArcsBySaga } from '@/lib/constants/arcs'
import ArcCard from '@/components/arcs/ArcCard'
import WaveSeparator from '@/components/ui/WaveSeparator'

const EASE = [0.16, 1, 0.3, 1] as const

export default function ArcsPage() {
  const [search, setSearch] = useState('')
  const [activeSaga, setActiveSaga] = useState<string | null>(null)

  const filteredArcs = ARCS.filter((arc) => {
    const matchesSearch = arc.name.toLowerCase().includes(search.toLowerCase()) ||
      arc.summary.toLowerCase().includes(search.toLowerCase())
    const matchesSaga = !activeSaga || arc.saga === activeSaga
    return matchesSearch && matchesSaga
  })

  return (
      <main className="relative min-h-screen pt-28 sm:pt-32">
        {/* Decorative ocean orbs */}
        <div className="ocean-glow ocean-glow-sea" style={{ width: 400, height: 400, top: -100, right: -150 }} />
        <div className="ocean-glow ocean-glow-gold" style={{ width: 300, height: 300, bottom: 200, left: -100 }} />

        <div className="mx-auto max-w-7xl px-6">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Arc</span>{' '}
              <span className="text-pirate-text">Haritası</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="text-sm text-pirate-muted sm:text-base"
            >
              East Blue&apos;dan Egghead&apos;e kadar tüm maceralar
            </motion.p>
          </motion.div>

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

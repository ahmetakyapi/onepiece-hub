'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Compass, Anchor } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SAGAS } from '@/lib/constants/sagas'
import { ARCS, getArcsBySaga } from '@/lib/constants/arcs'
import { fadeUp, staggerContainer } from '@/lib/variants'
import ArcCard from '@/components/arcs/ArcCard'

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
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Page header */}
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
              <span className="text-gold-gradient">Arc</span>{' '}
              <span className="text-pirate-text">Haritası</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-pirate-muted">
              East Blue&apos;dan Egghead&apos;e kadar tüm maceralar
            </motion.p>
          </motion.div>

          {/* Search + Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Arc ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-2.5 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>

            {/* Saga filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSaga(null)}
                className={`chip transition-all ${!activeSaga ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
              >
                Tümü
              </button>
              {SAGAS.map((saga) => (
                <button
                  key={saga.slug}
                  onClick={() => setActiveSaga(saga.slug === activeSaga ? null : saga.slug)}
                  className={`chip transition-all ${activeSaga === saga.slug ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
                >
                  {saga.name}
                </button>
              ))}
            </div>
          </div>

          {/* Arc grid */}
          {activeSaga ? (
            <motion.div
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredArcs.map((arc) => (
                <ArcCard key={arc.slug} arc={arc} />
              ))}
            </motion.div>
          ) : (
            <div className="space-y-10">
              {SAGAS.map((saga) => {
                const arcs = getArcsBySaga(saga.slug).filter((arc) =>
                  arc.name.toLowerCase().includes(search.toLowerCase()) ||
                  arc.summary.toLowerCase().includes(search.toLowerCase())
                )
                if (arcs.length === 0) return null
                return (
                  <div key={saga.slug}>
                    <div className="mb-4 flex items-center gap-3">
                      <Anchor className="h-4 w-4 text-sea" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-sea">
                        {saga.name}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-sea/20 to-transparent" />
                      <span className="text-xs text-pirate-muted">{arcs.length} arc</span>
                    </div>
                    <motion.div
                      variants={staggerContainer(0.06)}
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

          {filteredArcs.length === 0 && (
            <div className="py-20 text-center">
              <Compass className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
              <p className="text-pirate-muted">Aramanızla eşleşen arc bulunamadı.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

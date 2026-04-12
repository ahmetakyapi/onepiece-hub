'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Cherry, Filter, Skull, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DEVIL_FRUITS, DEVIL_FRUIT_TYPE_INFO } from '@/lib/constants/devil-fruits'
import { fadeUp, staggerContainer } from '@/lib/variants'

const TYPES = Object.keys(DEVIL_FRUIT_TYPE_INFO)

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
              <span className="text-gold-gradient">Şeytan Meyveleri</span>{' '}
              <span className="text-pirate-text">Ansiklopedisi</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              One Piece evrenindeki tüm Şeytan Meyveleri. Her meyvenin gücü, kullanıcısı ve detayları.
              Toplam <span className="font-bold text-gold">{DEVIL_FRUITS.length}</span> meyve kayıtlı.
            </motion.p>
          </motion.div>

          {/* Type info cards */}
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {TYPES.map((type) => {
              const info = DEVIL_FRUIT_TYPE_INFO[type]
              return (
                <motion.button
                  key={type}
                  variants={fadeUp}
                  onClick={() => setActiveType(activeType === type ? null : type)}
                  className={`glass rounded-xl p-4 text-left transition-all hover:border-gold/30 ${
                    activeType === type ? 'border-gold/40 shadow-gold-glow' : ''
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-sm font-bold ${info.color}`}>{info.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${info.bg} ${info.color}`}>
                      {typeCounts[type] || 0}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-pirate-muted line-clamp-2">
                    {info.description}
                  </p>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted" />
              <input
                type="text"
                placeholder="Meyve veya kullanıcı ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-pirate-border bg-ocean-surface/50 py-2.5 pl-10 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>
          </div>

          {/* Active filter */}
          {activeType && (
            <div className="mb-4 flex items-center gap-2">
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

          {/* Grid */}
          <motion.div
            variants={staggerContainer(0.03)}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((df) => {
              const typeInfo = DEVIL_FRUIT_TYPE_INFO[df.type]
              return (
                <motion.div key={df.slug} variants={fadeUp}>
                  <Link
                    href={`/devil-fruits/${df.slug}`}
                    className="glass group flex flex-col rounded-xl p-5 transition-all hover:border-gold/30 hover:shadow-gold-glow"
                  >
                    {/* Type badge + name */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                          {df.name}
                        </h3>
                        <p className="text-xs text-pirate-muted">{df.meaning}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeInfo.bg} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>

                    {/* Japanese name */}
                    <p className="mb-3 font-mono text-xs text-pirate-muted/60">{df.japaneseName}</p>

                    {/* Description */}
                    <p className="mb-4 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                      {df.description}
                    </p>

                    {/* User */}
                    <div className="mt-auto flex items-center gap-2 border-t border-pirate-border pt-3">
                      <Skull className="h-3.5 w-3.5 text-gold/60" />
                      <span className="text-xs font-medium text-pirate-text">{df.user}</span>
                      {df.status === 'deceased' && (
                        <span className="rounded-full bg-luffy/10 px-1.5 py-0.5 text-[10px] font-medium text-luffy">
                          Ölü
                        </span>
                      )}
                    </div>

                    {/* Abilities preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {df.abilities.slice(0, 2).map((ability) => (
                        <span
                          key={ability}
                          className="rounded-full bg-ocean-surface px-2 py-0.5 text-[10px] text-pirate-muted"
                        >
                          {ability.length > 40 ? ability.slice(0, 40) + '...' : ability}
                        </span>
                      ))}
                      {df.abilities.length > 2 && (
                        <span className="rounded-full bg-ocean-surface px-2 py-0.5 text-[10px] text-gold/60">
                          +{df.abilities.length - 2}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Cherry className="mx-auto mb-4 h-12 w-12 text-pirate-muted" />
              <p className="text-pirate-muted">Aramanızla eşleşen Şeytan Meyvesi bulunamadı.</p>
            </div>
          )}
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Anchor, Users, Crown, Shield, Skull, Swords } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CREWS, CREW_TYPE_LABELS } from '@/lib/constants/crews'
import { fadeUp, staggerContainer } from '@/lib/variants'

const TYPE_ICONS: Record<string, typeof Anchor> = {
  pirate: Skull,
  marine: Shield,
  government: Crown,
  revolutionary: Swords,
  other: Anchor,
}

export default function CrewsPage() {
  const [activeType, setActiveType] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return activeType ? CREWS.filter((c) => c.type === activeType) : CREWS
  }, [activeType])

  const types = [...new Set(CREWS.map((c) => c.type))]

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
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
              <span className="text-gold-gradient">Mürettebat</span>{' '}
              <span className="text-pirate-text">& Organizasyonlar</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              Yonko mürettebatlarından Deniz Kuvvetleri&apos;ne, Devrimci Ordu&apos;dan Dünya Hükümeti&apos;ne
              kadar One Piece evreninin tüm büyük güçleri.
            </motion.p>
          </motion.div>

          {/* Type Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType(null)}
              className={`chip transition-all ${!activeType ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
            >
              Tümü ({CREWS.length})
            </button>
            {types.map((type) => {
              const Icon = TYPE_ICONS[type] ?? Anchor
              const count = CREWS.filter((c) => c.type === type).length
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(activeType === type ? null : type)}
                  className={`chip flex items-center gap-1.5 transition-all ${
                    activeType === type ? 'border-gold/40 bg-gold/10 text-gold' : ''
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {CREW_TYPE_LABELS[type]} ({count})
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((crew) => (
              <motion.div key={crew.slug} variants={fadeUp}>
                <Link
                  href={`/crews/${crew.slug}`}
                  className="glass group flex flex-col rounded-xl p-5 transition-all hover:border-gold/30 hover:shadow-gold-glow h-full"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`mb-1 text-base font-bold ${crew.color} transition-colors group-hover:text-gold`}>
                        {crew.name}
                      </h3>
                      <p className="font-mono text-[10px] text-pirate-muted/50">{crew.japaneseName}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${crew.bg} ${crew.color}`}>
                      {CREW_TYPE_LABELS[crew.type]}
                    </span>
                  </div>

                  {/* Captain */}
                  {crew.captain && (
                    <div className="mb-3 flex items-center gap-2">
                      <Crown className="h-3.5 w-3.5 text-gold/60" />
                      <span className="text-xs font-medium text-pirate-text">{crew.captain}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="mb-4 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                    {crew.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-auto space-y-2 border-t border-pirate-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-pirate-muted">
                        <Users className="h-3 w-3" />
                        {crew.notableMembers.length} bilinen üye
                      </span>
                      <span className={`text-[10px] font-medium ${
                        crew.status === 'active' ? 'text-green-400' :
                        crew.status === 'disbanded' ? 'text-pirate-muted' :
                        crew.status === 'defeated' ? 'text-luffy' : 'text-pirate-muted'
                      }`}>
                        {crew.status === 'active' ? 'Aktif' :
                         crew.status === 'disbanded' ? 'Dağıtılmış' :
                         crew.status === 'defeated' ? 'Yenilmiş' : 'Bilinmiyor'}
                      </span>
                    </div>
                    {crew.totalBounty && (
                      <div className="flex items-center gap-1.5">
                        <Skull className="h-3 w-3 text-gold/60" />
                        <span className="text-[10px] font-bold text-gold">
                          Toplam Ödül: {crew.totalBounty} Berry
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

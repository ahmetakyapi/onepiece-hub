'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, MapPin, Anchor, Shield, Skull, Compass, Star } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SEAS, LOCATIONS, getLocationsBySea } from '@/lib/constants/locations'
import { getArcBySlug } from '@/lib/constants/arcs'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const DANGER_COLORS = [
  '',
  'text-green-400',
  'text-yellow-400',
  'text-orange-400',
  'text-luffy',
  'text-red-500',
] as const

const DANGER_LABELS = ['', 'Güvenli', 'Düşük', 'Orta', 'Yüksek', 'Ölümcül'] as const

const TYPE_LABELS: Record<string, string> = {
  island: 'Ada',
  sea: 'Deniz',
  city: 'Şehir',
  fortress: 'Kale',
  ship: 'Gemi',
  other: 'Diğer',
}

export default function WorldPage() {
  const [activeSea, setActiveSea] = useState<string | null>(null)

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
              <span className="text-gold-gradient">Dünya</span>{' '}
              <span className="text-pirate-text">Haritası</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              One Piece dünyası dört deniz, Grand Line, New World, Red Line ve Calm Belt&apos;ten oluşur.
              Her bölge kendine özgü tehlikeleri ve hikayeleri barındırır.
            </motion.p>
          </motion.div>

          {/* Sea overview cards */}
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SEAS.map((sea) => {
              const locationCount = getLocationsBySea(sea.slug).length
              return (
                <motion.button
                  key={sea.slug}
                  variants={fadeUp}
                  onClick={() => setActiveSea(activeSea === sea.slug ? null : sea.slug)}
                  className={`glass rounded-xl p-4 text-left transition-all hover:border-gold/30 ${
                    activeSea === sea.slug ? 'border-gold/40 shadow-gold-glow' : ''
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${sea.color}`}>{sea.name}</h3>
                    {locationCount > 0 && (
                      <span className="rounded-full bg-ocean-surface px-2 py-0.5 text-[10px] font-semibold text-pirate-muted">
                        {locationCount} lokasyon
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-pirate-muted line-clamp-2">
                    {sea.description}
                  </p>
                </motion.button>
              )
            })}
          </motion.div>

          {/* World structure explanation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-12"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-pirate-text">
              <Globe className="h-5 w-5 text-sea" />
              Dünya Yapısı
            </h2>
            <div className="glass rounded-xl p-6">
              <div className="space-y-4 text-sm leading-relaxed text-pirate-muted">
                <p>
                  One Piece dünyası, gerçek dünyadan farklı olarak <span className="font-semibold text-luffy">Red Line</span> adlı devasa bir kırmızı kıta tarafından dikey olarak ikiye bölünür.
                  Yatay olarak ise <span className="font-semibold text-gold">Grand Line</span> dünyayı ikiye ayırır.
                </p>
                <p>
                  Bu iki çizgi dünyayı dört denize böler: <span className="text-blue-400">East Blue</span>, <span className="text-orange-400">West Blue</span>, <span className="text-cyan-400">North Blue</span>, <span className="text-green-400">South Blue</span>.
                  Grand Line&apos;ın iki yanında ise <span className="text-pirate-muted">Calm Belt</span> (rüzgarsız kuşak) uzanır — burada Dev Deniz Kralları yaşar.
                </p>
                <p>
                  Grand Line&apos;ın ilk yarısı <span className="text-sea font-semibold">Paradise</span> (Cennet) olarak bilinir — ancak New World&apos;e kıyasla cennet gibi kaldığı için bu isim verilmiştir.
                  İkinci yarı olan <span className="text-luffy font-semibold">New World</span> ise Dört İmparator&apos;un (Yonko) hüküm sürdüğü, dünyanın en tehlikeli bölgesidir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Locations grouped by sea */}
          {(activeSea ? SEAS.filter(s => s.slug === activeSea) : SEAS).map((sea) => {
            const locations = getLocationsBySea(sea.slug)
            if (locations.length === 0) return null

            return (
              <motion.section
                key={sea.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-12"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Compass className={`h-5 w-5 ${sea.color}`} />
                  <h2 className={`text-lg font-bold ${sea.color}`}>{sea.name}</h2>
                  <span className="rounded-full bg-ocean-surface px-2 py-0.5 text-xs text-pirate-muted">
                    {locations.length} lokasyon
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {locations.map((loc) => (
                    <div
                      key={loc.slug}
                      className="glass rounded-xl p-5 transition-all hover:border-gold/20"
                    >
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-pirate-text">{loc.name}</h3>
                          <span className="text-[10px] text-pirate-muted">{TYPE_LABELS[loc.type]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: loc.dangerLevel }).map((_, i) => (
                            <Skull key={i} className={`h-3 w-3 ${DANGER_COLORS[loc.dangerLevel]}`} />
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-3 text-xs leading-relaxed text-pirate-muted line-clamp-3">
                        {loc.description}
                      </p>

                      {/* Significance */}
                      <div className="mb-3">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">Önemli Olaylar</p>
                        <ul className="space-y-1">
                          {loc.significance.slice(0, 3).map((sig) => (
                            <li key={sig} className="flex gap-1.5 text-[11px] text-pirate-muted">
                              <Star className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 text-gold/50" />
                              <span>{sig}</span>
                            </li>
                          ))}
                          {loc.significance.length > 3 && (
                            <li className="text-[11px] text-gold/60">+{loc.significance.length - 3} daha</li>
                          )}
                        </ul>
                      </div>

                      {/* Related arcs */}
                      {loc.relatedArcs.length > 0 && (
                        <div className="flex flex-wrap gap-1 border-t border-pirate-border pt-2">
                          {loc.relatedArcs.map((arcSlug) => {
                            const arc = getArcBySlug(arcSlug)
                            return (
                              <Link
                                key={arcSlug}
                                href={`/arcs/${arcSlug}`}
                                className="rounded-full bg-ocean-surface px-2 py-0.5 text-[10px] font-medium text-sea transition-colors hover:bg-sea/10"
                              >
                                {arc?.name ?? arcSlug}
                              </Link>
                            )
                          })}
                        </div>
                      )}

                      {/* Danger level */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <Shield className={`h-3 w-3 ${DANGER_COLORS[loc.dangerLevel]}`} />
                        <span className={`text-[10px] font-medium ${DANGER_COLORS[loc.dangerLevel]}`}>
                          Tehlike: {DANGER_LABELS[loc.dangerLevel]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Users,
  Anchor,
  ArrowUpDown,
  Share2,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import PageHero from '@/components/wiki/PageHero'
import EmptyState from '@/components/ui/EmptyState'
import CharacterCard from '@/components/characters/CharacterCard'
import CrewAmbient from '@/components/characters/CrewAmbient'
import AmbientBackground from '@/components/ui/AmbientBackground'
import { CHARACTERS, CREW_LABELS } from '@/lib/constants/characters'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'
import { parseBounty } from '@/lib/utils'
import { CREW_COLORS, CREW_ICONS } from '@/lib/constants/crew-styles'
import { CHARACTER_RELATIONS } from '@/lib/constants/relationships'
import type { CrewType } from '@/types'

const RelationshipGraph = dynamic(() => import('@/components/characters/RelationshipGraph'), { ssr: false })

/* ─── Constants ──────────────────────────────────────────────── */

const CREW_FILTERS = Object.entries(CREW_LABELS) as [CrewType, string][]

type SortMode = 'default' | 'bounty-desc' | 'bounty-asc'

const SORT_LABELS: Record<SortMode, string> = {
  default: 'Varsayılan',
  'bounty-desc': 'Ödül: Yüksek → Düşük',
  'bounty-asc': 'Ödül: Düşük → Yüksek',
}

/* ─── Sekmeler ───────────────────────────────────────────────── */

type TabId = 'list' | 'relations'

const TABS = [
  { id: 'list' as const, label: 'Karakterler', icon: Users, count: CHARACTERS.length },
  { id: 'relations' as const, label: 'İlişkiler', icon: Share2, count: CHARACTER_RELATIONS.length },
]

/* ─── Hero Orbs ──────────────────────────────────────────────── */

const HERO_ORBS = [
  { color: 'radial-gradient(circle, rgb(var(--gold) / 0.4), transparent 70%)', size: 280, x: '5%', y: '10%', delay: 0 },
  { color: 'radial-gradient(circle, rgb(var(--sea) / 0.3), transparent 70%)', size: 220, x: '75%', y: '20%', delay: 1.5 },
  { color: 'radial-gradient(circle, rgb(var(--luffy) / 0.25), transparent 70%)', size: 180, x: '60%', y: '60%', delay: 3 },
]

/* ─── Page Component ─────────────────────────────────────────── */

export default function CharactersPage() {
  const [tab, setTab] = useState<TabId>('list')
  const [search, setSearch] = useState('')
  const [activeCrew, setActiveCrew] = useState<CrewType | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('default')

  const filtered = useMemo(() => {
    let result = CHARACTERS.filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.epithet && c.epithet.toLowerCase().includes(q))
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

  const crewCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    CHARACTERS.forEach((c) => {
      counts[c.crew] = (counts[c.crew] || 0) + 1
    })
    return counts
  }, [])

  return (
      <main className="relative min-h-screen pt-28 sm:pt-32">
        <AmbientBackground theme="adventure" intensity="subtle" />
        <CrewAmbient />
        <div className="mx-auto max-w-7xl px-6">
          {/* ─── Hero ─── */}
          <PageHero
            icon={Users}
            title="Karakter"
            subtitle="Ansiklopedisi"
            accentColor="gold"
            orbs={HERO_ORBS}
          />

          {/* ─── Sekmeler ─────────────────────────────────────────────
              İlişki grafiği eskiden listenin ÜSTÜNDE duruyordu; ağır bir
              görsel blok olduğu için listeye ulaşmak uzuyordu. Artık iki
              görünüm eşit seviyede sekme. */}
          <div
            role="tablist"
            aria-label="Karakter görünümü"
            className="mb-8 inline-flex gap-1 rounded-2xl border border-pirate-border/40 bg-ocean-surface/40 p-1 backdrop-blur-sm"
          >
            {TABS.map((t) => {
              const isActive = tab === t.id
              return (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gold/[0.12] text-gold'
                      : 'text-pirate-muted hover:bg-ink/[0.04] hover:text-pirate-text'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  <span className="text-[10px] opacity-60">{t.count}</span>
                </button>
              )
            })}
          </div>

          {/* ─── Sekme: İlişkiler ─── */}
          {tab === 'relations' && (
            <motion.div
              key="relations"
              id="panel-relations"
              role="tabpanel"
              aria-labelledby="tab-relations"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-14"
            >
              <p className="mb-4 max-w-2xl text-sm leading-relaxed text-pirate-muted">
                Karakterler arasındaki nakama, aile, mentor, rakip ve düşman
                bağları. Bir düğüme dokununca o karakterin bağlantıları öne çıkar.
              </p>
              <RelationshipGraph />
            </motion.div>
          )}

          {/* ─── Sekme: Karakterler ───────────────────────────────────
              Aşağıdaki arama/filtre/grid bloğu yalnızca bu sekmede. */}
          {tab === 'list' && (
          <motion.div
            id="panel-list"
            role="tabpanel"
            aria-labelledby="tab-list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
          {/* ─── Search + Sort ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
              <input
                type="text"
                placeholder="Karakter veya lakap ara..."
                aria-label="Karakter veya lakap ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-pirate-border/50 bg-ocean-surface/40 py-3 pl-11 pr-4 text-sm text-pirate-text placeholder:text-pirate-muted/40 backdrop-blur-sm focus:border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/[0.08] transition-all"
              />
            </div>

            <button
              onClick={cycleSortMode}
              className={`chip flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 ${
                sortMode !== 'default' ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {SORT_LABELS[sortMode]}
            </button>
          </motion.div>

          {/* ─── Crew Filters ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCrew(null)}
              className={`chip flex items-center gap-1.5 transition-all duration-300 ${
                !activeCrew ? 'border-gold/30 bg-gold/[0.08] text-gold' : ''
              }`}
            >
              <Users className="h-3 w-3" />
              Tümü
              <span className="ml-0.5 text-[10px] opacity-60">{CHARACTERS.length}</span>
            </button>
            {CREW_FILTERS.map(([key, label]) => {
              const colors = CREW_COLORS[key] || CREW_COLORS.other
              const count = crewCounts[key] || 0
              const Icon = CREW_ICONS[key] || Anchor
              return (
                <button
                  key={key}
                  onClick={() => setActiveCrew(key === activeCrew ? null : key)}
                  className={`chip flex items-center gap-1.5 transition-all duration-300 ${
                    activeCrew === key
                      ? `${colors.border} ${colors.bg} ${colors.text}`
                      : ''
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                  <span className="ml-0.5 text-[10px] opacity-60">{count}</span>
                </button>
              )
            })}
          </motion.div>

          {/* ─── Results count ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 flex items-center justify-between"
          >
            <span className="eyebrow text-pirate-muted">
              {filtered.length} karakter gösteriliyor
            </span>
          </motion.div>

          {/* ─── Character Grid ─── */}
          <motion.div
            variants={staggerContainer(0.04)}
            initial="hidden"
            animate="visible"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="sync">
              {filtered.map((char) => (
                <motion.div
                  key={char.slug}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <CharacterCard character={char} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ─── Empty State ─── */}
          {filtered.length === 0 && (
            <EmptyState
              theme="chopper-searching"
              title="Karakter Bulunamadı"
              description="Aramanızla eşleşen karakter bulunamadı. Farklı bir arama veya filtre deneyin."
              action={
                <button
                  onClick={() => { setSearch(''); setActiveCrew(null) }}
                  className="btn-ghost gap-1.5 text-sm"
                >
                  Filtreleri Temizle
                </button>
              }
            />
          )}
          </motion.div>
          )}
        </div>

        <div className="mt-20" />
      </main>
  )
}

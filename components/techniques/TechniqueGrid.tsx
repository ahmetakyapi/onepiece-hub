'use client'

import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Shield, Cherry, Sword, Zap, Anchor, Sparkles, BookOpen,
  Search, X, ArrowRight,
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/variants'
import { getCharacterImage } from '@/lib/constants/images'

export interface TechniqueEntry {
  name: string
  description: string
  category: string
  characterSlug: string
  characterName: string
  characterImage: string
}

const CATEGORY_CONFIG: Record<string, {
  icon: typeof Zap
  color: string
  hover: string
  bg: string
  border: string
  glow: string
}> = {
  'Haki': {
    icon: Shield,
    color: 'text-purple-400',
    hover: 'group-hover:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'bg-purple-500/[0.08]',
  },
  'Şeytan Meyvesi': {
    icon: Cherry,
    color: 'text-luffy',
    hover: 'group-hover:text-luffy',
    bg: 'bg-luffy/10',
    border: 'border-luffy/30',
    glow: 'bg-luffy/[0.08]',
  },
  'Kılıç': {
    icon: Sword,
    color: 'text-sea',
    hover: 'group-hover:text-sea',
    bg: 'bg-sea/10',
    border: 'border-sea/30',
    glow: 'bg-sea/[0.08]',
  },
  'Fiziksel': {
    icon: Zap,
    color: 'text-gold',
    hover: 'group-hover:text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    glow: 'bg-gold/[0.08]',
  },
  'Silah': {
    icon: Anchor,
    color: 'text-pirate-muted',
    hover: 'group-hover:text-pirate-text',
    bg: 'bg-pirate-muted/10',
    border: 'border-pirate-border/40',
    glow: 'bg-pirate-muted/[0.05]',
  },
  'Özel': {
    icon: Sparkles,
    color: 'text-amber-400',
    hover: 'group-hover:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'bg-amber-500/[0.08]',
  },
  'Bilim': {
    icon: BookOpen,
    color: 'text-emerald-400',
    hover: 'group-hover:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500/[0.08]',
  },
}

function TechniqueCard({ technique }: { technique: TechniqueEntry }) {
  const config = CATEGORY_CONFIG[technique.category] ?? CATEGORY_CONFIG['Özel']
  const CategoryIcon = config.icon
  const img = getCharacterImage(technique.characterSlug)

  return (
    <Link
      href={`/characters/${technique.characterSlug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${config.border} bg-ocean-surface/30 p-5 transition-all duration-300 hover:bg-ocean-surface/60 hover:-translate-y-0.5`}
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${config.glow} blur-[50px] transition-opacity group-hover:opacity-150`} />

      {/* Category badge */}
      <div className="relative mb-4 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color}`}>
          <CategoryIcon className="h-3 w-3" />
          {technique.category}
        </span>
        <ArrowRight className={`h-4 w-4 text-pirate-muted/30 transition-all group-hover:translate-x-1 ${config.hover}`} />
      </div>

      {/* Technique name */}
      <h3 className={`relative mb-2 text-base font-extrabold leading-tight text-pirate-text transition-colors ${config.hover} sm:text-lg`}>
        {technique.name}
      </h3>

      {/* Description */}
      <p className="relative mb-4 flex-1 text-[13px] leading-relaxed text-pirate-muted line-clamp-3 sm:text-sm">
        {technique.description}
      </p>

      {/* Character footer */}
      <div className="relative flex items-center gap-2.5 border-t border-pirate-border/15 pt-3">
        {img ? (
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-pirate-border/30">
            <Image
              src={img}
              alt={technique.characterName}
              fill
              className="object-cover object-top"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ocean-surface/50">
            <Sparkles className="h-3 w-3 text-pirate-muted/40" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/60">
            Kullanıcı
          </p>
          <p className="truncate text-xs font-bold text-pirate-text">
            {technique.characterName}
          </p>
        </div>
      </div>
    </Link>
  )
}

const MemoCard = memo(TechniqueCard)

function TechniqueGrid({ techniques }: { techniques: TechniqueEntry[] }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const t of techniques) counts.set(t.category, (counts.get(t.category) ?? 0) + 1)
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [techniques])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return techniques.filter(t => {
      if (activeCategory && t.category !== activeCategory) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.characterName.toLowerCase().includes(q)
      )
    })
  }, [techniques, search, activeCategory])

  return (
    <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="space-y-8">
      {/* Search Bar */}
      <motion.div variants={fadeUp}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pirate-muted/50" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Teknik, karakter veya açıklama ara..."
            className="w-full rounded-full border border-pirate-border/30 bg-ocean-surface/40 px-11 py-3 text-sm text-pirate-text placeholder:text-pirate-muted/50 focus:border-gold/40 focus:bg-ocean-surface/70 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-pirate-muted/60 hover:bg-ocean-surface hover:text-gold transition-colors"
              aria-label="Aramayı temizle"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeCategory === null
              ? 'bg-gold text-ocean-deep shadow-lg'
              : 'border border-pirate-border/30 bg-ocean-surface/40 text-pirate-text hover:border-gold/40'
          }`}
        >
          Tümü
          <span className="rounded-full bg-ocean-deep/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
            {techniques.length}
          </span>
        </button>

        {categories.map(([cat, count]) => {
          const config = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG['Özel']
          const CategoryIcon = config.icon
          const isActive = activeCategory === cat

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? `${config.bg} ${config.color} border ${config.border} shadow-lg`
                  : 'border border-pirate-border/30 bg-ocean-surface/40 text-pirate-text hover:border-gold/40'
              }`}
            >
              <CategoryIcon className="h-3 w-3" />
              {cat}
              <span className="rounded-full bg-ocean-deep/40 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                {count}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* Results Count */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <p className="text-sm text-pirate-muted">
          <span className="font-bold text-gold">{filtered.length}</span> teknik gösteriliyor
        </p>
        {(search || activeCategory) && (
          <button
            onClick={() => { setSearch(''); setActiveCategory(null) }}
            className="text-xs font-semibold text-pirate-muted hover:text-gold transition-colors inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Filtreleri temizle
          </button>
        )}
      </motion.div>

      {/* Technique Grid */}
      {filtered.length > 0 ? (
        <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <MemoCard key={`${t.characterSlug}-${t.name}-${i}`} technique={t} />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center rounded-2xl border border-pirate-border/20 bg-ocean-surface/30 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Search className="h-6 w-6 text-gold/70" />
          </div>
          <p className="mb-1 text-lg font-bold text-pirate-text">Sonuç bulunamadı</p>
          <p className="mb-4 text-sm text-pirate-muted">Arama veya filtreleri değiştirerek tekrar deneyin.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(null) }}
            className="btn-ghost text-xs"
          >
            Filtreleri Temizle
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default memo(TechniqueGrid)

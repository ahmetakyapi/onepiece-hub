'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Users, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/variants'
import { CHARACTERS } from '@/lib/constants/characters'
import { CHARACTER_IMAGES } from '@/lib/constants/images'
import { CHARACTER_RELATIONS, GRAPH_CHARACTERS, RELATION_CONFIG, type RelationType } from '@/lib/constants/relationships'

/* ─── Circular layout for character nodes ─────────────────────────────── */
function getCircularLayout(count: number, centerX: number, centerY: number, radius: number) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}

interface SelectedInfo {
  slug: string
  name: string
  relations: Array<{ slug: string; name: string; type: RelationType; label?: string }>
}

function buildSelected(slug: string): SelectedInfo | null {
  const char = CHARACTERS.find((c) => c.slug === slug)
  if (!char) return null
  const relations = CHARACTER_RELATIONS
    .filter((r) => r.from === slug || r.to === slug)
    .map((r) => {
      const otherSlug = r.from === slug ? r.to : r.from
      const otherChar = CHARACTERS.find((c) => c.slug === otherSlug)
      return {
        slug: otherSlug,
        name: otherChar?.name ?? otherSlug,
        type: r.type,
        label: r.label,
      }
    })
  return { slug, name: char.name, relations }
}

export default function RelationshipGraph() {
  const [selected, setSelected] = useState<SelectedInfo | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<RelationType | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Default: show Luffy's relations on mobile for instant context
  useEffect(() => {
    if (isMobile && !selected) {
      const luffy = buildSelected('luffy')
      if (luffy) setSelected(luffy)
    }
  }, [isMobile, selected])

  const svgSize = 1200
  const center = svgSize / 2
  const radius = 450

  const positions = useMemo(() => {
    const layout = getCircularLayout(GRAPH_CHARACTERS.length, center, center, radius)
    const map: Record<string, { x: number; y: number }> = {}
    GRAPH_CHARACTERS.forEach((slug, i) => {
      map[slug] = layout[i]
    })
    return map
  }, [center])

  const filteredRelations = filterType
    ? CHARACTER_RELATIONS.filter((r) => r.type === filterType)
    : CHARACTER_RELATIONS

  const handleNodeClick = (slug: string) => {
    const info = buildSelected(slug)
    if (info) setSelected(info)
  }

  const filteredSelectedRelations = useMemo(() => {
    if (!selected) return []
    return filterType ? selected.relations.filter((r) => r.type === filterType) : selected.relations
  }, [selected, filterType])

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-thin sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <button
          onClick={() => setFilterType(null)}
          className={cn('chip flex-shrink-0', !filterType && 'border-gold/30 bg-gold/10 text-gold')}
        >
          Tümü
        </button>
        {Object.entries(RELATION_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setFilterType(type as RelationType)}
            className={cn('chip flex-shrink-0', filterType === type && 'border-gold/30 bg-gold/10 text-gold')}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: config.color }} />
            {config.label}
          </button>
        ))}
      </div>

      {/* Mobile: character picker rail */}
      {isMobile && (
        <div className="bento-card overflow-hidden rounded-2xl p-4">
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] text-pirate-muted/70">
            Karakter seç — ilişkilerini gör
          </p>
          <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-2 scrollbar-thin">
            {GRAPH_CHARACTERS.map((slug) => {
              const char = CHARACTERS.find((c) => c.slug === slug)
              const img = CHARACTER_IMAGES[slug]
              const isActive = selected?.slug === slug
              return (
                <button
                  key={slug}
                  onClick={() => handleNodeClick(slug)}
                  className={cn(
                    'group flex w-20 flex-shrink-0 flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-300',
                    isActive
                      ? 'border-gold/40 bg-gold/[0.08] shadow-[0_0_24px_rgba(244,163,0,0.15)]'
                      : 'border-pirate-border/20 bg-ocean-surface/30 hover:border-sea/30',
                  )}
                  aria-pressed={isActive}
                  aria-label={char?.name ?? slug}
                >
                  <div className={cn(
                    'relative h-14 w-14 overflow-hidden rounded-full border-2',
                    isActive ? 'border-gold/60' : 'border-pirate-border/30',
                  )}>
                    {img ? (
                      <Image
                        src={img}
                        alt={char?.name ?? slug}
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-ocean-surface text-lg font-extrabold text-pirate-text/80">
                        {(char?.name ?? slug).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    'line-clamp-2 text-center text-xs font-semibold leading-tight transition-colors',
                    isActive ? 'text-gold' : 'text-pirate-muted/70',
                  )}>
                    {(char?.name ?? slug).split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Desktop: full circular graph */}
      {!isMobile && (
        <div className="bento-card overflow-hidden rounded-2xl">
          <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="h-full w-full">
              <defs>
                <radialGradient id="graph-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(12,24,41,0.5)" />
                  <stop offset="100%" stopColor="rgba(6,14,26,0.8)" />
                </radialGradient>
                {GRAPH_CHARACTERS.map((slug) => {
                  const pos = positions[slug]
                  if (!pos) return null
                  return (
                    <clipPath key={`clip-${slug}`} id={`clip-${slug}`}>
                      <circle cx={pos.x} cy={pos.y} r="28" />
                    </clipPath>
                  )
                })}
              </defs>
              <rect width={svgSize} height={svgSize} fill="url(#graph-bg)" />

              {/* Edges */}
              {filteredRelations.map((rel, i) => {
                const from = positions[rel.from]
                const to = positions[rel.to]
                if (!from || !to) return null
                const config = RELATION_CONFIG[rel.type]
                const isHighlighted = hoveredSlug === rel.from || hoveredSlug === rel.to ||
                  selected?.slug === rel.from || selected?.slug === rel.to

                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={config.color}
                    strokeWidth={isHighlighted ? 2 : 0.8}
                    strokeOpacity={isHighlighted ? 0.8 : 0.15}
                    strokeDasharray={config.dash ? '6,4' : undefined}
                    className="transition-all duration-300"
                  />
                )
              })}

              {/* Nodes */}
              {GRAPH_CHARACTERS.map((slug) => {
                const pos = positions[slug]
                if (!pos) return null
                const char = CHARACTERS.find((c) => c.slug === slug)
                const isHovered = hoveredSlug === slug
                const isSelected = selected?.slug === slug
                const isConnected = selected
                  ? CHARACTER_RELATIONS.some(
                      (r) =>
                        (r.from === selected.slug && r.to === slug) ||
                        (r.to === selected.slug && r.from === slug),
                    )
                  : true

                return (
                  <g
                    key={slug}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSlug(slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() => handleNodeClick(slug)}
                  >
                    {(isHovered || isSelected) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="44"
                        fill={slug === 'luffy' ? 'rgba(231,76,60,0.15)' : 'rgba(30,144,255,0.15)'}
                      />
                    )}

                    {CHARACTER_IMAGES[slug] && (
                      <image
                        href={CHARACTER_IMAGES[slug]}
                        x={pos.x - 28}
                        y={pos.y - 28}
                        width="56"
                        height="56"
                        clipPath={`url(#clip-${slug})`}
                        preserveAspectRatio="xMidYMin slice"
                        opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                        style={{ transition: 'opacity 0.3s ease-out' }}
                      />
                    )}

                    {!CHARACTER_IMAGES[slug] && (
                      <>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isHovered || isSelected ? 32 : 28}
                          fill={isSelected ? '#f4a300' : 'rgba(12,24,41,0.9)'}
                          stroke={isSelected ? '#f4a300' : isHovered ? '#60b8ff' : 'rgba(30,144,255,0.25)'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                          className="transition-all duration-300"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 7}
                          textAnchor="middle"
                          fill={isSelected ? '#060e1a' : '#e8eaf0'}
                          fontSize="16"
                          fontWeight="bold"
                          className="pointer-events-none select-none"
                          opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                        >
                          {(char?.name ?? slug).charAt(0).toUpperCase()}
                        </text>
                      </>
                    )}

                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered || isSelected ? 32 : 28}
                      fill="none"
                      stroke={isSelected ? '#f4a300' : isHovered ? '#60b8ff' : 'rgba(30,144,255,0.25)'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                      className="transition-all duration-300"
                    />
                    {(isHovered || isSelected || (selected && isConnected)) && (
                      <text
                        x={pos.x}
                        y={pos.y - 32}
                        textAnchor="middle"
                        fill="#e8eaf0"
                        fontSize="11"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {char?.name ?? slug}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Selected character detail — used on both mobile & desktop */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="glass-elevated overflow-hidden rounded-2xl border border-gold/15 p-5 shadow-card-hover sm:rounded-3xl sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 sm:h-10 sm:w-10">
                  <Users className="h-4 w-4 text-gold sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-pirate-text sm:text-lg">{selected.name}</h3>
                  <span className="text-[11px] text-pirate-muted/60 sm:text-xs">
                    {filteredSelectedRelations.length} ilişki bağlantısı
                  </span>
                </div>
              </div>
              {!isMobile && (
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-pirate-border/20 bg-ocean-surface/30 text-pirate-muted/60 transition-all hover:border-gold/40 hover:bg-ocean-surface/60 hover:text-pirate-text"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {filteredSelectedRelations.length === 0 ? (
              <p className="rounded-xl border border-pirate-border/20 bg-ocean-surface/20 px-4 py-6 text-center text-xs text-pirate-muted/70">
                Bu filtreyle ilişki bulunamadı.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSelectedRelations.map((rel) => {
                  const config = RELATION_CONFIG[rel.type]
                  return (
                    <Link
                      key={`${rel.slug}-${rel.type}`}
                      href={`/characters/${rel.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-pirate-border/30 bg-gradient-to-r from-ocean-surface/50 to-ocean-surface/30 px-3 py-4 transition-all hover:border-gold/40 hover:from-ocean-surface/80 hover:to-ocean-surface/60 hover:shadow-gold-glow sm:px-4 sm:py-3.5"
                    >
                      <span className="h-4 w-4 flex-shrink-0 rounded-full ring-2 sm:h-3.5 sm:w-3.5" style={{ background: config.color, boxShadow: `0 0 0 2px ${config.color}40` }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-pirate-text transition-colors group-hover:text-gold sm:text-base">
                          {rel.name}
                        </p>
                        <p className="mt-0.5 text-sm text-pirate-muted/60 sm:text-xs">{config.label}</p>
                      </div>
                      {rel.label && (
                        <span className="hidden flex-shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold sm:inline" style={{ background: `${config.color}25`, color: config.color, borderColor: `${config.color}40` }}>
                          {rel.label}
                        </span>
                      )}
                      <ChevronRight className="ml-1 h-5 w-5 flex-shrink-0 text-pirate-muted/40 transition-all group-hover:translate-x-1 group-hover:text-gold sm:h-5 sm:w-5" />
                    </Link>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

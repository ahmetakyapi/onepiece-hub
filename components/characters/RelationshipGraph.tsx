'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function RelationshipGraph() {
  const [selected, setSelected] = useState<SelectedInfo | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<RelationType | null>(null)

  const svgSize = 600
  const center = svgSize / 2
  const radius = 230

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
    const char = CHARACTERS.find((c) => c.slug === slug)
    if (!char) return

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

    setSelected({ slug, name: char.name, relations })
  }

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType(null)}
          className={cn('chip', !filterType && 'border-gold/30 bg-gold/10 text-gold')}
        >
          Tümü
        </button>
        {Object.entries(RELATION_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setFilterType(type as RelationType)}
            className={cn('chip', filterType === type && 'border-gold/30 bg-gold/10 text-gold')}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: config.color }} />
            {config.label}
          </button>
        ))}
      </div>

      {/* Graph container */}
      <div className="bento-card overflow-hidden rounded-2xl">
        <div className="relative aspect-square w-full max-w-[600px] mx-auto">
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="h-full w-full">
            {/* Background */}
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
                    <circle cx={pos.x} cy={pos.y} r="14" />
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
                  {/* Glow */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="22"
                      fill={slug === 'luffy' ? 'rgba(231,76,60,0.15)' : 'rgba(30,144,255,0.15)'}
                    />
                  )}

                  {/* Avatar image */}
                  {CHARACTER_IMAGES[slug] && (
                    <image
                      href={CHARACTER_IMAGES[slug]}
                      x={pos.x - 14}
                      y={pos.y - 14}
                      width="28"
                      height="28"
                      clipPath={`url(#clip-${slug})`}
                      preserveAspectRatio="xMidYMin slice"
                      opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                      style={{ transition: 'opacity 0.3s ease-out' }}
                    />
                  )}

                  {/* Fallback circle + text if no image */}
                  {!CHARACTER_IMAGES[slug] && (
                    <>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isHovered || isSelected ? 16 : 14}
                        fill={isSelected ? '#f4a300' : 'rgba(12,24,41,0.9)'}
                        stroke={isSelected ? '#f4a300' : isHovered ? '#60b8ff' : 'rgba(30,144,255,0.25)'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                        className="transition-all duration-300"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 5}
                        textAnchor="middle"
                        fill={isSelected ? '#060e1a' : '#e8eaf0'}
                        fontSize="12"
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                        opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                      >
                        {(char?.name ?? slug).charAt(0).toUpperCase()}
                      </text>
                    </>
                  )}

                  {/* Ring on top (always visible) */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered || isSelected ? 16 : 14}
                    fill="none"
                    stroke={isSelected ? '#f4a300' : isHovered ? '#60b8ff' : 'rgba(30,144,255,0.25)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={selected && !isConnected && !isSelected ? 0.2 : 1}
                    className="transition-all duration-300"
                  />
                  {/* Name label */}
                  {(isHovered || isSelected || (selected && isConnected)) && (
                    <text
                      x={pos.x}
                      y={pos.y - 22}
                      textAnchor="middle"
                      fill="#e8eaf0"
                      fontSize="10"
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

      {/* Selected character detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bento-card overflow-hidden rounded-2xl p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" />
                <h3 className="text-base font-bold text-pirate-text">{selected.name}</h3>
                <span className="text-xs text-pirate-muted/50">
                  {selected.relations.length} ilişki
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-pirate-muted/40 hover:text-pirate-text"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-1.5">
              {selected.relations.map((rel) => {
                const config = RELATION_CONFIG[rel.type]
                return (
                  <Link
                    key={`${rel.slug}-${rel.type}`}
                    href={`/characters/${rel.slug}`}
                    className="group flex items-center gap-3 rounded-xl bg-ocean-surface/30 px-3 py-2 transition-colors hover:bg-ocean-surface/60"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: config.color }} />
                    <span className="text-sm font-semibold text-pirate-text group-hover:text-gold transition-colors">
                      {rel.name}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: config.color }}>
                      {rel.label ?? config.label}
                    </span>
                    <ChevronRight className="ml-auto h-3 w-3 text-pirate-muted/30 group-hover:text-gold transition-colors" />
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Compass, Waves, ChevronRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { LOCATIONS, SEAS } from '@/lib/constants/locations'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/variants'
import type { Location } from '@/types'

/* ─── Map coordinates for locations (approximate positions on SVG) ──── */
const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  // East Blue (right side of map)
  'foosha': { x: 78, y: 38 },
  'shells-town': { x: 82, y: 32 },
  'baratie': { x: 75, y: 42 },
  'arlong-park': { x: 80, y: 45 },
  'loguetown': { x: 72, y: 50 },
  // Grand Line (center band)
  'reverse-mountain': { x: 65, y: 50 },
  'whiskey-peak': { x: 58, y: 48 },
  'little-garden': { x: 55, y: 52 },
  'drum-island': { x: 52, y: 42 },
  'alabasta': { x: 48, y: 55 },
  'jaya': { x: 44, y: 48 },
  'skypiea': { x: 44, y: 35 },
  'water-7': { x: 40, y: 52 },
  'enies-lobby': { x: 38, y: 48 },
  'thriller-bark': { x: 35, y: 55 },
  'sabaody': { x: 32, y: 50 },
  'impel-down': { x: 30, y: 58 },
  'marineford': { x: 28, y: 50 },
  // New World (left side)
  'fish-man-island': { x: 28, y: 65 },
  'punk-hazard': { x: 24, y: 48 },
  'dressrosa': { x: 20, y: 55 },
  'zou': { x: 18, y: 45 },
  'whole-cake-island': { x: 15, y: 52 },
  'wano': { x: 12, y: 48 },
  'egghead': { x: 10, y: 42 },
  'laughtale': { x: 5, y: 50 },
  // Other
  'mary-geoise': { x: 30, y: 45 },
}

const SEA_COLORS: Record<string, string> = {
  'east-blue': '#3b82f6',
  'west-blue': '#f97316',
  'north-blue': '#22d3ee',
  'south-blue': '#22c55e',
  'grand-line': '#f4a300',
  'new-world': '#e74c3c',
  'calm-belt': '#8b8fa3',
  'red-line': '#e74c3c',
}

const DANGER_COLORS = ['#22c55e', '#22c55e', '#f4a300', '#f97316', '#e74c3c', '#dc2626']

export default function InteractiveWorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [activeSea, setActiveSea] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const mapRef = useRef<SVGSVGElement>(null)

  const filteredLocations = activeSea
    ? LOCATIONS.filter((l) => l.sea === activeSea)
    : LOCATIONS

  const handleLocationClick = useCallback((loc: Location) => {
    setSelectedLocation(loc)
  }, [])

  return (
    <div className="relative">
      {/* Sea filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSea(null)}
          className={cn(
            'chip transition-all',
            !activeSea && 'border-gold/30 bg-gold/10 text-gold',
          )}
        >
          <Compass className="h-3 w-3" />
          Tüm Denizler
        </button>
        {SEAS.filter(s => s.slug !== 'calm-belt' && s.slug !== 'red-line').map((sea) => (
          <button
            key={sea.slug}
            onClick={() => setActiveSea(sea.slug)}
            className={cn(
              'chip transition-all',
              activeSea === sea.slug && 'border-gold/30 bg-gold/10 text-gold',
            )}
          >
            <Waves className="h-3 w-3" />
            {sea.name}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="bento-card relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[2/1] w-full overflow-hidden sm:aspect-[5/2]">
          <svg
            ref={mapRef}
            viewBox="0 0 100 100"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ocean background */}
            <defs>
              <radialGradient id="ocean-bg" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0c1829" />
                <stop offset="100%" stopColor="#060e1a" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100" height="100" fill="url(#ocean-bg)" />

            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i}>
                <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(30,144,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(30,144,255,0.04)" strokeWidth="0.2" />
              </g>
            ))}

            {/* Red Line (vertical) */}
            <rect x="29" y="0" width="2" height="100" fill="rgba(231,76,60,0.15)" rx="1" />

            {/* Grand Line (horizontal band) */}
            <rect x="0" y="44" width="100" height="12" fill="rgba(244,163,0,0.04)" />
            <line x1="0" y1="44" x2="100" y2="44" stroke="rgba(244,163,0,0.12)" strokeWidth="0.3" strokeDasharray="2,2" />
            <line x1="0" y1="56" x2="100" y2="56" stroke="rgba(244,163,0,0.12)" strokeWidth="0.3" strokeDasharray="2,2" />

            {/* Calm Belt */}
            <rect x="0" y="40" width="100" height="4" fill="rgba(139,143,163,0.04)" />
            <rect x="0" y="56" width="100" height="4" fill="rgba(139,143,163,0.04)" />

            {/* Labels */}
            <text x="85" y="30" fill="rgba(59,130,246,0.3)" fontSize="2.5" fontWeight="bold">EAST BLUE</text>
            <text x="5" y="30" fill="rgba(249,115,22,0.3)" fontSize="2.5" fontWeight="bold">WEST BLUE</text>
            <text x="50" y="15" fill="rgba(34,211,238,0.3)" fontSize="2.5" fontWeight="bold" textAnchor="middle">NORTH BLUE</text>
            <text x="50" y="90" fill="rgba(34,197,94,0.3)" fontSize="2.5" fontWeight="bold" textAnchor="middle">SOUTH BLUE</text>
            <text x="50" y="51" fill="rgba(244,163,0,0.15)" fontSize="3" fontWeight="bold" textAnchor="middle">GRAND LINE</text>

            {/* Location dots */}
            {filteredLocations.map((loc) => {
              const coords = LOCATION_COORDS[loc.slug]
              if (!coords) return null
              const seaColor = SEA_COLORS[loc.sea] ?? '#8b8fa3'
              const isHovered = hoveredSlug === loc.slug
              const isSelected = selectedLocation?.slug === loc.slug

              return (
                <g key={loc.slug}>
                  {/* Pulse ring for hovered */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="2.5"
                      fill="none"
                      stroke={seaColor}
                      strokeWidth="0.3"
                      opacity="0.4"
                    >
                      <animate attributeName="r" from="1.5" to="3.5" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Main dot */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isHovered || isSelected ? 1.4 : 1}
                    fill={seaColor}
                    opacity={isHovered || isSelected ? 1 : 0.7}
                    filter={isHovered || isSelected ? 'url(#glow)' : undefined}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredSlug(loc.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() => handleLocationClick(loc)}
                  />
                  {/* Label on hover */}
                  {isHovered && (
                    <text
                      x={coords.x}
                      y={coords.y - 2.5}
                      fill="#e8eaf0"
                      fontSize="1.8"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {loc.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Compass rose */}
          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-pirate-border/20 bg-ocean-deep/80 backdrop-blur-sm">
            <Compass className="h-4 w-4 text-gold/40" />
          </div>
        </div>
      </div>

      {/* Location detail panel */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-4 bento-card overflow-hidden rounded-2xl"
          >
            <div className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: SEA_COLORS[selectedLocation.sea] }} />
                    <h3 className="text-lg font-bold text-pirate-text">{selectedLocation.name}</h3>
                    <span className="rounded-full bg-ocean-surface px-2 py-0.5 text-[10px] font-semibold text-pirate-muted">
                      {SEAS.find(s => s.slug === selectedLocation.sea)?.name}
                    </span>
                  </div>
                  <p className="text-xs font-medium capitalize text-pirate-muted/50">{selectedLocation.type}</p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-pirate-border/10 text-pirate-muted/40 transition-colors hover:text-pirate-text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-pirate-muted">{selectedLocation.description}</p>

              {/* Danger level */}
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-pirate-muted/40" />
                <span className="text-xs font-semibold text-pirate-muted/50">Tehlike Seviyesi</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-5 rounded-full"
                      style={{
                        background: i < selectedLocation.dangerLevel
                          ? DANGER_COLORS[selectedLocation.dangerLevel]
                          : 'rgba(30,144,255,0.08)',
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: DANGER_COLORS[selectedLocation.dangerLevel] }}>
                  {selectedLocation.dangerLevel}/5
                </span>
              </div>

              {/* Significance */}
              {selectedLocation.significance.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-bold text-pirate-text">Önemli Olaylar</h4>
                  <ul className="space-y-1">
                    {selectedLocation.significance.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-pirate-muted">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold/50" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related arcs */}
              {selectedLocation.relatedArcs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLocation.relatedArcs.map((arc) => (
                    <Link
                      key={arc}
                      href={`/arcs/${arc}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-ocean-surface px-2.5 py-1 text-[11px] font-medium text-pirate-muted transition-colors hover:bg-sea/10 hover:text-sea"
                    >
                      {arc.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      <ChevronRight className="h-2.5 w-2.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

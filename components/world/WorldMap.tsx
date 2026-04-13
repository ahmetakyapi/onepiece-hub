'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  Shield,
  Compass,
  Anchor,
  Waves,
  Map,
  Navigation,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { LOCATIONS, SEAS, type Location } from '@/lib/constants/locations'
import { getArcBySlug } from '@/lib/constants/arcs'
import { EASE } from '@/lib/variants'

/* ─── Map Position Data (viewBox: 0 0 1200 700) ───────────────────────── */

const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  // East Blue (bottom-right quadrant)
  foosha: { x: 770, y: 510 },
  'shells-town': { x: 840, y: 480 },
  baratie: { x: 710, y: 475 },
  'arlong-park': { x: 900, y: 530 },
  loguetown: { x: 640, y: 440 },

  // Grand Line — Paradise (right of Red Line)
  'reverse-mountain': { x: 565, y: 350 },
  alabasta: { x: 650, y: 335 },
  skypiea: { x: 720, y: 290 },
  'water-7': { x: 780, y: 345 },
  'enies-lobby': { x: 830, y: 360 },
  'thriller-bark': { x: 880, y: 348 },
  sabaody: { x: 940, y: 342 },
  marineford: { x: 985, y: 365 },

  // Calm Belt
  'amazon-lily': { x: 895, y: 420 },
  'impel-down': { x: 955, y: 410 },

  // New World (left of Red Line)
  'fish-man-island': { x: 475, y: 365 },
  'punk-hazard': { x: 415, y: 340 },
  dressrosa: { x: 365, y: 355 },
  zou: { x: 315, y: 335 },
  'whole-cake-island': { x: 255, y: 350 },
  wano: { x: 195, y: 338 },
  egghead: { x: 140, y: 355 },
  'laugh-tale': { x: 75, y: 350 },

  // Red Line
  'mary-geoise': { x: 515, y: 300 },
}

/* ─── Sea Marker Colors ────────────────────────────────────────────────── */

const SEA_MARKER_COLORS: Record<string, string> = {
  'east-blue': '#60a5fa',
  'west-blue': '#fb923c',
  'north-blue': '#22d3ee',
  'south-blue': '#4ade80',
  'grand-line': '#f4a300',
  'new-world': '#ef4444',
  'calm-belt': '#94a3b8',
  'red-line': '#ef4444',
}

const SEA_MARKER_GLOW: Record<string, string> = {
  'east-blue': 'rgba(96,165,250,0.6)',
  'west-blue': 'rgba(251,146,60,0.6)',
  'north-blue': 'rgba(34,211,238,0.6)',
  'south-blue': 'rgba(74,222,128,0.6)',
  'grand-line': 'rgba(244,163,0,0.6)',
  'new-world': 'rgba(239,68,68,0.6)',
  'calm-belt': 'rgba(148,163,184,0.5)',
  'red-line': 'rgba(239,68,68,0.6)',
}

/* ─── Danger Level ─────────────────────────────────────────────────────── */

const DANGER_COLORS = ['', '#4ade80', '#facc15', '#fb923c', '#ef4444', '#dc2626'] as const
const DANGER_LABELS = ['', 'Güvenli', 'Düşük', 'Orta', 'Yüksek', 'Ölümcül'] as const
const DANGER_BAR_GRADIENTS = [
  '',
  'from-green-500 to-green-400',
  'from-green-400 to-yellow-400',
  'from-yellow-400 to-orange-400',
  'from-orange-400 to-red-500',
  'from-red-500 to-red-600',
] as const

/* ─── Type Metadata ────────────────────────────────────────────────────── */

const TYPE_ICONS: Record<string, typeof MapPin> = {
  island: MapPin,
  sea: Waves,
  city: Map,
  fortress: Shield,
  ship: Anchor,
  other: Navigation,
}

const TYPE_LABELS: Record<string, string> = {
  island: 'Ada',
  sea: 'Deniz',
  city: 'Şehir',
  fortress: 'Kale',
  ship: 'Gemi',
  other: 'Diğer',
}

/* ─── Journey Route ────────────────────────────────────────────────────── */

const JOURNEY_ORDER = [
  'foosha',
  'shells-town',
  'baratie',
  'arlong-park',
  'loguetown',
  'reverse-mountain',
  'alabasta',
  'skypiea',
  'water-7',
  'enies-lobby',
  'thriller-bark',
  'sabaody',
  'amazon-lily',
  'impel-down',
  'marineford',
  'fish-man-island',
  'punk-hazard',
  'dressrosa',
  'zou',
  'whole-cake-island',
  'wano',
  'egghead',
]

function generateJourneyPath(): string {
  const points = JOURNEY_ORDER.map((slug) => MAP_POSITIONS[slug]).filter(Boolean)
  if (points.length < 2) return ''

  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    const cpy1 = prev.y
    const cpy2 = curr.y
    d += ` C ${cpx},${cpy1} ${cpx},${cpy2} ${curr.x},${curr.y}`
  }

  return d
}

/* ─── Sea Label Data ───────────────────────────────────────────────────── */

const SEA_LABELS = [
  { text: 'EAST BLUE', x: 780, y: 570, color: '#60a5fa', opacity: 0.2 },
  { text: 'NORTH BLUE', x: 780, y: 180, color: '#22d3ee', opacity: 0.15 },
  { text: 'WEST BLUE', x: 280, y: 180, color: '#fb923c', opacity: 0.15 },
  { text: 'SOUTH BLUE', x: 280, y: 570, color: '#4ade80', opacity: 0.15 },
  { text: 'PARADISE', x: 760, y: 375, color: '#f4a300', opacity: 0.1 },
  { text: 'NEW WORLD', x: 280, y: 375, color: '#ef4444', opacity: 0.1 },
]

/* ─── Detail Panel ─────────────────────────────────────────────────────── */

function DetailPanel({
  location,
  onClose,
}: {
  location: Location
  onClose: () => void
}) {
  const sea = SEAS.find((s) => s.slug === location.sea)
  const TypeIcon = TYPE_ICONS[location.type] ?? MapPin
  const markerColor = SEA_MARKER_COLORS[location.sea] ?? '#f4a300'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-start justify-end bg-ocean-deep/30 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ x: 40, opacity: 0, scale: 0.97 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="m-3 sm:m-4"
      >
      <div className="glass-elevated scrollbar-thin max-h-[calc(100vh-200px)] w-[calc(100vw-24px)] overflow-y-auto rounded-2xl sm:w-[360px]">
        {/* Header */}
        <div className="relative border-b border-pirate-border/30 p-5">
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${markerColor}40, transparent 70%)`,
            }}
          />

          <div className="relative">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `${markerColor}30`,
                    background: `${markerColor}10`,
                  }}
                >
                  <TypeIcon className="h-5 w-5" style={{ color: markerColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-pirate-text">
                    {location.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: markerColor }}
                    >
                      {TYPE_LABELS[location.type]}
                    </span>
                    <span className="text-pirate-muted/30">·</span>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: sea?.color.replace('text-', '') }}
                    >
                      {sea?.name}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-pirate-border/30 bg-ocean-deep/50 text-pirate-muted transition-colors hover:border-pirate-border hover:text-pirate-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          {/* Description */}
          <p className="text-sm leading-relaxed text-pirate-muted">
            {location.description}
          </p>

          {/* Danger level */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield
                  className="h-3.5 w-3.5"
                  style={{ color: DANGER_COLORS[location.dangerLevel] }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: DANGER_COLORS[location.dangerLevel] }}
                >
                  Tehlike: {DANGER_LABELS[location.dangerLevel]}
                </span>
              </div>
              <span
                className="text-xs font-bold"
                style={{ color: DANGER_COLORS[location.dangerLevel] }}
              >
                {location.dangerLevel}/5
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ocean-surface">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${DANGER_BAR_GRADIENTS[location.dangerLevel]}`}
                initial={{ width: 0 }}
                animate={{ width: `${(location.dangerLevel / 5) * 100}%` }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Significance */}
          {location.significance.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
                Önemli Olaylar
              </p>
              <ul className="space-y-2">
                {location.significance.map((sig, idx) => (
                  <li key={sig} className="flex gap-2.5 text-xs text-pirate-muted">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{
                        background: `${markerColor}15`,
                        border: `1px solid ${markerColor}30`,
                        color: markerColor,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related arcs */}
          {location.relatedArcs.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-pirate-muted">
                İlgili Arc&apos;lar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {location.relatedArcs.map((arcSlug) => {
                  const arc = getArcBySlug(arcSlug)
                  return (
                    <Link
                      key={arcSlug}
                      href={`/arcs/${arcSlug}`}
                      className="group/arc flex items-center gap-1 rounded-full bg-ocean-surface px-3 py-1 text-[11px] font-medium text-sea transition-colors hover:bg-sea/10 hover:text-sea-light"
                    >
                      {arc?.name ?? arcSlug}
                      <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover/arc:opacity-100" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Compass Rose ─────────────────────────────────────────────────────── */

function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.3">
      {/* Outer ring */}
      <circle r="28" fill="none" stroke="rgba(244,163,0,0.3)" strokeWidth="1" />
      <circle r="22" fill="none" stroke="rgba(244,163,0,0.15)" strokeWidth="0.5" />

      {/* Cardinal directions */}
      <line y1="-26" y2="-18" stroke="#f4a300" strokeWidth="1.5" />
      <line y1="18" y2="26" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />
      <line x1="-26" x2="-18" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />
      <line x1="18" x2="26" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />

      {/* Diagonal ticks */}
      {[45, 135, 225, 315].map((angle) => (
        <line
          key={angle}
          x1={Math.cos((angle * Math.PI) / 180) * 18}
          y1={Math.sin((angle * Math.PI) / 180) * 18}
          x2={Math.cos((angle * Math.PI) / 180) * 23}
          y2={Math.sin((angle * Math.PI) / 180) * 23}
          stroke="rgba(244,163,0,0.2)"
          strokeWidth="0.5"
        />
      ))}

      {/* N label */}
      <text y="-32" textAnchor="middle" fill="#f4a300" fontSize="8" fontWeight="700">
        N
      </text>

      {/* Center diamond */}
      <polygon points="0,-12 4,0 0,12 -4,0" fill="rgba(244,163,0,0.25)" />
      <polygon points="0,-8 2.5,0 0,8 -2.5,0" fill="rgba(244,163,0,0.5)" />
    </g>
  )
}

/* ─── Location Marker ──────────────────────────────────────────────────── */

function LocationMarker({
  location,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: {
  location: Location
  position: { x: number; y: number }
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}) {
  const color = SEA_MARKER_COLORS[location.sea] ?? '#f4a300'
  const glowColor = SEA_MARKER_GLOW[location.sea] ?? 'rgba(244,163,0,0.6)'
  const isActive = isSelected || isHovered

  return (
    <g
      className="cursor-pointer"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Pulse ring — always visible, slower for selected */}
      <circle cx={position.x} cy={position.y} r="12" fill="none" opacity="0">
        <animate
          attributeName="r"
          values="6;16;6"
          dur={isSelected ? '2.5s' : '3s'}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={isActive ? '0.5;0;0.5' : '0.2;0;0.2'}
          dur={isSelected ? '2.5s' : '3s'}
          repeatCount="indefinite"
        />
        <animate attributeName="stroke-width" values="2;0.5;2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle
        cx={position.x}
        cy={position.y}
        r="6"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0"
      >
        <animate
          attributeName="r"
          values="6;16;6"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={isActive ? '0.4;0;0.4' : '0.15;0;0.15'}
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Selected ring */}
      {isSelected && (
        <circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      )}

      {/* Glow */}
      <circle
        cx={position.x}
        cy={position.y}
        r={isActive ? 8 : 5}
        fill={glowColor}
        opacity={isActive ? 0.35 : 0.15}
        style={{ transition: 'all 0.3s ease-out' }}
      />

      {/* Main dot */}
      <circle
        cx={position.x}
        cy={position.y}
        r={isActive ? 5 : 3.5}
        fill={color}
        stroke={isActive ? '#fff' : 'transparent'}
        strokeWidth={isActive ? 1 : 0}
        style={{ transition: 'all 0.3s ease-out' }}
      />

      {/* Hover tooltip */}
      {isHovered && !isSelected && (
        <g>
          {/* Tooltip bg */}
          <rect
            x={position.x - 50}
            y={position.y - 32}
            width={100}
            height={20}
            rx="6"
            fill="rgba(6,14,26,0.9)"
            stroke={`${color}40`}
            strokeWidth="1"
          />
          {/* Tooltip text */}
          <text
            x={position.x}
            y={position.y - 18}
            textAnchor="middle"
            fill={color}
            fontSize="9"
            fontWeight="700"
            fontFamily="var(--font-sans), sans-serif"
          >
            {location.name}
          </text>
        </g>
      )}

      {/* Always-visible label for selected */}
      {isSelected && (
        <g>
          <rect
            x={position.x - 55}
            y={position.y - 34}
            width={110}
            height={22}
            rx="7"
            fill="rgba(6,14,26,0.95)"
            stroke={`${color}50`}
            strokeWidth="1.5"
          />
          <text
            x={position.x}
            y={position.y - 19}
            textAnchor="middle"
            fill="#e8eaf0"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="var(--font-sans), sans-serif"
          >
            {location.name}
          </text>
        </g>
      )}
    </g>
  )
}

/* ─── Main WorldMap Component ──────────────────────────────────────────── */

export default function WorldMap() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const selectedLocation = useMemo(
    () => LOCATIONS.find((l) => l.slug === selectedSlug) ?? null,
    [selectedSlug]
  )

  const journeyPath = useMemo(() => generateJourneyPath(), [])

  const handleSelect = useCallback(
    (slug: string) => {
      setSelectedSlug((prev) => (prev === slug ? null : slug))
    },
    []
  )

  const handleMapClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Close panel if clicking on empty map area (not a marker)
    const tag = (e.target as SVGElement).tagName.toLowerCase()
    if (tag === 'svg' || tag === 'rect' || tag === 'line' || tag === 'path' || tag === 'pattern') {
      setSelectedSlug(null)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mb-14"
    >
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
          <Compass className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-pirate-text">İnteraktif Harita</h2>
          <p className="text-xs text-pirate-muted">
            Lokasyonlara tıklayarak detaylı bilgi alın
          </p>
        </div>
      </div>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-2xl border border-pirate-border/30 bg-ocean-deep">
        {/* Top decoration bar */}
        <div className="flex items-center gap-2 border-b border-pirate-border/20 bg-ocean-surface/30 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-luffy/60" />
            <div className="h-2 w-2 rounded-full bg-gold/60" />
            <div className="h-2 w-2 rounded-full bg-sea/60" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-pirate-muted/60">
            One Piece — Dünya Haritası
          </span>
        </div>

        {/* Scrollable map area */}
        <div className="relative overflow-x-auto">
          <div className="relative min-w-[800px]">
            {/* SVG Map */}
            <svg
              viewBox="0 0 1200 700"
              className="h-auto w-full"
              onClick={handleMapClick}
              style={{ minHeight: '400px' }}
            >
              <defs>
                {/* Ocean gradient */}
                <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#060e1a" />
                  <stop offset="30%" stopColor="#0a1628" />
                  <stop offset="70%" stopColor="#0a1628" />
                  <stop offset="100%" stopColor="#060e1a" />
                </linearGradient>

                {/* Red Line gradient */}
                <linearGradient id="redLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(231,76,60,0)" />
                  <stop offset="25%" stopColor="rgba(231,76,60,0.15)" />
                  <stop offset="50%" stopColor="rgba(231,76,60,0.35)" />
                  <stop offset="75%" stopColor="rgba(231,76,60,0.15)" />
                  <stop offset="100%" stopColor="rgba(231,76,60,0)" />
                </linearGradient>

                {/* Red Line inner glow */}
                <linearGradient id="redLineCenter" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(231,76,60,0)" />
                  <stop offset="40%" stopColor="rgba(231,76,60,0.6)" />
                  <stop offset="50%" stopColor="rgba(239,68,68,0.9)" />
                  <stop offset="60%" stopColor="rgba(231,76,60,0.6)" />
                  <stop offset="100%" stopColor="rgba(231,76,60,0)" />
                </linearGradient>

                {/* Grand Line gradient */}
                <linearGradient id="grandLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(244,163,0,0)" />
                  <stop offset="15%" stopColor="rgba(244,163,0,0.06)" />
                  <stop offset="50%" stopColor="rgba(244,163,0,0.12)" />
                  <stop offset="85%" stopColor="rgba(244,163,0,0.06)" />
                  <stop offset="100%" stopColor="rgba(244,163,0,0)" />
                </linearGradient>

                {/* Calm Belt gradient */}
                <linearGradient id="calmBeltGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(100,116,139,0)" />
                  <stop offset="50%" stopColor="rgba(100,116,139,0.08)" />
                  <stop offset="100%" stopColor="rgba(100,116,139,0)" />
                </linearGradient>

                {/* Route glow filter */}
                <filter id="routeGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Water pattern */}
                <pattern id="waterPattern" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M0,20 Q20,10 40,20 Q60,30 80,20"
                    fill="none"
                    stroke="rgba(30,144,255,0.035)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M0,35 Q20,25 40,35 Q60,45 80,35"
                    fill="none"
                    stroke="rgba(30,144,255,0.02)"
                    strokeWidth="0.3"
                  />
                </pattern>

                {/* Animated marker glow */}
                <filter id="selectedGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ── Layer 1: Ocean Background ─────────────────────────── */}
              <rect width="1200" height="700" fill="url(#oceanBg)" />
              <rect width="1200" height="700" fill="url(#waterPattern)" />

              {/* ── Layer 2: Subtle Grid ──────────────────────────────── */}
              <g opacity="0.06">
                {/* Vertical grid lines */}
                {Array.from({ length: 13 }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 100}
                    y1="0"
                    x2={i * 100}
                    y2="700"
                    stroke="#1e90ff"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Horizontal grid lines */}
                {Array.from({ length: 8 }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 100}
                    x2="1200"
                    y2={i * 100}
                    stroke="#1e90ff"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* ── Layer 3: Calm Belt (upper) ────────────────────────── */}
              <rect x="0" y="270" width="1200" height="50" fill="url(#calmBeltGrad)" />

              {/* ── Layer 4: Grand Line band ──────────────────────────── */}
              <rect x="0" y="310" width="1200" height="80" fill="url(#grandLineGrad)" />

              {/* Grand Line border lines (golden dashed) */}
              <line
                x1="0" y1="312" x2="1200" y2="312"
                stroke="rgba(244,163,0,0.12)"
                strokeWidth="1"
                strokeDasharray="12,6"
              />
              <line
                x1="0" y1="388" x2="1200" y2="388"
                stroke="rgba(244,163,0,0.12)"
                strokeWidth="1"
                strokeDasharray="12,6"
              />

              {/* Grand Line center line */}
              <line
                x1="0" y1="350" x2="1200" y2="350"
                stroke="rgba(244,163,0,0.06)"
                strokeWidth="0.5"
                strokeDasharray="4,8"
              />

              {/* ── Layer 5: Calm Belt (lower) ────────────────────────── */}
              <rect x="0" y="380" width="1200" height="50" fill="url(#calmBeltGrad)" />

              {/* Calm Belt labels */}
              <text
                x="1050" y="298"
                fill="rgba(148,163,184,0.12)"
                fontSize="8"
                fontWeight="600"
                letterSpacing="3"
                fontFamily="var(--font-sans), sans-serif"
              >
                CALM BELT
              </text>
              <text
                x="1050" y="418"
                fill="rgba(148,163,184,0.12)"
                fontSize="8"
                fontWeight="600"
                letterSpacing="3"
                fontFamily="var(--font-sans), sans-serif"
              >
                CALM BELT
              </text>

              {/* ── Layer 6: Red Line ─────────────────────────────────── */}
              <rect x="488" y="0" width="44" height="700" fill="url(#redLineGrad)" />
              <rect x="505" y="0" width="10" height="700" fill="url(#redLineCenter)" />

              {/* Red Line label */}
              <text
                x="510" y="80"
                textAnchor="middle"
                fill="rgba(239,68,68,0.2)"
                fontSize="10"
                fontWeight="700"
                letterSpacing="4"
                fontFamily="var(--font-sans), sans-serif"
                transform="rotate(-90, 510, 80)"
              >
                RED LINE
              </text>

              {/* ── Layer 7: Sea Labels ───────────────────────────────── */}
              {SEA_LABELS.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  fill={label.color}
                  opacity={label.opacity}
                  fontSize={label.text === 'PARADISE' || label.text === 'NEW WORLD' ? '14' : '18'}
                  fontWeight="800"
                  letterSpacing={label.text === 'PARADISE' || label.text === 'NEW WORLD' ? '6' : '8'}
                  fontFamily="var(--font-sans), sans-serif"
                >
                  {label.text}
                </text>
              ))}

              {/* ── Layer 7.5: Intersection markers ─────────────────── */}
              {/* Reverse Mountain intersection glow */}
              <circle
                cx="565"
                cy="350"
                r="20"
                fill="none"
                stroke="rgba(244,163,0,0.08)"
                strokeWidth="1"
                strokeDasharray="4,3"
              />
              {/* Red Line / Fish-Man Island crossing glow */}
              <circle
                cx="510"
                cy="350"
                r="20"
                fill="none"
                stroke="rgba(231,76,60,0.08)"
                strokeWidth="1"
                strokeDasharray="4,3"
              />

              {/* Decorative sea king silhouettes in Calm Belt */}
              <g opacity="0.04">
                <ellipse cx="700" cy="412" rx="18" ry="4" fill="#94a3b8" />
                <ellipse cx="350" cy="290" rx="14" ry="3" fill="#94a3b8" />
                <ellipse cx="850" cy="295" rx="12" ry="3" fill="#94a3b8" />
              </g>

              {/* ── Layer 8: Skypiea sky connection ─────────────────── */}
              <line
                x1={MAP_POSITIONS.skypiea.x}
                y1={MAP_POSITIONS.skypiea.y + 8}
                x2={MAP_POSITIONS.skypiea.x}
                y2={340}
                stroke="rgba(244,163,0,0.12)"
                strokeWidth="1"
                strokeDasharray="3,4"
              />
              <text
                x={MAP_POSITIONS.skypiea.x + 10}
                y={MAP_POSITIONS.skypiea.y + 20}
                fill="rgba(244,163,0,0.15)"
                fontSize="6"
                fontFamily="var(--font-sans), sans-serif"
              >
                ↑ 10.000m
              </text>

              {/* ── Layer 9: Journey Route ────────────────────────────── */}
              {journeyPath && (
                <g filter="url(#routeGlow)">
                  <path
                    d={journeyPath}
                    fill="none"
                    stroke="rgba(244,163,0,0.12)"
                    strokeWidth="2"
                    strokeDasharray="8,5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* ── Layer 10: Compass Rose ────────────────────────────── */}
              <CompassRose x={1130} y={640} />

              {/* ── Layer 11: Location Markers ────────────────────────── */}
              {LOCATIONS.map((loc) => {
                const pos = MAP_POSITIONS[loc.slug]
                if (!pos) return null

                return (
                  <LocationMarker
                    key={loc.slug}
                    location={loc}
                    position={pos}
                    isSelected={selectedSlug === loc.slug}
                    isHovered={hoveredSlug === loc.slug}
                    onSelect={() => handleSelect(loc.slug)}
                    onHover={() => setHoveredSlug(loc.slug)}
                    onLeave={() => setHoveredSlug(null)}
                  />
                )
              })}
            </svg>

            {/* Detail Panel */}
            <AnimatePresence mode="wait">
              {selectedLocation && (
                <DetailPanel
                  key={selectedLocation.slug}
                  location={selectedLocation}
                  onClose={() => setSelectedSlug(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-pirate-border/20 bg-ocean-surface/20 px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-pirate-muted/50">
            Bölgeler
          </span>
          {[
            { label: 'East Blue', color: '#60a5fa' },
            { label: 'Grand Line', color: '#f4a300' },
            { label: 'New World', color: '#ef4444' },
            { label: 'Calm Belt', color: '#94a3b8' },
            { label: 'Red Line', color: '#ef4444' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-[10px] font-medium text-pirate-muted/70">
                {item.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="h-px w-4 border-t border-dashed border-gold/40" />
            <span className="text-[10px] font-medium text-pirate-muted/70">
              Hasır Şapka Rotası
            </span>
          </div>
          <div className="ml-auto hidden text-[10px] text-pirate-muted/40 sm:block">
            Lokasyona tıkla → Detay
          </div>
        </div>
      </div>
    </motion.div>
  )
}

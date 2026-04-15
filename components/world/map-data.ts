import { MapPin, Waves, Map, Shield, Anchor, Navigation } from 'lucide-react'

/* ─── Map Position Data (viewBox: 0 0 1200 700) ───────────────────────── */

export const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
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

export const SEA_MARKER_COLORS: Record<string, string> = {
  'east-blue': '#60a5fa',
  'west-blue': '#fb923c',
  'north-blue': '#22d3ee',
  'south-blue': '#4ade80',
  'grand-line': '#f4a300',
  'new-world': '#ef4444',
  'calm-belt': '#94a3b8',
  'red-line': '#ef4444',
}

export const SEA_MARKER_GLOW: Record<string, string> = {
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

export const DANGER_COLORS = ['', '#4ade80', '#facc15', '#fb923c', '#ef4444', '#dc2626'] as const
export const DANGER_LABELS = ['', 'Güvenli', 'Düşük', 'Orta', 'Yüksek', 'Ölümcül'] as const
export const DANGER_BAR_GRADIENTS = [
  '',
  'from-green-500 to-green-400',
  'from-green-400 to-yellow-400',
  'from-yellow-400 to-orange-400',
  'from-orange-400 to-red-500',
  'from-red-500 to-red-600',
] as const

/* ─── Type Metadata ────────────────────────────────────────────────────── */

export const TYPE_ICONS: Record<string, typeof MapPin> = {
  island: MapPin,
  sea: Waves,
  city: Map,
  fortress: Shield,
  ship: Anchor,
  other: Navigation,
}

export const TYPE_LABELS: Record<string, string> = {
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

export function generateJourneyPath(): string {
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

export const SEA_LABELS = [
  { text: 'EAST BLUE', x: 780, y: 570, color: '#60a5fa', opacity: 0.2 },
  { text: 'NORTH BLUE', x: 780, y: 180, color: '#22d3ee', opacity: 0.15 },
  { text: 'WEST BLUE', x: 280, y: 180, color: '#fb923c', opacity: 0.15 },
  { text: 'SOUTH BLUE', x: 280, y: 570, color: '#4ade80', opacity: 0.15 },
  { text: 'PARADISE', x: 760, y: 375, color: '#f4a300', opacity: 0.1 },
  { text: 'NEW WORLD', x: 280, y: 375, color: '#ef4444', opacity: 0.1 },
]

/* ─── Legend Items ─────────────────────────────────────────────────────── */

export const LEGEND_ITEMS = [
  { label: 'East Blue', color: '#60a5fa' },
  { label: 'Grand Line', color: '#f4a300' },
  { label: 'New World', color: '#ef4444' },
  { label: 'Calm Belt', color: '#94a3b8' },
  { label: 'Red Line', color: '#ef4444' },
]

import { motion } from 'framer-motion'
import { X, Shield, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { SEAS } from '@/lib/constants/locations'
import type { Location } from '@/types'
import { getArcBySlug } from '@/lib/constants/arcs'
import { EASE } from '@/lib/variants'
import {
  SEA_MARKER_COLORS,
  TYPE_ICONS,
  TYPE_LABELS,
  DANGER_COLORS,
  DANGER_LABELS,
  DANGER_BAR_GRADIENTS,
} from './map-data'

export default function DetailPanel({
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

'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants/locations'
import { EASE } from '@/lib/variants'
import { MAP_POSITIONS, generateJourneyPath, LEGEND_ITEMS } from './map-data'
import {
  MapDefs,
  OceanLayer,
  GridLayer,
  SeaBands,
  RedLine,
  SeaLabels,
  Decorations,
  JourneyRoute,
} from './MapSVGLayers'
import CompassRose from './CompassRose'
import LocationMarker from './LocationMarker'
import DetailPanel from './DetailPanel'

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
            <svg
              viewBox="0 0 1200 700"
              className="h-auto w-full"
              onClick={handleMapClick}
              style={{ minHeight: '400px' }}
            >
              <MapDefs />
              <OceanLayer />
              <GridLayer />
              <SeaBands />
              <RedLine />
              <SeaLabels />
              <Decorations />
              <JourneyRoute path={journeyPath} />
              <CompassRose x={1130} y={640} />

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
          {LEGEND_ITEMS.map((item) => (
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

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Compass, Film } from 'lucide-react'
import { fadeUp } from '@/lib/variants'
import { getArcImage } from '@/lib/constants/images'
import type { Arc } from '@/types'

export default function ArcCard({ arc }: { arc: Arc }) {
  const img = getArcImage(arc.slug)

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/arcs/${arc.slug}`}
        className="glass group flex flex-col overflow-hidden rounded-xl transition-all hover:border-gold/30 hover:shadow-gold-glow"
      >
        {/* Cover */}
        <div className="relative h-64 w-full overflow-hidden bg-ocean-surface sm:h-72">
          {img ? (
            <Image
              src={img}
              alt={arc.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Compass className="h-10 w-10 text-sea/20" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent" />
          {/* Episode badge */}
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-ocean-deep/80 px-2 py-1 text-[10px] font-bold text-sea backdrop-blur-sm">
            <Film className="h-3 w-3" />
            {arc.episodeCount}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1 text-base font-bold text-pirate-text transition-colors group-hover:text-gold">
            {arc.name}
          </h3>
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-pirate-muted">
            {arc.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-end">
            <ChevronRight className="h-4 w-4 text-pirate-muted transition-all group-hover:translate-x-1 group-hover:text-gold" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

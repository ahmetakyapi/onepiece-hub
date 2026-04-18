'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Skull } from 'lucide-react'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer } from '@/lib/variants'
import type { Character } from '@/types'

interface Props {
  characters: Character[]
  title?: string
  description?: string
}

function RelatedCharacters({ characters, title = 'İlgili Karakterler', description }: Props) {
  if (characters.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp} className="mb-5">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-pirate-text">
          <Users className="h-5 w-5 text-gold" />
          {title}
          <span className="ml-1 rounded-full bg-gold/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-gold/80">
            {characters.length}
          </span>
        </h2>
        {description && (
          <p className="text-xs text-pirate-muted sm:text-sm">{description}</p>
        )}
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map(char => {
          const img = getCharacterImage(char.slug)
          return (
            <motion.div key={char.slug} variants={fadeUp}>
              <Link
                href={`/characters/${char.slug}`}
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-pirate-border/20 bg-ocean-surface/30 p-3 transition-all duration-300 hover:border-gold/30 hover:bg-ocean-surface/60 hover:-translate-y-0.5"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/[0.05] blur-[40px] transition-opacity duration-500 group-hover:bg-gold/[0.12]" />

                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-pirate-border/30">
                  {img ? (
                    <Image
                      src={img}
                      alt={char.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Skull className="h-5 w-5 text-pirate-muted/40" />
                    </div>
                  )}
                </div>

                <div className="relative min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-pirate-text transition-colors group-hover:text-gold">
                    {char.name}
                  </p>
                  {char.epithet && (
                    <p className="truncate text-[11px] text-pirate-muted">{char.epithet}</p>
                  )}
                  {char.bounty && (
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-gold/70 stat-number">
                      {char.bounty}
                    </p>
                  )}
                </div>

                <ArrowRight className="relative h-4 w-4 flex-shrink-0 text-pirate-muted/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default memo(RelatedCharacters)

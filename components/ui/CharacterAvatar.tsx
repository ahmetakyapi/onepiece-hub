'use client'

import { memo } from 'react'
import Image from 'next/image'
import { getCharacterImage } from '@/lib/constants/images'

const CREW_GRADIENTS: Record<string, string> = {
  'straw-hat': 'from-gold/40 to-gold-bright/20',
  'marine': 'from-sea/40 to-sea-light/20',
  'shichibukai': 'from-fruit-strong/40 to-fruit/20',
  'yonko': 'from-luffy/40 to-gold/20',
  'revolutionary': 'from-accent-emerald/40 to-accent-emerald/20',
  'baroque-works': 'from-accent-amber/40 to-accent-amber/20',
  'cp9': 'from-accent-silver/40 to-accent-silver/20',
  'supernova': 'from-accent-cyan/40 to-accent-cyan/20',
  'beast-pirates': 'from-accent-indigo/40 to-accent-indigo/20',
  'big-mom-pirates': 'from-accent-pink/40 to-accent-pink/20',
  'roger-pirates': 'from-gold/40 to-accent-amber/20',
  'whitebeard-pirates': 'from-accent-teal/40 to-accent-teal/20',
  'red-hair-pirates': 'from-accent-rose/40 to-accent-rose/20',
  'ally': 'from-accent-lime/40 to-accent-lime/20',
  'other': 'from-accent-silver/40 to-accent-silver/20',
}

const CREW_TEXT_COLORS: Record<string, string> = {
  'straw-hat': 'text-gold',
  'marine': 'text-sea',
  'shichibukai': 'text-fruit',
  'yonko': 'text-luffy',
  'revolutionary': 'text-accent-emerald',
  'baroque-works': 'text-accent-amber',
  'cp9': 'text-accent-silver',
  'supernova': 'text-accent-cyan',
  'beast-pirates': 'text-accent-indigo',
  'big-mom-pirates': 'text-accent-pink',
  'roger-pirates': 'text-gold',
  'whitebeard-pirates': 'text-accent-teal',
  'red-hair-pirates': 'text-accent-rose',
  'ally': 'text-accent-lime',
  'other': 'text-accent-silver',
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(p => !['D.', 'no', 'de'].includes(p))
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

type Props = {
  slug: string
  name: string
  crew?: string
  className?: string
  sizes?: string
}

function CharacterAvatar({ slug, name, crew = 'other', className = 'h-full w-full', sizes = '(max-width: 640px) 100vw, 25vw' }: Props) {
  const img = getCharacterImage(slug)
  const gradient = CREW_GRADIENTS[crew] || CREW_GRADIENTS.other
  const textColor = CREW_TEXT_COLORS[crew] || CREW_TEXT_COLORS.other

  if (img) {
    return (
      <Image
        src={img}
        alt={name}
        fill
        className={`object-cover object-top ${className}`}
        sizes={sizes}
      />
    )
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <span className={`text-2xl font-extrabold ${textColor} opacity-80 select-none`}>
        {getInitials(name)}
      </span>
    </div>
  )
}

export default memo(CharacterAvatar)

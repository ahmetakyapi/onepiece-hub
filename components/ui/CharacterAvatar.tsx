'use client'

import Image from 'next/image'
import { getCharacterImage } from '@/lib/constants/images'

const CREW_GRADIENTS: Record<string, string> = {
  'straw-hat': 'from-gold/40 to-gold-bright/20',
  'marine': 'from-sea/40 to-sea-light/20',
  'shichibukai': 'from-purple-500/40 to-purple-400/20',
  'yonko': 'from-luffy/40 to-gold/20',
  'revolutionary': 'from-emerald-500/40 to-emerald-400/20',
  'baroque-works': 'from-amber-600/40 to-amber-400/20',
  'cp9': 'from-slate-500/40 to-slate-400/20',
  'supernova': 'from-cyan-500/40 to-cyan-400/20',
  'beast-pirates': 'from-violet-600/40 to-violet-400/20',
  'big-mom-pirates': 'from-pink-500/40 to-pink-400/20',
  'roger-pirates': 'from-gold/40 to-amber-500/20',
  'whitebeard-pirates': 'from-sky-500/40 to-sky-400/20',
  'red-hair-pirates': 'from-red-500/40 to-red-400/20',
  'ally': 'from-teal-500/40 to-teal-400/20',
  'other': 'from-gray-500/40 to-gray-400/20',
}

const CREW_TEXT_COLORS: Record<string, string> = {
  'straw-hat': 'text-gold',
  'marine': 'text-sea',
  'shichibukai': 'text-purple-400',
  'yonko': 'text-luffy',
  'revolutionary': 'text-emerald-400',
  'baroque-works': 'text-amber-400',
  'cp9': 'text-slate-300',
  'supernova': 'text-cyan-400',
  'beast-pirates': 'text-violet-400',
  'big-mom-pirates': 'text-pink-400',
  'roger-pirates': 'text-gold',
  'whitebeard-pirates': 'text-sky-400',
  'red-hair-pirates': 'text-red-400',
  'ally': 'text-teal-400',
  'other': 'text-gray-400',
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

export default function CharacterAvatar({ slug, name, crew = 'other', className = 'h-full w-full', sizes = '(max-width: 640px) 100vw, 25vw' }: Props) {
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

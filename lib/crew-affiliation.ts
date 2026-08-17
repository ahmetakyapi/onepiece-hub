import type { LucideIcon } from 'lucide-react'
import { Anchor, Skull, Heart, Flame, Crown, Swords } from 'lucide-react'

export type CrewAffiliationId =
  | 'straw-hat'
  | 'red-hair'
  | 'heart'
  | 'blackbeard'
  | 'whitebeard'
  | 'revolutionary'

export type CrewAffiliation = {
  id: CrewAffiliationId
  name: string
  tagline: string
  icon: LucideIcon
  rgb: string
  bg: string
  border: string
  text: string
}

export const CREW_AFFILIATIONS: CrewAffiliation[] = [
  {
    id: 'straw-hat',
    name: 'Hasır Şapka',
    tagline: 'Özgürlük ve macera',
    icon: Anchor,
    rgb: '244,163,0',
    bg: 'bg-gold/[0.08]',
    border: 'border-gold/30',
    text: 'text-gold',
  },
  {
    id: 'red-hair',
    name: 'Kızıl Saç',
    tagline: 'Güçlü ve adil',
    icon: Flame,
    rgb: '239,68,68',
    bg: 'bg-accent-rose/[0.08]',
    border: 'border-accent-rose/30',
    text: 'text-accent-rose',
  },
  {
    id: 'heart',
    name: 'Heart',
    tagline: 'Cerrah soğukkanlılığı',
    icon: Heart,
    rgb: '244,114,182',
    bg: 'bg-accent-pink/[0.08]',
    border: 'border-accent-pink/30',
    text: 'text-accent-pink',
  },
  {
    id: 'blackbeard',
    name: 'Kara Sakal',
    tagline: 'Gölgelerin hükmü',
    icon: Skull,
    rgb: '148,139,200',
    bg: 'bg-fruit-strong/[0.08]',
    border: 'border-fruit-strong/30',
    text: 'text-fruit',
  },
  {
    id: 'whitebeard',
    name: 'Beyaz Sakal',
    tagline: 'Aile ve onur',
    icon: Crown,
    rgb: '56,189,248',
    bg: 'bg-accent-teal/[0.08]',
    border: 'border-accent-teal/30',
    text: 'text-accent-teal',
  },
  {
    id: 'revolutionary',
    name: 'Devrimciler',
    tagline: 'Zulme karşı savaş',
    icon: Swords,
    rgb: '52,211,153',
    bg: 'bg-accent-emerald/[0.08]',
    border: 'border-accent-emerald/30',
    text: 'text-accent-emerald',
  },
]

const STORAGE_KEY = 'onepiece-crew-affiliation'

export function getStoredAffiliation(): CrewAffiliationId | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  if (CREW_AFFILIATIONS.some((c) => c.id === raw)) return raw as CrewAffiliationId
  return null
}

export function setStoredAffiliation(id: CrewAffiliationId | null) {
  if (typeof window === 'undefined') return
  if (id === null) {
    window.localStorage.removeItem(STORAGE_KEY)
  } else {
    window.localStorage.setItem(STORAGE_KEY, id)
  }
}

export function getAffiliationById(id: string | null | undefined): CrewAffiliation | null {
  if (!id) return null
  return CREW_AFFILIATIONS.find((c) => c.id === id) ?? null
}

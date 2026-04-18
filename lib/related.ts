import { CHARACTERS } from '@/lib/constants/characters'
import { ARCS } from '@/lib/constants/arcs'
import { POWER_LEVELS } from '@/lib/constants/power-levels'
import type { Character, Arc } from '@/types'

/**
 * Karakter için öneri hesaplamaları.
 * Ağırlıklı skor: aynı crew (+5), ortak arc (+2 per), güç tier benzerliği (+3).
 */
export function getRelatedCharacters(slug: string, limit = 6): Character[] {
  const source = CHARACTERS.find(c => c.slug === slug)
  if (!source) return []

  const sourcePower = POWER_LEVELS.find(p => p.slug === slug)
  const sourceAppearances = new Set(source.appearances ?? [])

  const scored = CHARACTERS
    .filter(c => c.slug !== slug)
    .map(c => {
      let score = 0

      if (c.crew === source.crew) score += 5

      const theirAppearances = c.appearances ?? []
      for (const arc of theirAppearances) {
        if (sourceAppearances.has(arc)) score += 2
      }

      if (sourcePower) {
        const theirPower = POWER_LEVELS.find(p => p.slug === c.slug)
        if (theirPower) {
          const diff = Math.abs(sourcePower.overall - theirPower.overall)
          if (diff < 5) score += 3
          else if (diff < 15) score += 1
        }
      }

      return { char: c, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.char)

  return scored
}

/**
 * Arc için öneriler: aynı saga'dan + ortak karakterler çok olan arc'lar.
 */
export function getRelatedArcs(slug: string, limit = 4): Arc[] {
  const source = ARCS.find(a => a.slug === slug)
  if (!source) return []

  const sourceChars = new Set(source.characters ?? [])

  const scored = ARCS
    .filter(a => a.slug !== slug)
    .map(a => {
      let score = 0

      if (a.saga === source.saga) score += 4

      const theirChars = a.characters ?? []
      let shared = 0
      for (const ch of theirChars) if (sourceChars.has(ch)) shared++
      score += Math.min(shared, 8)

      return { arc: a, score, shared }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.arc)

  return scored
}

import type { Arc } from '@/types'
import { EAST_BLUE_ARCS } from './east-blue'
import { ALABASTA_ARCS } from './alabasta'
import { SKY_ISLAND_ARCS } from './sky-island'
import { WATER_7_ARCS } from './water-7'
import { THRILLER_BARK_ARCS } from './thriller-bark'
import { SUMMIT_WAR_ARCS } from './summit-war'
import { FISH_MAN_ISLAND_ARCS } from './fish-man-island'
import { DRESSROSA_ARCS } from './dressrosa'
import { FOUR_EMPERORS_ARCS } from './four-emperors'
import { FINAL_ARCS } from './final'

export const ARCS: Arc[] = [
  ...EAST_BLUE_ARCS,
  ...ALABASTA_ARCS,
  ...SKY_ISLAND_ARCS,
  ...WATER_7_ARCS,
  ...THRILLER_BARK_ARCS,
  ...SUMMIT_WAR_ARCS,
  ...FISH_MAN_ISLAND_ARCS,
  ...DRESSROSA_ARCS,
  ...FOUR_EMPERORS_ARCS,
  ...FINAL_ARCS,
]

export function getArcBySlug(slug: string): Arc | undefined {
  return ARCS.find((arc) => arc.slug === slug)
}

export function getArcsBySaga(sagaSlug: string): Arc[] {
  return ARCS.filter((arc) => arc.saga === sagaSlug)
}

export function getTotalEpisodes(): number {
  return ARCS.reduce((sum, arc) => sum + arc.episodeCount, 0)
}

/**
 * Arc içindeki bölüm numarasını OnePaceTR'nin global bölüm numarasına çevirir.
 * OnePaceTR URL: https://www.onepacetr.net/bolum/{globalNumber}
 */
export function getGlobalEpisodeNumber(arcSlug: string, episodeNumber: number): number {
  let total = 0
  for (const arc of ARCS) {
    if (arc.slug === arcSlug) {
      return total + episodeNumber
    }
    total += arc.episodeCount
  }
  return episodeNumber // fallback
}

// Re-export saga arrays for direct access
export {
  EAST_BLUE_ARCS,
  ALABASTA_ARCS,
  SKY_ISLAND_ARCS,
  WATER_7_ARCS,
  THRILLER_BARK_ARCS,
  SUMMIT_WAR_ARCS,
  FISH_MAN_ISLAND_ARCS,
  DRESSROSA_ARCS,
  FOUR_EMPERORS_ARCS,
  FINAL_ARCS,
}

/**
 * Türetilmiş site istatistikleri — TEK KAYNAK.
 *
 * Sayılar hiçbir yerde elle yazılmaz; hepsi `lib/constants/*` verisinden
 * hesaplanır. Böylece yeni arc/karakter/meyve eklendiğinde ana sayfa, about,
 * metadata ve command palette otomatik güncellenir.
 *
 * Hepsi build-time'da çözülen static veri olduğu için runtime maliyeti yok.
 */
import { ARCS } from './arcs'
import { CHARACTERS } from './characters'
import { DEVIL_FRUITS } from './devil-fruits'
import { BATTLES } from './battles'
import { LOCATIONS } from './locations'
import { CREWS } from './crews'
import { QUIZZES } from './quizzes'
import { BOUNTIES } from './bounties'
import { SAGAS } from './sagas'
import { ACHIEVEMENTS } from './achievements'

/** "28:26" → 1706 saniye. Geçersiz format 0 döner. */
function durationToSeconds(duration: string): number {
  const parts = duration.split(':')
  if (parts.length !== 2) return 0
  const minutes = Number(parts[0])
  const seconds = Number(parts[1])
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0
  return minutes * 60 + seconds
}

const totalEpisodes = ARCS.reduce((sum, arc) => sum + arc.episodeCount, 0)

const totalRuntimeSeconds = ARCS.reduce(
  (sum, arc) => sum + arc.episodes.reduce((s, ep) => s + durationToSeconds(ep.duration), 0),
  0,
)

const totalQuizQuestions = QUIZZES.reduce((sum, quiz) => sum + quiz.questions.length, 0)

export const SITE_STATS = {
  sagas: SAGAS.length,
  arcs: ARCS.length,
  episodes: totalEpisodes,
  characters: CHARACTERS.length,
  devilFruits: DEVIL_FRUITS.length,
  battles: BATTLES.length,
  locations: LOCATIONS.length,
  crews: CREWS.length,
  bounties: BOUNTIES.length,
  quizzes: QUIZZES.length,
  quizQuestions: totalQuizQuestions,
  achievements: ACHIEVEMENTS.length,
  /** Tüm bölümlerin toplam süresi — saniye */
  runtimeSeconds: totalRuntimeSeconds,
  /** Aşağı yuvarlanmış toplam saat — "212 saat" gibi gösterim için */
  runtimeHours: Math.floor(totalRuntimeSeconds / 3600),
  /** Ortalama bölüm süresi — dakika */
  avgEpisodeMinutes: Math.round(totalRuntimeSeconds / totalEpisodes / 60),
} as const

/** "212 saat 14 dk" */
export function formatRuntime(seconds = SITE_STATS.runtimeSeconds): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return minutes > 0 ? `${hours} saat ${minutes} dk` : `${hours} saat`
}

/** Bir arc'ın toplam süresi — saniye */
export function getArcRuntimeSeconds(arcSlug: string): number {
  const arc = ARCS.find((a) => a.slug === arcSlug)
  if (!arc) return 0
  return arc.episodes.reduce((s, ep) => s + durationToSeconds(ep.duration), 0)
}

export { durationToSeconds }

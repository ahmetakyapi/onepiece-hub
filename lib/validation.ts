/**
 * API girdi doğrulama — statik veriye karşı slug kontrolü.
 *
 * ── Neden ─────────────────────────────────────────────────────────────────
 * Giriş yapmış bir kullanıcı `/api/progress`, `/api/favorites` gibi
 * endpoint'lere rastgele slug gönderip DB'ye sınırsız çöp satır yazabiliyordu.
 * Slug'lar `lib/constants/*`'ten geldiği için doğrulanmaları ücretsiz:
 * Set'ler modül yüklenirken bir kez kuruluyor, kontrol O(1).
 */
import { ARCS } from './constants/arcs'
import { CHARACTERS } from './constants/characters'
import { DEVIL_FRUITS } from './constants/devil-fruits'
import { CREWS } from './constants/crews'
import { BATTLES } from './constants/battles'
import { QUIZZES } from './constants/quizzes'

/* ─── Lookup tabloları — modül başına bir kez ──────────────────────────── */

const ARC_SLUGS = new Set(ARCS.map((arc) => arc.slug))

/** episodeSlug → arcSlug. Bölümün hangi arc'a ait olduğunu da doğrular. */
const EPISODE_TO_ARC = new Map<string, string>(
  ARCS.flatMap((arc) => arc.episodes.map((ep) => [ep.slug, arc.slug] as const)),
)

const CHARACTER_SLUGS = new Set(CHARACTERS.map((c) => c.slug))
const DEVIL_FRUIT_SLUGS = new Set(DEVIL_FRUITS.map((f) => f.slug))
const CREW_SLUGS = new Set(CREWS.map((c) => c.slug))
const BATTLE_SLUGS = new Set(BATTLES.map((b) => b.slug))

/** arcSlug → o quiz'deki gerçek soru sayısı */
const QUIZ_QUESTION_COUNT = new Map<string, number>(
  QUIZZES.map((quiz) => [quiz.arcSlug, quiz.questions.length] as const),
)

/* ─── Arc / bölüm ──────────────────────────────────────────────────────── */

export function isValidArcSlug(slug: string): boolean {
  return ARC_SLUGS.has(slug)
}

/** Bölüm slug'ından arc slug'ı — bilinmeyen bölüm için null */
export function resolveArcSlug(episodeSlug: string): string | null {
  return EPISODE_TO_ARC.get(episodeSlug) ?? null
}

/**
 * İzleme kaydı girdisini doğrula.
 *
 * İstemcinin gönderdiği `arcSlug`'a güvenmez — bölümün gerçekte ait olduğu
 * arc'ı döner. Böylece bölüm doğru arc altında sayılır.
 */
export function resolveWatchTarget(
  episodeSlug: unknown,
): { episodeSlug: string; arcSlug: string } | null {
  if (typeof episodeSlug !== 'string') return null
  const arcSlug = resolveArcSlug(episodeSlug)
  return arcSlug ? { episodeSlug, arcSlug } : null
}

/* ─── Yorum / favori hedefleri ─────────────────────────────────────────── */

export const COMMENT_TARGET_TYPES = ['arc', 'character', 'devil-fruit', 'crew', 'episode', 'battle'] as const
export const FAVORITE_TARGET_TYPES = ['arc', 'character', 'devil-fruit', 'crew'] as const

export type CommentTargetType = (typeof COMMENT_TARGET_TYPES)[number]
export type FavoriteTargetType = (typeof FAVORITE_TARGET_TYPES)[number]

const TARGET_SLUG_SETS: Record<CommentTargetType, Set<string> | 'episode'> = {
  arc: ARC_SLUGS,
  character: CHARACTER_SLUGS,
  'devil-fruit': DEVIL_FRUIT_SLUGS,
  crew: CREW_SLUGS,
  battle: BATTLE_SLUGS,
  episode: 'episode',
}

/** targetType + targetSlug ikilisinin gerçek bir içeriğe işaret ettiğini doğrula */
export function isValidTarget(targetType: string, targetSlug: string): boolean {
  const set = TARGET_SLUG_SETS[targetType as CommentTargetType]
  if (!set) return false
  if (set === 'episode') return EPISODE_TO_ARC.has(targetSlug)
  return set.has(targetSlug)
}

/* ─── Quiz ─────────────────────────────────────────────────────────────── */

/** Quiz'in gerçek soru sayısı — arc'ta quiz yoksa null */
export function getQuizQuestionCount(arcSlug: string): number | null {
  return QUIZ_QUESTION_COUNT.get(arcSlug) ?? null
}

/* ─── Kullanıcı adı ────────────────────────────────────────────────────── */

export const USERNAME_MIN = 3
export const USERNAME_MAX = 20

/**
 * Kullanıcı adı kuralları: harf, rakam, alt çizgi ve tire. Türkçe karakter
 * kabul edilmez — büyük/küçük harf katlaması (İ/ı) ve görsel benzerlik
 * kaynaklı taklit riskini kapatır.
 */
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/

/** Baştaki/sondaki boşluğu at — depolama ve karşılaştırma bunun üzerinden */
export function normalizeUsername(raw: string): string {
  return raw.trim()
}

/** Büyük/küçük harf duyarsız karşılaştırma anahtarı */
export function usernameKey(raw: string): string {
  return normalizeUsername(raw).toLowerCase()
}

/** Geçerliyse null, değilse Türkçe hata mesajı döner */
export function validateUsername(raw: string): string | null {
  const username = normalizeUsername(raw)
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Kullanıcı adı ${USERNAME_MIN}-${USERNAME_MAX} karakter olmalı`
  }
  if (!USERNAME_PATTERN.test(username)) {
    return 'Kullanıcı adı yalnızca harf, rakam, _ ve - içerebilir'
  }
  return null
}

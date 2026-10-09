/* Hareket sistemi — paylaşılan sabitler ve küçük, bağımlılıksız yardımcılar.

   `lib/variants.ts` Framer Motion varyantlarını taşır; burası onların
   ÜSTÜNDEKİ orkestrasyon katmanı: açılış sekansının bitişi, rota perdesi
   olayları, hedef rota etiketleri. Düz modül — hem client hem server
   bileşenlerinden import edilebilir. */

import { MAIN_LINKS, WIKI_LINKS } from '@/lib/constants/navigation'

/* ── Eğriler ─────────────────────────────────────────────────────────────
   EASE (`lib/variants.ts`) genel amaçlı. Perde ve maske açılışları için
   daha "ağır" bir eğri gerekiyor: başta yavaş toplanıp sert çıkan, sonra
   uzun bir kuyrukla oturan — ödüllü sitelerin imza hissi bu. */
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

/* ── Olay adları ─────────────────────────────────────────────────────── */
export const INTRO_DONE_EVENT = 'onepiece:intro-done'
/** `window.dispatchEvent(new CustomEvent(CURTAIN_NAVIGATE_EVENT, { detail: href }))`
 *  — programatik gezinmeyi (router.push yerine) perdeyle yapmak için. */
export const CURTAIN_NAVIGATE_EVENT = 'onepiece:curtain-navigate'

/* ── Açılış sekansı durumu ───────────────────────────────────────────────
   Hero animasyonları preloader'ın ARKASINDA oynayıp bitmesin diye,
   bekleyen bileşenler `useIntroReady()` (hooks/useIntroReady.ts) ile buraya
   abone olur. */
let introDone: boolean | null = null
const listeners = new Set<() => void>()

export function isIntroDone(): boolean {
  if (introDone === null) {
    introDone = typeof document === 'undefined'
      ? false
      : !document.documentElement.hasAttribute('data-intro')
  }
  return introDone
}

export function markIntroDone() {
  if (introDone === true) return
  introDone = true
  listeners.forEach((fn) => fn())
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(INTRO_DONE_EVENT))
}

export function subscribeIntro(fn: () => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/* ── Rota etiketleri ─────────────────────────────────────────────────────
   Perde kapanırken ortada hedefin adı yazar ("KARAKTERLER"). Statik rotalar
   navigasyon sabitlerinden gelir; dinamik segment (slug) okunur biçime
   çevrilir — karakter/arc listesini bu modüle import etmek her sayfanın
   paketine yüzlerce kayıt eklerdi. */
const STATIC_LABELS: Record<string, string> = {
  '/': 'Ana Sayfa',
  '/login': 'Giriş',
  '/profile': 'Profil',
  '/quiz': 'Quiz',
  '/achievements': 'Başarımlar',
  '/about': 'Hakkında',
  '/wanted-poster': 'Wanted Poster',
  '/power-ranking': 'Güç Sıralaması',
  ...Object.fromEntries(MAIN_LINKS.map((l) => [l.href, l.label])),
  ...Object.fromEntries(WIKI_LINKS.map((l) => [l.href, l.label])),
}

function humanizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
    .join(' ')
}

export type RouteLabel = { eyebrow: string; title: string }

export function getRouteLabel(pathname: string): RouteLabel {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (STATIC_LABELS[clean]) return { eyebrow: 'Rota', title: STATIC_LABELS[clean] }

  const segments = clean.split('/').filter(Boolean)
  const parent = `/${segments[0]}`
  const parentLabel = STATIC_LABELS[parent] ?? humanizeSlug(segments[0])

  // /arcs/<arc>/<bölüm> → "Arlong Park · Bölüm"
  if (segments[0] === 'arcs' && segments.length >= 3) {
    return { eyebrow: humanizeSlug(segments[1]), title: 'Bölüm Başlıyor' }
  }
  return { eyebrow: parentLabel, title: humanizeSlug(segments[segments.length - 1]) }
}

/** Bölümden bölüme geçişte perde OYNAMAZ: izleme akışını bölmesin, ve
 *  oynatıcının kalıcı iframe'i zaten aynı sayfada kalıyor. */
export function isEpisodePath(pathname: string): boolean {
  return /^\/arcs\/[^/]+\/[^/]+\/?$/.test(pathname)
}

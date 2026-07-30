/**
 * Video oynatıcı yapılandırması.
 *
 * ── Neden bu dosya var ────────────────────────────────────────────────────
 * Bölümler OnePaceTR'nin kendi sayfası iframe içine gömülerek oynatılıyor.
 * OnePaceTR bir SPA ve API'si token korumalı, yani video elementine doğrudan
 * erişemiyoruz. Bu yüzden iframe, sayfanın *video alanına* kırpılıyor:
 * iframe büyütülüp negatif offset'lerle kaydırılıyor.
 *
 * Bu geometri OnePaceTR'nin sayfa yapısına bağlı — site tasarımı değişirse
 * bozulur. Eskiden bu değerler component içinde magic number'dı; artık:
 *   1. burada isimli sabitler,
 *   2. kullanıcı tarafından UI'dan kalibre edilebilir (localStorage),
 *   3. `full` embed moduna düşülebilir (kırpma yok, garantili çalışır).
 * Yani geometri bozulsa bile oynatıcı kullanılamaz hale gelmiyor.
 */

export const PLAYER_SOURCE = {
  name: 'OnePaceTR',
  baseUrl: 'https://www.onepacetr.net',
  /** Global bölüm numarası ile bölüm sayfası URL'i */
  episodeUrl: (globalEpisodeNumber: number) =>
    `https://www.onepacetr.net/bolum/${globalEpisodeNumber}`,
} as const

/** iframe'i OnePaceTR sayfasının video alanına kırpan geometri — yüzde cinsinden */
export type EmbedGeometry = {
  /** iframe genişliği (%) — 100 = kırpma yok */
  width: number
  /** iframe yüksekliği (%) */
  height: number
  /** yatay kaydırma (%) */
  offsetX: number
  /** dikey kaydırma (%) */
  offsetY: number
}

export const DEFAULT_GEOMETRY: EmbedGeometry = {
  width: 200,
  height: 255,
  offsetX: -55,
  offsetY: -38,
}

/**
 * Sahne kutusunun en-boy oranı.
 *
 * ⚠️ DEFAULT_GEOMETRY bu orana kalibre edildi. iframe'in *kendi* layout
 * viewport'u kutu oranına bağlı olduğu için oranı değiştirmek OnePaceTR'nin
 * responsive yerleşimini değiştirir ve kadraj kayar. Oranı değiştirirsen
 * geometriyi de yeniden kalibre et.
 *
 * Aynı oran inline / sinema / mini modların hepsinde kullanılır — eski kodda
 * sinema modu 16/9 kullanıyordu ve bu yüzden kadraj inline moddan farklıydı.
 */
export const STAGE_ASPECT_RATIO = '16 / 11' as const

/** Kalibrasyon panelinin izin verdiği aralıklar */
export const GEOMETRY_LIMITS = {
  width: { min: 100, max: 400, step: 5 },
  height: { min: 100, max: 500, step: 5 },
  offsetX: { min: -200, max: 50, step: 1 },
  offsetY: { min: -200, max: 50, step: 1 },
} as const

export const PLAYER_TIMINGS = {
  /** Bu süre içinde iframe `load` vermezse "yüklenemedi" durumuna geçilir */
  loadTimeoutMs: 15_000,
  /** Bölüm bitişinden kaç saniye önce "sıradaki bölüm" kartı çıksın */
  upNextLeadSeconds: 40,
  /** Otomatik geçiş geri sayımı */
  upNextCountdownSeconds: 20,
  /** Mini oynatıcı, sahne bu oranda görünmez olunca devreye girer */
  miniPlayerVisibilityThreshold: 0.15,
} as const

/** Klavye kısayolları — hem handler hem yardım paneli bu listeden beslenir */
export const PLAYER_SHORTCUTS = [
  { keys: ['→', 'N'], label: 'Sonraki bölüm' },
  { keys: ['←', 'P'], label: 'Önceki bölüm' },
  { keys: ['F'], label: 'Sinema modu' },
  { keys: ['T'], label: 'Mini oynatıcı' },
  { keys: ['W'], label: 'İzlendi işaretle' },
  { keys: ['U'], label: 'Sıradaki izlenmemiş bölüm' },
  { keys: ['R'], label: 'Oynatıcıyı yenile' },
  { keys: ['Esc'], label: 'Moddan çık' },
  { keys: ['?'], label: 'Bu yardım' },
] as const

export const PLAYER_STORAGE_KEYS = {
  prefs: 'onepiece-player-prefs',
  lastWatched: 'onepiece-last-watched',
} as const

/** "28:26" → 1706 saniye */
export function parseDurationSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(':')
  const m = Number(minutes)
  const s = Number(seconds)
  if (!Number.isFinite(m) || !Number.isFinite(s)) return 0
  return m * 60 + s
}

/** 1706 → "28:26" */
export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.round(total))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Serinin canlı durumu — manga, anime ve One Pace ilerlemesi.
 *
 * ⚠️ ELLE GÜNCELLENİR. Yeni bölüm/chapter çıktığında sadece bu dosyayı
 * güncelle; ana sayfa, arc listesi ve footer otomatik yansıtır.
 *
 * `asOf` alanı UI'da "son güncelleme" olarak gösterilir — güncellemeyi
 * unutursan site bunu dürüstçe belli eder, yanlış "canlı" iddiası yapmaz.
 */

export type SeriesTrack = {
  /** Kısa etiket — "Manga", "Anime", "One Pace" */
  label: string
  /** Şu an nerede olduğumuz — "Bölüm 1189" */
  current: string
  /** Bağlam satırı — "Elbaf Arc · Final Saga" */
  context: string
  /** Sıradaki çıkış tarihi — ISO 8601. Bilinmiyorsa undefined. */
  nextReleaseISO?: string
  /** Sıradaki içeriğin adı — "Bölüm 1190" */
  next?: string
  /** Ek not — ara/hiatus bilgisi gibi */
  note?: string
  status: 'ongoing' | 'break' | 'caught-up'
}

/** Bu verinin doğrulandığı tarih — ISO 8601 */
export const STATUS_AS_OF = '2026-07-30' as const

export const SERIES_STATUS = {
  /** Final Saga içindeki mevcut arc — manga tarafı */
  currentArcName: 'Elbaf',
  currentSagaName: 'Final Saga',

  manga: {
    label: 'Manga',
    current: 'Bölüm 1189',
    context: 'Elbaf Arc · Final Saga',
    next: 'Bölüm 1190',
    nextReleaseISO: '2026-08-09',
    note: '3 Ağustos Oda arası, 17 Ağustos Shonen Jump arası',
    status: 'ongoing',
  },

  anime: {
    label: 'Anime',
    current: 'Bölüm 1171',
    context: 'Elbaf Arc · 2. cour',
    next: 'Bölüm 1172',
    nextReleaseISO: '2026-08-02',
    note: 'Elbaf arc 26 bölüm, iki cour halinde yayınlanıyor',
    status: 'ongoing',
  },

  /**
   * One Pace = bu sitenin izleme kaynağı. Egghead'e kadar paced sürüm var;
   * Elbaf henüz One Pace formatına dönüştürülmedi.
   */
  onePace: {
    label: 'One Pace',
    current: 'Egghead Arc tamamlandı',
    context: '36 arc · filler\'sız',
    note: 'Elbaf arc henüz One Pace formatında yayınlanmadı',
    status: 'caught-up',
  },
} as const satisfies { currentArcName: string; currentSagaName: string } & Record<
  'manga' | 'anime' | 'onePace',
  SeriesTrack
>

export const SERIES_TRACKS: readonly SeriesTrack[] = [
  SERIES_STATUS.onePace,
  SERIES_STATUS.anime,
  SERIES_STATUS.manga,
] as const

/**
 * Sitedeki izlenebilir içeriğin serinin neresine denk geldiği.
 * Anime bölüm numarası bazlı kaba bir oran — "ne kadar gerideyiz" göstergesi.
 */
export const WATCHABLE_THROUGH = {
  arcName: 'Egghead',
  arcSlug: 'egghead',
  sagaName: 'Final Saga',
} as const

/** "3 gün önce" / "bugün" — STATUS_AS_OF için insan-okur tazelik etiketi */
export function getStatusFreshness(asOf: string = STATUS_AS_OF): string {
  const then = new Date(`${asOf}T00:00:00Z`).getTime()
  const now = Date.now()
  const days = Math.floor((now - then) / 86_400_000)
  if (days <= 0) return 'bugün güncellendi'
  if (days === 1) return 'dün güncellendi'
  if (days < 7) return `${days} gün önce güncellendi`
  if (days < 30) return `${Math.floor(days / 7)} hafta önce güncellendi`
  return `${Math.floor(days / 30)} ay önce güncellendi`
}

/** Sıradaki çıkışa kalan gün — geçmişse null */
export function getDaysUntil(iso?: string): number | null {
  if (!iso) return null
  const target = new Date(`${iso}T00:00:00Z`).getTime()
  const days = Math.ceil((target - Date.now()) / 86_400_000)
  return days >= 0 ? days : null
}

'use client'

import Image from 'next/image'
import { AlertTriangle, ExternalLink, Loader2, Play, RotateCcw, Crop } from 'lucide-react'
import { PLAYER_SOURCE, type EmbedGeometry } from '@/lib/player-config'
import type { EmbedMode } from '@/hooks/usePlayerPrefs'

export type StageLoadState = 'loading' | 'ready' | 'failed'

type Props = {
  /** iframe src — global bölüm numarasından üretilmiş OnePaceTR bölüm URL'i */
  src: string
  /** Değiştiğinde iframe kasıtlı olarak remount edilir (yenile butonu) */
  reloadKey: number
  loadState: StageLoadState
  onLoad: () => void
  onRetry: () => void
  embedMode: EmbedMode
  geometry: EmbedGeometry
  /** Kalibrasyon paneli açıkken kırpma sınırlarını göster */
  showGeometryGuides?: boolean
  onUseFullEmbed: () => void
  /** Yüklenirken arkada gösterilecek arc kapağı */
  cover: string
  episodeTitle: string
  arcName: string
  globalEpisode: number
}

/**
 * Kalıcı video sahnesi.
 *
 * ⚠️ Bu bileşen **asla remount edilmemeli** — remount iframe'i yeniden
 * yükler ve oynatma baştan başlar. Sinema/mini moda geçiş, bu bileşeni
 * saran div'in `className`'ini değiştirerek yapılır; React ağacındaki yeri
 * sabit kalır.
 *
 * ⚠️ Sahneyi saran hiçbir ata elemanda `transform` / `filter` / `contain`
 * olmamalı — bunlar `position: fixed` için containing block oluşturur ve
 * sinema/mini modu bozar. Bu yüzden WatchPage'de oynatıcı kolonu Framer
 * Motion ile sarılmıyor (motion `y` animasyonu transform bırakır).
 */
export default function VideoStage({
  src,
  reloadKey,
  loadState,
  onLoad,
  onRetry,
  embedMode,
  geometry,
  showGeometryGuides = false,
  onUseFullEmbed,
  cover,
  episodeTitle,
  arcName,
  globalEpisode,
}: Props) {
  const zoomed = embedMode === 'zoom'

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050b14]">
      {/* ── Yükleme arkaplanı: bulanık arc kapağı ─────────────────────── */}
      {loadState !== 'ready' && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={cover}
            alt=""
            fill
            className="scale-110 object-cover opacity-25 blur-2xl"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/70 to-[#050b14]/40" />
        </div>
      )}

      {/* ── iframe ────────────────────────────────────────────────────── */}
      {loadState !== 'failed' && (
        <iframe
          key={reloadKey}
          src={src}
          title={`${episodeTitle} — ${arcName} (Bölüm ${globalEpisode}) · ${PLAYER_SOURCE.name} oynatıcı`}
          onLoad={onLoad}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className={`absolute border-0 transition-opacity duration-500 ${
            loadState === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
          style={
            zoomed
              ? {
                  width: `${geometry.width}%`,
                  height: `${geometry.height}%`,
                  left: `${geometry.offsetX}%`,
                  top: `${geometry.offsetY}%`,
                }
              : { inset: 0, width: '100%', height: '100%' }
          }
        />
      )}

      {/* ── Kalibrasyon kılavuzu ──────────────────────────────────────── */}
      {showGeometryGuides && zoomed && loadState === 'ready' && (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          <div className="absolute inset-0 border-2 border-dashed border-gold/50" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold/25" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold/25" />
          <span className="absolute left-2 top-2 rounded bg-ocean-deep/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
            <Crop className="mr-1 inline h-3 w-3" />
            Kırpma alanı
          </span>
        </div>
      )}

      {/* ── Yükleniyor ────────────────────────────────────────────────── */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-gold/20" />
            <span className="absolute inset-0 animate-ping rounded-full border border-gold/20" />
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
          <p className="text-sm font-bold text-pirate-text">Bölüm yükleniyor</p>
          <p className="max-w-xs text-xs leading-relaxed text-pirate-muted">
            {arcName} · Bölüm {globalEpisode} — video {PLAYER_SOURCE.name} üzerinden geliyor.
          </p>
        </div>
      )}

      {/* ── Yüklenemedi ───────────────────────────────────────────────── */}
      {loadState === 'failed' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-luffy/25 bg-luffy/[0.08]">
            <AlertTriangle className="h-7 w-7 text-luffy" />
          </div>
          <div>
            <p className="text-sm font-bold text-pirate-text">Oynatıcı yüklenemedi</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-pirate-muted">
              {PLAYER_SOURCE.name} yanıt vermedi. Bağlantını kontrol edip tekrar
              deneyebilir, kırpmasız moda geçebilir veya bölümü kaynağında açabilirsin.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={onRetry} className="btn-gold !px-4 !py-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Tekrar dene
            </button>
            <button onClick={onUseFullEmbed} className="btn-ghost !px-4 !py-2 text-xs">
              <Crop className="h-3.5 w-3.5" />
              Kırpmasız aç
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              <Play className="h-3.5 w-3.5" />
              {PLAYER_SOURCE.name}
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>
      )}

      {/* İnce iç kenar — cam kenar hissi */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
    </div>
  )
}

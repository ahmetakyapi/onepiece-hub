'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, Eye, ExternalLink,
  Keyboard, Maximize2, Minimize2, PictureInPicture2, RotateCcw, Settings2,
  Shrink, Sparkles, X,
} from 'lucide-react'
import { EASE, fadeUp } from '@/lib/variants'
import { getGlobalEpisodeNumber } from '@/lib/constants/arcs'
import { useWatchedEpisodes } from '@/hooks/useWatchedEpisodes'
import { usePlayerPrefs } from '@/hooks/usePlayerPrefs'
import { useEpisodeTimer } from '@/hooks/useEpisodeTimer'
import { recordLastWatched } from '@/hooks/useLastWatched'
import {
  PLAYER_SOURCE, PLAYER_TIMINGS, STAGE_ASPECT_RATIO, formatSeconds,
} from '@/lib/player-config'
import VideoStage, { type StageLoadState } from './VideoStage'
import EpisodeRail from './EpisodeRail'
import PlayerSettings from './PlayerSettings'
import ShortcutsDialog from './ShortcutsDialog'
import UpNextCard from './UpNextCard'
import type { Arc, Episode } from '@/types'

type ArcLink = { name: string; slug: string; firstEpisodeSlug?: string }

type Props = {
  arc: Arc
  episode: Episode
  prevEpisode: Episode | null
  nextEpisode: Episode | null
  prevArc: ArcLink | null
  nextArc: ArcLink | null
}

/** Oynatıcının yerleşim modu — üçü de AYNI iframe'i kullanır (bkz. VideoStage) */
type StageMode = 'inline' | 'cinema' | 'mini'

/** Kısayolların yazı alanlarını ele geçirmesini engelle */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export default function WatchPageClient({
  arc,
  episode,
  prevEpisode,
  nextEpisode,
  prevArc,
  nextArc,
}: Props) {
  const router = useRouter()
  const globalEp = getGlobalEpisodeNumber(arc.slug, episode.number)
  const sourceUrl = PLAYER_SOURCE.episodeUrl(globalEp)

  const { isWatched, toggle, markWatched, watchedCount, loaded } = useWatchedEpisodes()
  const { prefs, hydrated, update, updateGeometry, resetGeometry } = usePlayerPrefs()

  const [mode, setMode] = useState<StageMode>('inline')
  const [loadState, setLoadState] = useState<StageLoadState>('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [miniDismissed, setMiniDismissed] = useState(false)
  const [upNextDismissed, setUpNextDismissed] = useState(false)

  const anchorRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cinemaCloseRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const allSlugs = useMemo(() => arc.episodes.map((ep) => ep.slug), [arc.episodes])
  const watched = watchedCount(allSlugs)
  const currentIsWatched = isWatched(episode.slug)

  const nextUnwatched = useMemo(
    () => arc.episodes.find((ep) => !isWatched(ep.slug)) ?? null,
    [arc.episodes, isWatched],
  )

  const globalNumberOf = useCallback(
    (episodeNumber: number) => getGlobalEpisodeNumber(arc.slug, episodeNumber),
    [arc.slug],
  )

  /* ── Bölüm değişince oynatıcıyı sıfırla ─────────────────────────────── */
  useEffect(() => {
    setLoadState('loading')
    setUpNextDismissed(false)
    setMiniDismissed(false)
  }, [episode.slug])

  /* ── Yükleme zaman aşımı ────────────────────────────────────────────────
     Cross-origin iframe'lerde `onError` pratikte hiç tetiklenmez (eski kodda
     hata durumu bu yüzden ölü koddu). `onLoad` gelmezse zaman aşımıyla
     hata durumuna geçiyoruz. */
  useEffect(() => {
    if (loadState !== 'loading') return
    const timer = window.setTimeout(
      () => setLoadState('failed'),
      PLAYER_TIMINGS.loadTimeoutMs,
    )
    return () => window.clearTimeout(timer)
  }, [loadState, reloadKey, episode.slug])

  /* ── İzleme kaydı ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (loaded) markWatched(episode.slug, arc.slug)
  }, [episode.slug, arc.slug, loaded, markWatched])

  useEffect(() => {
    recordLastWatched({
      arcSlug: arc.slug,
      arcName: arc.name,
      episodeSlug: episode.slug,
      episodeTitle: episode.title,
      episodeNumber: episode.number,
      episodeCount: arc.episodeCount,
      globalEpisode: globalEp,
      cover: arc.cover,
    })
  }, [arc.slug, arc.name, arc.cover, arc.episodeCount, episode.slug, episode.title, episode.number, globalEp])

  /* ── Sıradaki bölüm sayacı ──────────────────────────────────────────── */
  const { remaining } = useEpisodeTimer(episode.slug, episode.duration, loadState === 'ready')

  const upNextVisible =
    !!nextEpisode &&
    !upNextDismissed &&
    remaining !== null &&
    remaining <= PLAYER_TIMINGS.upNextLeadSeconds

  const autoCountdown =
    prefs.autoAdvance && upNextVisible && remaining !== null &&
    remaining <= PLAYER_TIMINGS.upNextCountdownSeconds
      ? remaining
      : null

  const goToNext = useCallback(() => {
    if (nextEpisode) router.push(`/arcs/${arc.slug}/${nextEpisode.slug}`)
    else if (nextArc?.firstEpisodeSlug) router.push(`/arcs/${nextArc.slug}/${nextArc.firstEpisodeSlug}`)
  }, [nextEpisode, nextArc, arc.slug, router])

  const goToPrev = useCallback(() => {
    if (prevEpisode) router.push(`/arcs/${arc.slug}/${prevEpisode.slug}`)
  }, [prevEpisode, arc.slug, router])

  // Otomatik geçiş — geri sayım bittiğinde
  useEffect(() => {
    if (autoCountdown === 0) goToNext()
  }, [autoCountdown, goToNext])

  /* ── Mini oynatıcı: sahne ekrandan çıkınca köşeye dock et ───────────── */
  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor || !prefs.miniPlayer || miniDismissed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMode((current) => {
          if (current === 'cinema') return current
          if (!entry.isIntersecting) return 'mini'
          return 'inline'
        })
      },
      { threshold: PLAYER_TIMINGS.miniPlayerVisibilityThreshold },
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [prefs.miniPlayer, miniDismissed])

  // Mini kapatıldığında / tercih kapatıldığında inline'a dön
  useEffect(() => {
    if ((!prefs.miniPlayer || miniDismissed) && mode === 'mini') setMode('inline')
  }, [prefs.miniPlayer, miniDismissed, mode])

  /* ── Sinema modu: scroll kilidi + odak yönetimi ─────────────────────── */
  useEffect(() => {
    if (mode !== 'cinema') return
    lastFocused.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    cinemaCloseRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      lastFocused.current?.focus()
    }
  }, [mode])

  /* ── Tam ekran ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void stage.requestFullscreen?.().catch(() => {
        // tarayıcı reddetti — sinema moduna düş
        setMode('cinema')
      })
    }
  }, [])

  const reloadPlayer = useCallback(() => {
    setLoadState('loading')
    setReloadKey((k) => k + 1)
  }, [])

  /* ── Klavye kısayolları ─────────────────────────────────────────────────
     iframe odaklıyken tarayıcı olayları iframe'e gider, bize gelmez —
     yani video ile etkileşimdeyken kısayollar kullanıcıyı engellemez. */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      switch (e.key) {
        case 'Escape':
          if (shortcutsOpen) setShortcutsOpen(false)
          else if (settingsOpen) setSettingsOpen(false)
          else if (mode !== 'inline') setMode('inline')
          return
        case 'ArrowRight':
        case 'n':
        case 'N':
          if (nextEpisode || nextArc) { e.preventDefault(); goToNext() }
          return
        case 'ArrowLeft':
        case 'p':
        case 'P':
          if (prevEpisode) { e.preventDefault(); goToPrev() }
          return
        case 'f':
        case 'F':
          e.preventDefault()
          setMode((m) => (m === 'cinema' ? 'inline' : 'cinema'))
          return
        case 't':
        case 'T':
          e.preventDefault()
          setMode((m) => (m === 'mini' ? 'inline' : 'mini'))
          return
        case 'w':
        case 'W':
          e.preventDefault()
          toggle(episode.slug, arc.slug)
          return
        case 'u':
        case 'U':
          if (nextUnwatched && nextUnwatched.slug !== episode.slug) {
            e.preventDefault()
            router.push(`/arcs/${arc.slug}/${nextUnwatched.slug}`)
          }
          return
        case 'r':
        case 'R':
          e.preventDefault()
          reloadPlayer()
          return
        case '?':
          e.preventDefault()
          setShortcutsOpen((v) => !v)
          return
        default:
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [
    mode, shortcutsOpen, settingsOpen, nextEpisode, prevEpisode, nextArc, nextUnwatched,
    episode.slug, arc.slug, goToNext, goToPrev, toggle, router, reloadPlayer,
  ])

  /* ── Sahne yerleşimi ──────────────────────────────────────────────────
     Tek iframe, üç yerleşim. Sadece className/style değişiyor; bileşen
     ağaçtaki yerini korduğu için iframe remount edilmez ve oynatma sürer. */
  const detached = mode !== 'inline'
  const stageClassName =
    mode === 'inline'
      ? 'absolute inset-0 overflow-hidden rounded-xl border border-pirate-border/60 bg-ocean-deep shadow-[0_24px_60px_-20px_rgba(2,6,23,0.8)] sm:rounded-2xl'
      : mode === 'cinema'
        /* Genişlik hem viewport genişliğine hem yüksekliğine göre sınırlanır —
           böylece aspectRatio hiçbir zaman max-height ile çatışmaz. */
        ? 'fixed left-1/2 top-1/2 z-[260] w-[min(96vw,calc(86vh*16/11),1500px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gold/20 bg-ocean-deep shadow-[0_0_140px_rgba(244,163,0,0.14)]'
        : 'fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-3 z-[180] w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-gold/20 bg-ocean-deep shadow-[0_20px_50px_-10px_rgba(2,6,23,0.9)] md:bottom-5 md:right-5'

  const stageStyle = { aspectRatio: STAGE_ASPECT_RATIO } as const

  return (
    <main className="relative min-h-screen pb-16 pt-24 sm:pt-28">
      {/* ── Ambiyans: arc kapağından yayılan ışık ─────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden"
      >
        <Image
          src={arc.cover}
          alt=""
          fill
          className="scale-125 object-cover opacity-[0.14] blur-3xl"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-ocean-deep/80 to-ocean-deep" />
      </div>

      <div className="relative z-10 mx-auto max-w-[105rem] px-3 sm:px-5 lg:px-8">
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav
          aria-label="Konum"
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]"
        >
          <Link
            href={`/arcs/${arc.slug}`}
            className="inline-flex items-center gap-1.5 font-medium text-pirate-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {arc.name}
          </Link>
          <span className="text-pirate-muted/30">•</span>
          <span className="stat-number text-pirate-muted">
            {watched}/{arc.episodeCount} izlendi
          </span>
          <span className="text-pirate-muted/30">•</span>
          <span className="text-pirate-muted/70">{arc.saga}</span>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          {/*
            ⚠️ Bu kolon Framer Motion ile SARILMAMALI. motion `y` animasyonu
            elemanda `transform` bırakır, transform ise `position: fixed` için
            containing block oluşturur ve sinema/mini modu bozar.
          */}
          <div className="min-w-0">
            {/* ── Bölüm başlığı ────────────────────────────────────── */}
            <header className="mb-3">
              <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/[0.08] px-2.5 py-0.5 text-[11px] font-bold text-sea">
                  Bölüm {globalEp}
                </span>
                <span className="stat-number text-[11px] text-pirate-muted/60">
                  {arc.name} {episode.number}/{arc.episodeCount}
                </span>
                <span className="text-pirate-muted/30">•</span>
                <span className="stat-number text-[11px] text-pirate-muted/60">
                  {episode.duration}
                </span>
                {currentIsWatched && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <Check className="h-3 w-3" />
                    İzlendi
                  </span>
                )}
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-pirate-text sm:text-2xl lg:text-[1.75rem]">
                {episode.title}
              </h1>
            </header>

            {/* ── Sahne çapası: yerleşimi ve yeri korur ────────────── */}
            <div ref={anchorRef} className="relative w-full" style={stageStyle}>
              {/* Sahne ayrıldığında boşluğu dolduran kart */}
              {detached && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-pirate-border/60 bg-ocean-surface/25 px-6 text-center sm:rounded-2xl">
                  <PictureInPicture2 className="h-7 w-7 text-gold/50" />
                  <p className="text-[13px] font-semibold text-pirate-text">
                    {mode === 'cinema' ? 'Sinema modunda oynuyor' : 'Mini oynatıcıda oynuyor'}
                  </p>
                  <button onClick={() => setMode('inline')} className="btn-ghost !px-3.5 !py-1.5 text-[12px]">
                    <Shrink className="h-3.5 w-3.5" />
                    Buraya geri getir
                  </button>
                </div>
              )}

              {/* ── SAHNE — tek iframe, üç yerleşim ─────────────────── */}
              <div
                ref={stageRef}
                className={stageClassName}
                style={detached ? stageStyle : undefined}
                role={mode === 'cinema' ? 'dialog' : undefined}
                aria-modal={mode === 'cinema' ? true : undefined}
                aria-label={
                  mode === 'cinema'
                    ? `Sinema modu — ${episode.title}`
                    : mode === 'mini'
                      ? `Mini oynatıcı — ${episode.title}`
                      : undefined
                }
              >
                <VideoStage
                  src={sourceUrl}
                  reloadKey={reloadKey}
                  loadState={loadState}
                  onLoad={() => setLoadState('ready')}
                  onRetry={reloadPlayer}
                  embedMode={hydrated ? prefs.embedMode : 'zoom'}
                  geometry={prefs.geometry}
                  showGeometryGuides={settingsOpen}
                  onUseFullEmbed={() => {
                    update({ embedMode: 'full' })
                    reloadPlayer()
                  }}
                  cover={arc.cover}
                  episodeTitle={episode.title}
                  arcName={arc.name}
                  globalEpisode={globalEp}
                />

                {/* Sinema modu üst şeridi */}
                {mode === 'cinema' && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-3">
                    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-luffy/70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-luffy" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                        Sinema
                      </span>
                      <span className="text-[10px] text-white/40">•</span>
                      <span className="stat-number text-[10px] text-white/70">
                        Bölüm {globalEp}
                      </span>
                    </div>
                    <div className="pointer-events-auto flex items-center gap-1.5">
                      <button
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-md transition-colors hover:border-gold/30 hover:text-gold"
                      >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </button>
                      <button
                        ref={cinemaCloseRef}
                        onClick={() => setMode('inline')}
                        aria-label="Sinema modundan çık"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-md transition-colors hover:border-gold/30 hover:text-gold"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini oynatıcı şeridi */}
                {mode === 'mini' && (
                  <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-1.5 bg-gradient-to-b from-black/80 to-transparent px-2 py-1.5">
                    <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-white/85">
                      {episode.title}
                    </span>
                    <button
                      onClick={() => setMode('inline')}
                      aria-label="Oynatıcıyı sayfaya geri getir"
                      title="Sayfaya geri getir"
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:text-gold"
                    >
                      <Shrink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => { setMiniDismissed(true); setMode('inline') }}
                      aria-label="Mini oynatıcıyı kapat"
                      title="Mini oynatıcıyı kapat"
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:text-luffy"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Sıradaki bölüm */}
                <AnimatePresence>
                  {upNextVisible && nextEpisode && (
                    <UpNextCard
                      episodeTitle={nextEpisode.title}
                      globalEpisode={globalNumberOf(nextEpisode.number)}
                      countdown={autoCountdown}
                      countdownTotal={PLAYER_TIMINGS.upNextCountdownSeconds}
                      onSkipNow={goToNext}
                      onCancel={() => setUpNextDismissed(true)}
                      compact={mode === 'mini'}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Kontroller ───────────────────────────────────────── */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggle(episode.slug, arc.slug)}
                aria-pressed={currentIsWatched}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-semibold transition-colors sm:text-[13px] ${
                  currentIsWatched
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'border-pirate-border bg-ocean-surface/60 text-pirate-muted hover:border-gold/25 hover:text-gold'
                }`}
              >
                {currentIsWatched ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {currentIsWatched ? 'İzlendi' : 'İzledim'}
                <kbd className="ml-0.5 hidden rounded border border-current/25 px-1 font-mono text-[9px] opacity-60 sm:inline">
                  W
                </kbd>
              </button>

              <button
                onClick={() => setMode((m) => (m === 'cinema' ? 'inline' : 'cinema'))}
                aria-pressed={mode === 'cinema'}
                className="inline-flex items-center gap-1.5 rounded-xl border border-pirate-border bg-ocean-surface/60 px-3 py-2 text-[12px] font-medium text-pirate-muted transition-colors hover:border-gold/25 hover:text-gold sm:text-[13px]"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sinema</span>
                <kbd className="ml-0.5 hidden rounded border border-current/25 px-1 font-mono text-[9px] opacity-60 sm:inline">
                  F
                </kbd>
              </button>

              <button
                onClick={reloadPlayer}
                className="inline-flex items-center gap-1.5 rounded-xl border border-pirate-border bg-ocean-surface/60 px-3 py-2 text-[12px] font-medium text-pirate-muted transition-colors hover:border-gold/25 hover:text-gold sm:text-[13px]"
                title="Oynatıcıyı yenile (R)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Yenile</span>
              </button>

              {/* Ayarlar — relative sarmalayıcı popover için */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen((v) => !v)}
                  aria-expanded={settingsOpen}
                  aria-haspopup="dialog"
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-medium transition-colors sm:text-[13px] ${
                    settingsOpen
                      ? 'border-gold/30 bg-gold/[0.08] text-gold'
                      : 'border-pirate-border bg-ocean-surface/60 text-pirate-muted hover:border-gold/25 hover:text-gold'
                  }`}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ayarlar</span>
                </button>
                <AnimatePresence>
                  {settingsOpen && (
                    <PlayerSettings
                      prefs={prefs}
                      onClose={() => setSettingsOpen(false)}
                      onUpdate={update}
                      onUpdateGeometry={updateGeometry}
                      onResetGeometry={resetGeometry}
                    />
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShortcutsOpen(true)}
                className="hidden items-center gap-1.5 rounded-xl border border-pirate-border bg-ocean-surface/60 px-3 py-2 text-[12px] font-medium text-pirate-muted transition-colors hover:border-gold/25 hover:text-gold sm:inline-flex sm:text-[13px]"
                title="Klavye kısayolları (?)"
                aria-label="Klavye kısayolları"
              >
                <Keyboard className="h-3.5 w-3.5" />
              </button>

              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-pirate-border bg-ocean-surface/60 px-3 py-2 text-[12px] font-medium text-pirate-muted transition-colors hover:border-gold/25 hover:text-gold sm:text-[13px]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {PLAYER_SOURCE.name}
              </a>

              <div className="flex-1" />

              {prevEpisode ? (
                <Link
                  href={`/arcs/${arc.slug}/${prevEpisode.slug}`}
                  className="btn-ghost !rounded-xl !px-3.5 !py-2 text-[12px] sm:text-[13px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Önceki</span>
                </Link>
              ) : null}
              {nextEpisode ? (
                <Link
                  href={`/arcs/${arc.slug}/${nextEpisode.slug}`}
                  className="btn-gold !rounded-xl !px-3.5 !py-2 text-[12px] sm:text-[13px]"
                >
                  <span className="hidden sm:inline">Sonraki</span>
                  <span className="sm:hidden">İleri</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : nextArc?.firstEpisodeSlug ? (
                <Link
                  href={`/arcs/${nextArc.slug}/${nextArc.firstEpisodeSlug}`}
                  className="btn-gold !rounded-xl !px-3.5 !py-2 text-[12px] sm:text-[13px]"
                >
                  <span className="hidden sm:inline">{nextArc.name}</span>
                  <span className="sm:hidden">Sonraki arc</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {/* ── Kaynak notu ──────────────────────────────────────── */}
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-pirate-muted/60">
              <Sparkles className="h-3 w-3 flex-shrink-0 text-gold/50" />
              Video{' '}
              <a
                href={PLAYER_SOURCE.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-pirate-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-gold"
              >
                {PLAYER_SOURCE.name}
              </a>{' '}
              üzerinden geliyor — Türkçe altyazılı One Pace sürümü.
              {remaining !== null && loadState === 'ready' && (
                <span className="stat-number ml-auto hidden text-pirate-muted/40 sm:inline">
                  ~{formatSeconds(remaining)} kaldı
                </span>
              )}
            </p>

            {/* ── Bölüm özeti ──────────────────────────────────────── */}
            {episode.summary && (
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bento-card mt-5 rounded-2xl p-5"
              >
                <h2 className="mb-2 flex items-center gap-2 text-[13px] font-bold text-pirate-text">
                  <BookOpen className="h-4 w-4 text-gold" />
                  Bölüm özeti
                </h2>
                <p className="text-[13px] leading-relaxed text-pirate-muted sm:text-sm">
                  {episode.summary}
                </p>
              </motion.section>
            )}
          </div>

          {/* ── Bölüm listesi ────────────────────────────────────────── */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <EpisodeRail
              arc={arc}
              currentSlug={episode.slug}
              isWatched={isWatched}
              watchedCount={watched}
              globalNumberOf={globalNumberOf}
              nextUnwatched={nextUnwatched}
              prevArc={prevArc}
              nextArc={nextArc}
            />
          </div>
        </div>
      </div>

      {/* ── Sinema modu arka planı ────────────────────────────────────── */}
      <AnimatePresence>
        {mode === 'cinema' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => setMode('inline')}
            className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sinema modu alt bilgi şeridi */}
      {mode === 'cinema' && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[261] flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono normal-case text-white/60">
              Esc
            </kbd>
            Çık
          </span>
          <span className="normal-case tracking-normal">{episode.title}</span>
          <span className="normal-case tracking-normal">{arc.name}</span>
        </div>
      )}

      <AnimatePresence>
        {shortcutsOpen && <ShortcutsDialog onClose={() => setShortcutsOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}

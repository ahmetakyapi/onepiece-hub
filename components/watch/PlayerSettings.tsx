'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Crop, Maximize, RotateCcw, SkipForward, PictureInPicture2, X } from 'lucide-react'
import { slideDown } from '@/lib/variants'
import { GEOMETRY_LIMITS, PLAYER_SOURCE, type EmbedGeometry } from '@/lib/player-config'
import type { EmbedMode, PlayerPrefs } from '@/hooks/usePlayerPrefs'

type Props = {
  prefs: PlayerPrefs
  onClose: () => void
  onUpdate: (patch: Partial<PlayerPrefs>) => void
  onUpdateGeometry: (patch: Partial<EmbedGeometry>) => void
  onResetGeometry: () => void
}

const GEOMETRY_FIELDS = [
  { key: 'width', label: 'Genişlik', unit: '%' },
  { key: 'height', label: 'Yükseklik', unit: '%' },
  { key: 'offsetX', label: 'Yatay kaydırma', unit: '%' },
  { key: 'offsetY', label: 'Dikey kaydırma', unit: '%' },
] as const satisfies readonly { key: keyof EmbedGeometry; label: string; unit: string }[]

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description: string
  icon: typeof SkipForward
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-ink/[0.04]"
    >
      <span
        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
          checked ? 'bg-gold/15 text-gold' : 'bg-ocean-surface text-pirate-muted'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-pirate-text">{label}</span>
        <span className="block text-[11px] leading-snug text-pirate-muted">{description}</span>
      </span>
      <span
        className={`mt-1 flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors ${
          checked ? 'border-gold/40 bg-gold/25' : 'border-pirate-border bg-ocean-deep'
        }`}
      >
        <motion.span
          animate={{ x: checked ? 18 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`h-3 w-3 rounded-full ${checked ? 'bg-gold' : 'bg-pirate-muted'}`}
        />
      </span>
    </button>
  )
}

export default function PlayerSettings({
  prefs,
  onClose,
  onUpdate,
  onUpdateGeometry,
  onResetGeometry,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [onClose])

  const setEmbedMode = (mode: EmbedMode) => onUpdate({ embedMode: mode })

  return (
    <motion.div
      ref={panelRef}
      variants={slideDown}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-label="Oynatıcı ayarları"
      className="glass-elevated absolute right-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl p-3"
    >
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="eyebrow text-pirate-muted">Oynatıcı Ayarları</span>
        <button
          onClick={onClose}
          aria-label="Ayarları kapat"
          className="flex h-6 w-6 items-center justify-center rounded-md text-pirate-muted transition-colors hover:text-gold"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Davranış ─────────────────────────────────────────────────── */}
      <Toggle
        checked={prefs.autoAdvance}
        onChange={(v) => onUpdate({ autoAdvance: v })}
        label="Otomatik Sonraki Bölüm"
        description="Bölüm süresi dolunca geri sayımla sonrakine geçer"
        icon={SkipForward}
      />
      <Toggle
        checked={prefs.miniPlayer}
        onChange={(v) => onUpdate({ miniPlayer: v })}
        label="Mini Oynatıcı"
        description="Sayfayı kaydırınca oynatıcı köşeye sabitlenir"
        icon={PictureInPicture2}
      />

      <div className="my-2 mx-2 h-px bg-gradient-to-r from-transparent via-pirate-border/40 to-transparent" />

      {/* ── Görüntü modu ─────────────────────────────────────────────── */}
      <p className="eyebrow px-2 pb-1.5 text-pirate-muted">Görüntü Modu</p>
      <div className="mx-2 mb-1 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setEmbedMode('zoom')}
          aria-pressed={prefs.embedMode === 'zoom'}
          className={`flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
            prefs.embedMode === 'zoom'
              ? 'border-gold/30 bg-gold/[0.08] text-gold'
              : 'border-pirate-border/60 bg-ocean-deep/40 text-pirate-muted hover:text-pirate-text'
          }`}
        >
          <Crop className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold">Kırpılmış</span>
          <span className="text-[9px] leading-tight opacity-70">Sadece video alanı</span>
        </button>
        <button
          onClick={() => setEmbedMode('full')}
          aria-pressed={prefs.embedMode === 'full'}
          className={`flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
            prefs.embedMode === 'full'
              ? 'border-gold/30 bg-gold/[0.08] text-gold'
              : 'border-pirate-border/60 bg-ocean-deep/40 text-pirate-muted hover:text-pirate-text'
          }`}
        >
          <Maximize className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold">Tam Sayfa</span>
          <span className="text-[9px] leading-tight opacity-70">{PLAYER_SOURCE.name} arayüzü</span>
        </button>
      </div>

      {/* ── Kalibrasyon ──────────────────────────────────────────────── */}
      {prefs.embedMode === 'zoom' && (
        <>
          <div className="my-2 mx-2 h-px bg-gradient-to-r from-transparent via-pirate-border/40 to-transparent" />
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="eyebrow text-pirate-muted">Kırpma Kalibrasyonu</span>
            <button
              onClick={onResetGeometry}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-pirate-muted transition-colors hover:text-gold"
            >
              <RotateCcw className="h-3 w-3" />
              Sıfırla
            </button>
          </div>
          <p className="px-2 pb-2 text-[10px] leading-snug text-pirate-muted/80">
            Video kadrajı kaymışsa buradan düzelt — ayar bu cihazda saklanır.
          </p>
          <div className="space-y-2 px-2 pb-1">
            {GEOMETRY_FIELDS.map((field) => {
              const limits = GEOMETRY_LIMITS[field.key]
              return (
                <label key={field.key} className="block">
                  <span className="mb-1 flex items-center justify-between text-[10px] font-semibold text-pirate-muted">
                    {field.label}
                    <span className="font-mono text-gold">
                      {prefs.geometry[field.key]}
                      {field.unit}
                    </span>
                  </span>
                  <input
                    type="range"
                    className="wanted-range w-full"
                    min={limits.min}
                    max={limits.max}
                    step={limits.step}
                    value={prefs.geometry[field.key]}
                    onChange={(e) => onUpdateGeometry({ [field.key]: Number(e.target.value) })}
                  />
                </label>
              )
            })}
          </div>
        </>
      )}
    </motion.div>
  )
}

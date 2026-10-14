'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Download, Loader2, RotateCcw, Skull } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fadeUp, EASE } from '@/lib/variants'
import { toast } from '@/lib/toast'
import SplitText from '@/components/motion/SplitText'

const EPITHET_SUGGESTIONS = [
  'Denizlerin Korkusu', 'Fırtına Bıçağı', 'Gölge Kaptan', 'Altın Yumruk',
  'Kara Kılıç', 'Şimşek', 'Tsunaminin Oğlu', 'Ateş Gözlü',
  'Buz Prensi', 'Rüzgar Yürüyen', 'Yıldırım Pençe', 'Demir İrade',
]

/* Afiş paleti — KASITLI olarak sabit renk (CLAUDE.md → "Kasıtlı olarak
   tema DIŞI"): afiş iki temada da aynı sepya. Hem önizleme hem PNG
   çıktısı buradan okur; ikisi aynı afişi çizer.

   Eskiden metin `#1a0a04` (neredeyse siyah) idi, zemin de koyu kahve —
   "DEAD OR ALIVE", isim ve ödül zeminde kayboluyordu. Ödül
   sıralamasındaki afişlerin dili (altın başlık, kırmızı uyarı, krem isim)
   buraya da taşındı. */
const POSTER = {
  bgTop: '#2d1810',
  bgMid: '#3d2214',
  bgBottom: '#1a0f0a',
  frame: '#8b6914',
  title: '#f4b73a',
  alert: '#ef6a52',
  name: '#f6ead0',
  epithet: '#e9c983',
  bounty: '#f4b73a',
  muted: '#c9a978',
  photoBg: '#d4b896',
} as const

const MAX_PHOTO_BYTES = 8 * 1024 * 1024

/* Ödül kaydırıcısı LOGARİTMİK: 1M → 10B arası dört basamak. Doğrusal
   kaydırıcıda 1B'nin altı çubuğun ilk %10'una sıkışıyor, altındaki
   "100M · 1B · 5B" işaretleri de yanlış yerde duruyordu. Değer iki anlamlı
   basamağa yuvarlanır (320.000.000, 1.500.000.000 gibi gerçek ödüller). */
const LOG_MIN = 6
const LOG_MAX = 10
const TICKS = ['1M', '10M', '100M', '1B', '10B']

function bountyFromLog(v: number): number {
  const raw = 10 ** v
  const mag = 10 ** (Math.floor(Math.log10(raw)) - 1)
  return Math.round(raw / mag) * mag
}

function formatBounty(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1).replace('.0', '').replace('.', ',')}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toString()
}

/** Dosya adı: "Monkey D. Luffy" → "wanted-monkey-d-luffy.png" */
function posterFileName(name: string): string {
  const slug = name
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `wanted-${slug || 'poster'}.png`
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image'))
    img.src = src
  })
}

export default function WantedPosterCreator() {
  const [name, setName] = useState('')
  const [epithet, setEpithet] = useState('')
  const [bountyLog, setBountyLog] = useState(8) // 100.000.000
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  const bounty = bountyFromLog(bountyLog)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast({ kind: 'error', title: 'Bu bir görsel değil', message: 'JPG, PNG ya da WebP bir fotoğraf seç.' })
      e.target.value = ''
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast({ kind: 'error', title: 'Fotoğraf çok büyük', message: 'En fazla 8 MB olabilir.' })
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setImageUrl(ev.target?.result as string)
    reader.onerror = () => toast({ kind: 'error', title: 'Fotoğraf okunamadı' })
    reader.readAsDataURL(file)
  }, [])

  /* PNG çıktısı önizlemenin KENDİSİNDEN ölçülür: her metin öğesinin kutusu
     ve hesaplanmış fontu okunup tuvale aynı yere çizilir. Eskiden elle
     yazılmış koordinatlarla ikinci bir afiş çiziliyordu — lakap hiç
     basılmıyor, fotoğraf 200px yüksekliğe ezilip oranı bozuluyordu. */
  const handleDownload = useCallback(async () => {
    const poster = posterRef.current
    if (!poster || exporting) return
    if (!name.trim()) {
      toast({ kind: 'info', title: 'Önce bir isim yaz', message: 'Afişte kimin arandığı yazmalı.' })
      nameInputRef.current?.focus()
      return
    }

    setExporting(true)
    try {
      const scale = 2
      const box = poster.getBoundingClientRect()
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(box.width * scale)
      canvas.height = Math.round(box.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas')
      ctx.scale(scale, scale)

      // Zemin + çerçeve
      const gradient = ctx.createLinearGradient(0, 0, 0, box.height)
      gradient.addColorStop(0, POSTER.bgTop)
      gradient.addColorStop(0.5, POSTER.bgMid)
      gradient.addColorStop(1, POSTER.bgBottom)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, box.width, box.height)
      ctx.strokeStyle = POSTER.frame
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, box.width - 4, box.height - 4)

      // Köşe süsleri (önizlemedeki 16px'lik L'ler)
      ctx.strokeStyle = `${POSTER.frame}66`
      ctx.lineWidth = 2
      const c = 16
      const o = 9
      for (const [x, y, dx, dy] of [
        [o, o, 1, 1], [box.width - o, o, -1, 1], [o, box.height - o, 1, -1], [box.width - o, box.height - o, -1, -1],
      ]) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy * c)
        ctx.lineTo(x, y)
        ctx.lineTo(x + dx * c, y)
        ctx.stroke()
      }

      // Fotoğraf — önizlemedeki gibi `object-cover`
      const photoEl = photoRef.current
      if (photoEl) {
        const r = photoEl.getBoundingClientRect()
        const x = r.left - box.left
        const y = r.top - box.top
        ctx.fillStyle = POSTER.photoBg
        ctx.fillRect(x, y, r.width, r.height)
        if (imageUrl) {
          const img = await loadImage(imageUrl)
          const s = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight)
          const sw = r.width / s
          const sh = r.height / s
          const sx = (img.naturalWidth - sw) / 2
          const sy = (img.naturalHeight - sh) / 2
          ctx.drawImage(img, sx, sy, sw, sh, x, y, r.width, r.height)
        }
        ctx.strokeStyle = 'rgba(26, 10, 4, 0.35)'
        ctx.lineWidth = 2
        ctx.strokeRect(x + 1, y + 1, r.width - 2, r.height - 2)
      }

      // Metinler — `data-poster-text` taşıyan her öğe kendi yerine
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      poster.querySelectorAll<HTMLElement>('[data-poster-text]').forEach((el) => {
        const text = el.textContent?.trim()
        if (!text) return
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        ctx.fillStyle = cs.color
        if ('letterSpacing' in ctx) {
          ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing
        }
        ctx.fillText(text, r.left - box.left + r.width / 2, r.top - box.top + r.height / 2)
      })

      // Ayırıcı çizgiler
      poster.querySelectorAll<HTMLElement>('[data-poster-rule]').forEach((el) => {
        const r = el.getBoundingClientRect()
        ctx.fillStyle = getComputedStyle(el).backgroundColor
        ctx.fillRect(r.left - box.left, r.top - box.top, r.width, Math.max(1, r.height))
      })

      // Çerçeveli etiket ("MARINE") ve ikonlar (kurukafa)
      poster.querySelectorAll<HTMLElement>('[data-poster-pill]').forEach((el) => {
        const r = el.getBoundingClientRect()
        ctx.strokeStyle = getComputedStyle(el).borderTopColor
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(r.left - box.left + 0.5, r.top - box.top + 0.5, r.width - 1, r.height - 1, r.height / 2)
        ctx.stroke()
      })
      for (const svg of Array.from(poster.querySelectorAll<SVGSVGElement>('svg[data-poster-icon]'))) {
        const r = svg.getBoundingClientRect()
        const markup = new XMLSerializer()
          .serializeToString(svg)
          .replace(/currentColor/g, getComputedStyle(svg).color)
        const icon = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`)
        ctx.drawImage(icon, r.left - box.left, r.top - box.top, r.width, r.height)
      }

      const link = document.createElement('a')
      link.download = posterFileName(name)
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast({ kind: 'success', title: 'Afiş indirildi', message: link.download })
    } catch {
      toast({ kind: 'error', title: 'Afiş indirilemedi', message: 'Tekrar dene; olmazsa ekran görüntüsü alabilirsin.' })
    } finally {
      setExporting(false)
    }
  }, [name, imageUrl, exporting])

  const reset = () => {
    setName('')
    setEpithet('')
    setBountyLog(8)
    setImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <main className="relative min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10 text-center">
          <SplitText as="h1" play delay={0.2} className="mb-3 text-3xl font-extrabold sm:text-4xl" parts={[{ text: 'Wanted Poster', className: 'text-gold-gradient' }, { text: 'Oluşturucu', className: 'text-pirate-text' }]} />
          <p className="mx-auto max-w-lg text-sm text-pirate-muted">
            Kendi aranıyor afişini hazırla: fotoğrafını yükle, ismini ve ödülünü belirle, PNG olarak indir.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* ─── Controls ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Photo upload */}
            <div>
              <p className="mb-2 block text-sm font-semibold text-pirate-text">Fotoğraf</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-ghost group flex w-full items-center justify-center gap-2 rounded-xl py-8"
              >
                <Camera className="h-5 w-5 text-pirate-muted transition-colors group-hover:text-gold" />
                <span className="text-sm">{imageUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
              </button>
              <p className="mt-2 text-xs text-pirate-muted">
                Fotoğraf yalnız tarayıcında işlenir, hiçbir yere yüklenmez. En fazla 8 MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Afiş fotoğrafı seç"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="poster-name" className="mb-2 block text-sm font-semibold text-pirate-text">İsim</label>
              <input
                id="poster-name"
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monkey D. Luffy"
                maxLength={30}
                autoComplete="off"
                className="w-full rounded-xl border border-pirate-border/40 bg-ocean-surface/50 px-4 py-3 text-sm text-pirate-text placeholder:text-pirate-muted/60 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
            </div>

            {/* Epithet */}
            <div>
              <label htmlFor="poster-epithet" className="mb-2 block text-sm font-semibold text-pirate-text">Lakap</label>
              <input
                id="poster-epithet"
                type="text"
                value={epithet}
                onChange={(e) => setEpithet(e.target.value)}
                placeholder="Hasır Şapka"
                maxLength={30}
                autoComplete="off"
                className="w-full rounded-xl border border-pirate-border/40 bg-ocean-surface/50 px-4 py-3 text-sm text-pirate-text placeholder:text-pirate-muted/60 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
              <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Lakap önerileri">
                {EPITHET_SUGGESTIONS.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEpithet(s)}
                    aria-pressed={epithet === s}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      epithet === s
                        ? 'border-gold/40 bg-gold/10 text-gold'
                        : 'border-pirate-border/40 bg-ocean-surface/30 text-pirate-muted hover:border-gold/30 hover:text-gold'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Bounty */}
            <div>
              <label htmlFor="poster-bounty" className="mb-2 block text-sm font-semibold text-pirate-text">
                Ödül: <span className="stat-number font-mono text-gold">{bounty.toLocaleString('tr-TR')} Berry</span>
                <span className="ml-1.5 font-mono text-xs text-pirate-muted">({formatBounty(bounty)})</span>
              </label>
              <input
                id="poster-bounty"
                type="range"
                min={LOG_MIN}
                max={LOG_MAX}
                step={0.01}
                value={bountyLog}
                onChange={(e) => setBountyLog(Number(e.target.value))}
                aria-valuetext={`${bounty.toLocaleString('tr-TR')} Berry`}
                className="wanted-range w-full"
              />
              <div className="mt-1 flex justify-between font-mono text-xs text-pirate-muted" aria-hidden>
                {TICKS.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button type="button" onClick={handleDownload} disabled={exporting} className="btn-gold flex-1 gap-2 disabled:opacity-70">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                PNG Olarak İndir
              </button>
              <button type="button" onClick={reset} className="btn-ghost gap-2">
                <RotateCcw className="h-4 w-4" />
                Sıfırla
              </button>
            </div>
          </motion.div>

          {/* ─── Poster Preview ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="flex items-start justify-center"
          >
            <div
              ref={posterRef}
              role="img"
              aria-label={`Aranıyor afişi: ${name || 'isimsiz'}${epithet ? `, "${epithet}"` : ''}, ${bounty.toLocaleString('tr-TR')} Berry`}
              className="wanted-poster relative w-full max-w-[340px] overflow-hidden rounded-lg border-4 p-6"
              style={{
                borderColor: `${POSTER.frame}99`,
                background: `linear-gradient(180deg, ${POSTER.bgTop} 0%, ${POSTER.bgMid} 50%, ${POSTER.bgBottom} 100%)`,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(244,163,0,0.1)',
              }}
            >
              {/* Aged paper texture */}
              <div className="pointer-events-none absolute inset-0 opacity-10" style={{ background: 'var(--noise)', backgroundSize: '150px' }} />

              {/* Corner decorations */}
              {['left-2 top-2 border-l-2 border-t-2', 'right-2 top-2 border-r-2 border-t-2', 'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'].map((pos) => (
                <div key={pos} className={`absolute h-4 w-4 ${pos}`} style={{ borderColor: `${POSTER.frame}66` }} />
              ))}

              {/* WANTED */}
              <h2
                data-poster-text
                className="mb-4 text-center text-4xl font-extrabold tracking-[0.15em] sm:text-5xl"
                style={{ color: POSTER.title, textShadow: '0 0 18px rgba(244, 183, 58, 0.25)', fontFamily: 'Georgia, serif' }}
              >
                WANTED
              </h2>

              {/* Separator */}
              <div data-poster-rule className="mx-auto mb-4 h-px w-3/4" style={{ background: `${POSTER.title}55` }} />

              {/* Photo area */}
              <div
                ref={photoRef}
                className="relative mx-auto mb-4 aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded border-2"
                style={{ background: POSTER.photoBg, borderColor: 'rgba(26, 10, 4, 0.35)' }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="260px"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2" style={{ color: 'rgba(26, 10, 4, 0.45)' }}>
                    <Camera className="h-10 w-10" />
                    <span className="text-xs font-medium">Fotoğraf yükle</span>
                  </div>
                )}
              </div>

              {/* DEAD OR ALIVE */}
              <p
                data-poster-text
                className="mb-2 text-center text-xs font-bold tracking-[0.2em]"
                style={{ color: POSTER.alert }}
              >
                DEAD OR ALIVE
              </p>

              {/* Name — yazıldığı gibi: büyük harfe çevirmek yabancı adlarda
                  Türkçe kuralla "NİCO ROBİN" üretiyordu. */}
              <h3
                data-poster-text
                className="mb-1 text-center text-xl font-extrabold tracking-wide sm:text-2xl"
                style={{ color: name ? POSTER.name : `${POSTER.name}66`, fontFamily: 'Georgia, serif' }}
              >
                {name || 'İsmini Gir'}
              </h3>

              {/* Epithet */}
              {epithet && (
                <p data-poster-text className="mb-2 text-center text-sm italic" style={{ color: POSTER.epithet }}>
                  &quot;{epithet}&quot;
                </p>
              )}

              {/* Separator */}
              <div data-poster-rule className="mx-auto mb-2 h-px w-1/2" style={{ background: `${POSTER.title}40` }} />

              {/* Bounty */}
              <div className="flex items-center justify-center gap-2">
                <Skull data-poster-icon className="h-4 w-4" style={{ color: POSTER.bounty }} aria-hidden />
                <p
                  data-poster-text
                  className="text-center text-lg font-extrabold tracking-wide sm:text-xl"
                  style={{ color: POSTER.bounty, fontFamily: 'Georgia, serif' }}
                >
                  {bounty.toLocaleString('tr-TR')}
                </p>
              </div>
              <p data-poster-text className="mt-0.5 text-center text-xs font-semibold tracking-[0.15em]" style={{ color: POSTER.muted }}>
                BERRY
              </p>

              {/* Marine logo area */}
              <div className="mt-4 flex justify-center">
                <div
                  data-poster-text
                  data-poster-pill
                  className="rounded-full border px-4 py-1 text-xs font-bold tracking-[0.3em]"
                  style={{ color: POSTER.muted, borderColor: `${POSTER.muted}55` }}
                >
                  MARINE
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

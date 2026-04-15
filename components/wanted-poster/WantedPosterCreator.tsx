'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Download, RotateCcw, Skull } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, EASE } from '@/lib/variants'

const EPITHET_SUGGESTIONS = [
  'Denizlerin Korkusu', 'Fırtına Bıçağı', 'Gölge Kaptan', 'Altın Yumruk',
  'Kara Kılıç', 'Şimşek', 'Tsunaminin Oğlu', 'Ateş Gözlü',
  'Buz Prensi', 'Rüzgar Yürüyen', 'Yıldırım Pençe', 'Demir İrade',
]

function formatBounty(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toString()
}

export default function WantedPosterCreator() {
  const [name, setName] = useState('')
  const [epithet, setEpithet] = useState('')
  const [bounty, setBounty] = useState(100_000_000)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDownload = useCallback(async () => {
    const el = posterRef.current
    if (!el) return

    // Use html2canvas-style approach via canvas
    try {
      const canvas = document.createElement('canvas')
      const scale = 2
      canvas.width = el.offsetWidth * scale
      canvas.height = el.offsetHeight * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#2d1810')
      gradient.addColorStop(0.5, '#3d2214')
      gradient.addColorStop(1, '#1a0f0a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Border
      ctx.strokeStyle = '#8B6914'
      ctx.lineWidth = 6 * scale
      ctx.strokeRect(8 * scale, 8 * scale, canvas.width - 16 * scale, canvas.height - 16 * scale)

      // WANTED text
      ctx.fillStyle = '#1a0a04'
      ctx.font = `bold ${36 * scale}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('WANTED', canvas.width / 2, 55 * scale)

      // Image area
      if (imageUrl) {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const imgX = 40 * scale
            const imgY = 70 * scale
            const imgW = (el.offsetWidth - 80) * scale
            const imgH = 200 * scale
            ctx.drawImage(img, imgX, imgY, imgW, imgH)
            resolve()
          }
          img.onerror = () => resolve()
          img.src = imageUrl
        })
      }

      // DEAD OR ALIVE
      ctx.fillStyle = '#1a0a04'
      ctx.font = `bold ${12 * scale}px serif`
      ctx.fillText('DEAD OR ALIVE', canvas.width / 2, 290 * scale)

      // Name
      ctx.fillStyle = '#1a0a04'
      ctx.font = `bold ${24 * scale}px serif`
      ctx.fillText(name || 'İSİM GİR', canvas.width / 2, 325 * scale)

      // Bounty
      ctx.fillStyle = '#1a0a04'
      ctx.font = `bold ${20 * scale}px serif`
      ctx.fillText(`${bounty.toLocaleString('tr-TR')} Berry`, canvas.width / 2, 365 * scale)

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `wanted-${(name || 'poster').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // Fallback: alert
      alert('Poster indirme başarısız. Ekran görüntüsü alabilirsiniz.')
    }
  }, [name, bounty, imageUrl])

  const reset = () => {
    setName('')
    setEpithet('')
    setBounty(100_000_000)
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
          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            <span className="text-gold-gradient">Wanted Poster</span>{' '}
            <span className="text-pirate-text">Oluşturucu</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm text-pirate-muted">
            Kendi One Piece wanted poster&apos;ını oluştur. Fotoğrafını yükle, ismini ve ödülünü belirle!
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
              <label className="mb-2 block text-sm font-semibold text-pirate-text">Fotoğraf</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-ghost group flex w-full items-center justify-center gap-2 rounded-xl py-8"
              >
                <Camera className="h-5 w-5 text-pirate-muted transition-colors group-hover:text-gold" />
                <span className="text-sm">{imageUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-pirate-text">İsim</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monkey D. Luffy"
                maxLength={30}
                className="w-full rounded-xl border border-pirate-border/20 bg-ocean-surface/50 px-4 py-3 text-sm text-pirate-text placeholder:text-pirate-muted/30 focus:border-gold/30 focus:outline-none"
              />
            </div>

            {/* Epithet */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-pirate-text">Lakap</label>
              <input
                type="text"
                value={epithet}
                onChange={(e) => setEpithet(e.target.value)}
                placeholder="Hasır Şapka"
                maxLength={30}
                className="w-full rounded-xl border border-pirate-border/20 bg-ocean-surface/50 px-4 py-3 text-sm text-pirate-text placeholder:text-pirate-muted/30 focus:border-gold/30 focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {EPITHET_SUGGESTIONS.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onClick={() => setEpithet(s)}
                    className="rounded-full border border-pirate-border/10 bg-ocean-surface/30 px-2.5 py-1 text-[10px] font-medium text-pirate-muted/60 transition-colors hover:border-gold/20 hover:text-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Bounty */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-pirate-text">
                Ödül: <span className="text-gold">{bounty.toLocaleString('tr-TR')} Berry</span>
                <span className="ml-1.5 text-xs text-pirate-muted">({formatBounty(bounty)})</span>
              </label>
              <input
                type="range"
                min={1_000_000}
                max={10_000_000_000}
                step={1_000_000}
                value={bounty}
                onChange={(e) => setBounty(Number(e.target.value))}
                className="wanted-range w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] text-pirate-muted/40">
                <span>1M</span>
                <span>100M</span>
                <span>1B</span>
                <span>5B</span>
                <span>10B</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={handleDownload} className="btn-gold flex-1 gap-2">
                <Download className="h-4 w-4" />
                İndir
              </button>
              <button onClick={reset} className="btn-ghost gap-2">
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
              className="wanted-poster relative w-full max-w-[340px] overflow-hidden rounded-lg border-4 border-[#8B6914]/60 p-6"
              style={{
                background: 'linear-gradient(180deg, #2d1810 0%, #3d2214 50%, #1a0f0a 100%)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(244,163,0,0.1)',
              }}
            >
              {/* Aged paper texture */}
              <div className="pointer-events-none absolute inset-0 opacity-10" style={{ background: 'var(--noise)', backgroundSize: '150px' }} />

              {/* Corner decorations */}
              <div className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[#8B6914]/40" />
              <div className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[#8B6914]/40" />
              <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[#8B6914]/40" />
              <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[#8B6914]/40" />

              {/* WANTED */}
              <h2
                className="mb-4 text-center text-4xl font-extrabold tracking-[0.15em] sm:text-5xl"
                style={{
                  color: '#1a0a04',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontFamily: 'serif',
                }}
              >
                WANTED
              </h2>

              {/* Separator */}
              <div className="mx-auto mb-4 h-px w-3/4 bg-[#1a0a04]/20" />

              {/* Photo area */}
              <div
                className="relative mx-auto mb-4 aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded border-2 border-[#1a0a04]/20"
                style={{ background: '#d4b896' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Poster" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-[#1a0a04]/30">
                    <Camera className="h-10 w-10" />
                    <span className="text-xs font-medium">Fotoğraf yükle</span>
                  </div>
                )}
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(26,10,4,0.3))]" />
              </div>

              {/* DEAD OR ALIVE */}
              <p
                className="mb-2 text-center text-[10px] font-bold tracking-[0.2em] sm:text-xs"
                style={{ color: '#1a0a04' }}
              >
                DEAD OR ALIVE
              </p>

              {/* Name */}
              <h3
                className="mb-1 text-center text-xl font-extrabold tracking-wide sm:text-2xl"
                style={{ color: '#1a0a04', fontFamily: 'serif' }}
              >
                {name || 'İSMİNİ GİR'}
              </h3>

              {/* Epithet */}
              {epithet && (
                <p className="mb-2 text-center text-xs italic" style={{ color: '#1a0a04' }}>
                  &quot;{epithet}&quot;
                </p>
              )}

              {/* Separator */}
              <div className="mx-auto mb-2 h-px w-1/2 bg-[#1a0a04]/15" />

              {/* Bounty */}
              <div className="flex items-center justify-center gap-2">
                <Skull className="h-4 w-4" style={{ color: '#1a0a04' }} />
                <p
                  className="text-center text-lg font-extrabold tracking-wide sm:text-xl"
                  style={{ color: '#1a0a04', fontFamily: 'serif' }}
                >
                  {bounty.toLocaleString('tr-TR')}
                </p>
              </div>
              <p className="mt-0.5 text-center text-[10px] font-semibold tracking-[0.15em]" style={{ color: '#1a0a04' }}>
                BERRY
              </p>

              {/* Marine logo area */}
              <div className="mt-4 flex justify-center">
                <div
                  className="rounded-full border border-[#1a0a04]/20 px-4 py-1 text-[9px] font-bold tracking-[0.3em]"
                  style={{ color: '#1a0a04' }}
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

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { INTRO_STORAGE_KEY } from '@/lib/theme-config'
import { EASE_CURTAIN, EASE_REVEAL, markIntroDone } from '@/lib/motion'

/* ═══ Açılış sekansı ══════════════════════════════════════════════════════
   Oturumun ilk sayfasında bir kez oynar: pusula çizilir, iğne salınıp
   kuzeye oturur, sayaç 000 → 100 sayar, sonra iki katmanlı perde (lacivert
   önde, altın arkada) kavisli kenarla yukarı çekilir ve hero açılır.

   Görünürlük CSS'te: `html[data-intro] .op-preloader`. Attribute'u ilk
   boyamadan önce `INTRO_INIT_SCRIPT` yazar (lib/theme-config.ts) — bu yüzden
   bileşen SSR'da render edilir ve `dynamic(ssr:false)` ile YÜKLENMEZ;
   yüklenseydi içerik bir an görünüp sonra örtülürdü. */

const NAME = 'ONE PIECE'.split('')
const STATUS = ['Log Pose ayarlanıyor', 'Rota çiziliyor', 'Yelkenler açılıyor'] as const

/** Sayaç asgari süresi — sayfa önbellekten anında gelse bile sekans
 *  okunabilsin. Sayfa yavaşsa 92'de bekler, `load` veya üst sınırla tamamlanır. */
const MIN_COUNT_MS = 1500
const MAX_WAIT_MS = 3200

type Phase = 'counting' | 'leaving' | 'gone'

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('counting')
  const [count, setCount] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    if (!html.hasAttribute('data-intro')) {
      setPhase('gone')
      return
    }
    // JS sürüyor → CSS failsafe'i devre dışı bırak. Kaydırma kilidi de
    // JS'te: CSS'te olsaydı JS patladığında failsafe preloader'ı gizlese
    // bile sayfa kilitli kalırdı.
    rootRef.current?.classList.add('is-live')
    document.body.style.overflow = 'hidden'

    let raf = 0
    let loaded = document.readyState === 'complete'
    const onLoad = () => { loaded = true }
    window.addEventListener('load', onLoad)
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / MIN_COUNT_MS, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const ceiling = loaded || elapsed > MAX_WAIT_MS ? 100 : 92
      const value = Math.min(Math.round(eased * 100), ceiling)
      setCount(value)
      if (value >= 100) {
        setPhase('leaving')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const statusTimer = setInterval(() => {
      setStatusIdx((i) => Math.min(i + 1, STATUS.length - 1))
    }, 520)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(statusTimer)
      window.removeEventListener('load', onLoad)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return
    // Hero animasyonları perde kalkarken başlasın
    const t = setTimeout(markIntroDone, 380)
    return () => clearTimeout(t)
  }, [phase])

  const finish = () => {
    try { sessionStorage.setItem(INTRO_STORAGE_KEY, '1') } catch { /* gizli sekme */ }
    document.documentElement.removeAttribute('data-intro')
    document.body.style.overflow = ''
    markIntroDone()
    setPhase('gone')
  }

  if (phase === 'gone') return null

  const padded = String(count).padStart(3, '0')

  return (
    <div ref={rootRef} className="op-preloader fixed inset-0 z-[400]" aria-hidden="true">
      {/* Arka katman — altın. Öndeki lacivert kalktıktan hemen sonra o da
          kalkar; arada ince bir altın şerit süpürülür. */}
      {/* Katmanlar ekranın 12vh altına taşar: kavisli alt kenar durağanken
          görünmez, yalnızca yukarı çekilirken belirir. */}
      <motion.div
        className="absolute inset-x-0 top-0 -bottom-[12vh] bg-gold"
        initial={{ y: 0 }}
        animate={phase === 'leaving' ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.05, ease: EASE_CURTAIN, delay: 0.12 }}
        style={{ borderBottomLeftRadius: '50% 8vh', borderBottomRightRadius: '50% 8vh' }}
        onAnimationComplete={() => { if (phase === 'leaving') finish() }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 -bottom-[12vh] overflow-hidden bg-ocean-deep"
        initial={{ y: 0 }}
        animate={phase === 'leaving' ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1, ease: EASE_CURTAIN }}
        style={{ borderBottomLeftRadius: '50% 8vh', borderBottomRightRadius: '50% 8vh' }}
      >
        {/* Okyanus derinliği — yumuşak ışık havuzu */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-dot opacity-30" />

        <motion.div
          className="relative flex h-dvh flex-col items-center justify-center px-6"
          animate={phase === 'leaving' ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_CURTAIN }}
        >
          {/* Pusula — halka çizilir, iğne salınıp kuzeye oturur */}
          <svg viewBox="0 0 72 72" className="h-24 w-24 sm:h-28 sm:w-28" fill="none">
            <motion.circle
              cx="36" cy="36" r="32"
              stroke="rgb(var(--gold))" strokeWidth="2.5"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: -90 }}
              transition={{ duration: 1.1, ease: EASE_REVEAL }}
              style={{ originX: '50%', originY: '50%' }}
            />
            <motion.circle
              cx="36" cy="36" r="25"
              stroke="rgb(var(--sea-light) / 0.35)" strokeWidth="1" strokeDasharray="2 5"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, rotate: 180 }}
              transition={{ duration: 1.6, ease: EASE_REVEAL, delay: 0.2 }}
              style={{ originX: '50%', originY: '50%' }}
            />
            <motion.g
              initial={{ rotate: -140, scale: 0.4, opacity: 0 }}
              animate={{ rotate: [-140, 28, -12, 5, 0], scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.25, times: [0, 0.45, 0.7, 0.88, 1] }}
              style={{ originX: '50%', originY: '50%' }}
            >
              <path d="M36 9 L42 36 L36 63 L30 36 Z" fill="rgb(var(--gold))" />
              <path d="M9 36 L36 31 L63 36 L36 41 Z" fill="rgb(var(--sea-light) / 0.9)" />
              <circle cx="36" cy="36" r="5.5" fill="rgb(var(--ocean-deep))" stroke="rgb(var(--gold))" strokeWidth="2.5" />
            </motion.g>
          </svg>

          {/* Wordmark — harf harf yükselir */}
          <div className="mt-8 flex items-baseline gap-3">
            <span className="flex overflow-hidden text-3xl font-extrabold tracking-[0.08em] text-pirate-text sm:text-5xl">
              {NAME.map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_REVEAL, delay: 0.35 + i * 0.04 }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="font-mono text-xs font-bold tracking-[0.4em] text-gold sm:text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_REVEAL, delay: 0.9 }}
            >
              HUB
            </motion.span>
          </div>

          <div className="mt-4 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                className="eyebrow text-pirate-muted"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_REVEAL }}
              >
                {STATUS[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Alt şerit — sayaç + ilerleme çizgisi */}
        <motion.div
          className="absolute inset-x-0 top-[100dvh] -translate-y-full px-6 pb-8 sm:px-10 sm:pb-10"
          animate={phase === 'leaving' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-3 flex items-end justify-between font-mono">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-pirate-muted">
              Grand Line&nbsp;·&nbsp;Seyir
            </span>
            <span className="text-4xl font-bold leading-none tabular-nums text-gold sm:text-6xl">
              {padded}
            </span>
          </div>
          <div className="h-px w-full bg-pirate-border/40">
            <div
              className="h-full origin-left bg-gradient-to-r from-gold to-sea-light"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

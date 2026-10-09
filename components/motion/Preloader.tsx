'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { INTRO_STORAGE_KEY } from '@/lib/theme-config'
import { EASE_CURTAIN, markIntroDone } from '@/lib/motion'

/* ═══ Açılış sekansı — "Seyir Haritası" ══════════════════════════════════
   Oturumun ilk sayfasında bir kez oynar (~2.3 sn). Sayaç YOK:

   1. Parşömen-deniz haritası: enlem/boylam ağı belirir, Red Line dikine
      çekilir.
   2. Pusula halkası çizilir, iğne hızla döner ve Grand Line'a (doğu,
      seyir yönü) dönük oturur.
   3. Altın halat rotası haritayı soldan sağa çizer, adalar rota geçtikçe
      yanar; arkasından kesikli dümen suyu açılır.
   4. "ONE PIECE HUB" harf harf maskeden yükselir.
   5. Dalga kenarlı iki perde (önde zemin, arkada altın) yukarı süpürülür,
      kalkarken dalga sırtı kabarır → hero açılır.

   İKİ MOTOR, bilerek:
   - 1-4 CSS keyframe'leri (`globals.css` → `.op-i-*`). İlk boyamada başlar,
     hydration'ı BEKLEMEZ — JS yavaş gelse bile sekans oynar; JS geldiğinde
     son kare zaten hazırdır.
   - 5 (çıkış) Framer Motion: `load` + asgari süre koşuluna bağlı.
   Yalnız transform / opacity / clip-path / stroke-dashoffset canlanır.
   Renkler token — iki temada da doğru (light'ta parşömen + koyu altın).

   Görünürlük CSS'te: `html[data-intro] .op-preloader`. Attribute'u ilk
   boyamadan önce `INTRO_INIT_SCRIPT` yazar (lib/theme-config.ts) — bu yüzden
   bileşen SSR'da render edilir ve `dynamic(ssr:false)` ile YÜKLENMEZ;
   yüklenseydi içerik bir an görünüp sonra örtülürdü. */

const NAME = 'ONE PIECE'.split('')

/** Perde en erken bu anda kalkar (navigasyon başından, ms) — CSS sekansı
 *  ~1.45 sn'de oturur. Sayfa yavaşsa son kare `load`'a kadar bekler, üst
 *  sınırla yine kalkar. */
const EXIT_AT_MS = 1450
const MAX_WAIT_MS = 3200

/** Rota — 1440×240 bant, merkez (720,120) pusulanın altında kalır. */
const ROUTE = 'M-40 168 C 120 176, 220 92, 360 104 S 560 176, 720 120 S 920 60, 1080 92 S 1300 168, 1480 112'
const ISLANDS = [
  { x: 214, y: 121, delay: 620, name: 'East Blue', above: true },
  { x: 470, y: 150, delay: 800, name: 'Alabasta', above: false },
  { x: 958, y: 78, delay: 1060, name: 'Wano', above: true },
  { x: 1222, y: 142, delay: 1230, name: 'Laugh Tale', above: false },
] as const

type Phase = 'intro' | 'leaving' | 'gone'

/** Perdenin dalga kenarı. Katmanın altına taşar; durağanken ekran dışında. */
function WaveEdge({ className, flip, leaving, delay }: { className: string; flip?: boolean; leaving: boolean; delay: number }) {
  // Ölçek saran div'de: Framer kök <svg>'ye transform yazınca orijini
  // fill-box'tan hesaplıyor, dalga katmandan kopup arada şerit açılıyordu.
  return (
    <motion.div
      className="absolute inset-x-0 top-[calc(100%-16vh)] h-[16vh]"
      initial={{ scaleY: 0.35 }}
      animate={leaving ? { scaleY: 1 } : { scaleY: 0.35 }}
      transition={{ duration: 0.85, ease: EASE_CURTAIN, delay }}
      style={{ originY: 0 }}
    >
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className={`-mt-px block h-[calc(100%+1px)] w-full ${flip ? '-scale-x-100' : ''} ${className}`}
      >
        <path d="M0 0 H1440 V52 C1300 104 1160 128 1010 98 C860 68 770 20 610 40 C440 62 320 134 160 124 C96 120 44 104 0 86 Z" />
      </svg>
    </motion.div>
  )
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('intro')
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

    let loaded = document.readyState === 'complete'
    const onLoad = () => { loaded = true }
    window.addEventListener('load', onLoad)

    // performance.now() navigasyon başından sayar — CSS sekansıyla aynı saat.
    let timer = 0
    const check = () => {
      const now = performance.now()
      if (now >= EXIT_AT_MS && (loaded || now >= MAX_WAIT_MS)) {
        setPhase('leaving')
        return
      }
      timer = window.setTimeout(check, now < EXIT_AT_MS ? EXIT_AT_MS - now : 80)
    }
    check()

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', onLoad)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return
    // Hero animasyonları perde kalkarken başlasın
    const t = setTimeout(markIntroDone, 360)
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
  const leaving = phase === 'leaving'

  return (
    <div ref={rootRef} className="op-preloader fixed inset-0 z-[400] overflow-hidden" aria-hidden="true">
      {/* Arka perde — altın. Öndeki kalkarken arada altın bir dalga şeridi
          süpürülür. Katmanlar ekranın 16vh altına taşar: dalga kenarı
          durağanken görünmez, yalnızca yukarı çekilirken belirir. */}
      <motion.div
        className="absolute inset-x-0 top-0 -bottom-[16vh]"
        initial={{ y: 0 }}
        animate={leaving ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE_CURTAIN, delay: 0.1 }}
        onAnimationComplete={() => { if (leaving) finish() }}
      >
        <div className="absolute inset-x-0 top-0 bottom-[16vh] bg-gold" />
        <WaveEdge className="fill-gold" flip leaving={leaving} delay={0.1} />
      </motion.div>

      {/* Ön perde — harita */}
      <motion.div
        className="absolute inset-x-0 top-0 -bottom-[16vh]"
        initial={{ y: 0 }}
        animate={leaving ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE_CURTAIN }}
      >
        <div className="absolute inset-x-0 top-0 bottom-[16vh] overflow-hidden bg-ocean-deep">
          {/* Harita zemini — enlem/boylam ağı + merkezde ışık havuzu */}
          <div className="op-graticule op-i-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgb(var(--gold)/0.09),transparent_70%)]" />

          {/* Red Line — dikine kıta, pusulanın arkasından geçer */}
          <div className="op-i-redline pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent_4%,rgb(var(--luffy)/0.35)_30%,rgb(var(--luffy)/0.35)_40%,transparent_50%,transparent_68%,rgb(var(--luffy)/0.2)_82%,transparent_98%)]" />

          <motion.div
            className="relative flex h-dvh flex-col items-center justify-center px-6"
            initial={false}
            animate={leaving ? { y: -48, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE_CURTAIN }}
          >
            <div className="relative flex w-full justify-center">
              {/* Grand Line rotası — pusulanın merkezinden geçen yatay bant.
                  `slice`: mobilde bant kırpılır, çizgi kalınlığı bozulmaz. */}
              <svg
                viewBox="0 0 1440 240"
                preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[160px] w-screen sm:h-[240px] -translate-x-1/2 -translate-y-1/2"
                fill="none"
              >
                {/* Calm Belt — rotanın iki yanındaki sakin kuşak */}
                <g className="op-i-fade [animation-delay:200ms]" stroke="rgb(var(--sea-light) / 0.2)" strokeWidth="1" strokeDasharray="1 7">
                  <path d="M0 52 H1440" />
                  <path d="M0 188 H1440" />
                </g>

                {/* Dümen suyu — kesikli, rotanın biraz altında */}
                <g transform="translate(0 10)">
                  <path
                    className="op-i-wake"
                    d={ROUTE}
                    stroke="rgb(var(--sea-light) / 0.45)"
                    strokeWidth="1.25"
                    strokeDasharray="3 9"
                  />
                </g>

                {/* Altın halat */}
                <path
                  className="op-i-route"
                  d={ROUTE}
                  pathLength={1}
                  stroke="rgb(var(--gold))"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                />

                {ISLANDS.map((isl) => (
                  <g key={isl.x} className="op-i-pop" style={{ animationDelay: `${isl.delay}ms` }}>
                    <circle cx={isl.x} cy={isl.y} r="9" stroke="rgb(var(--gold) / 0.45)" strokeWidth="1" />
                    <circle cx={isl.x} cy={isl.y} r="3.5" fill="rgb(var(--gold))" />
                    <text
                      x={isl.x}
                      y={isl.above ? isl.y - 20 : isl.y + 30}
                      textAnchor="middle"
                      className="hidden fill-pirate-muted font-mono sm:inline text-[10px] font-bold uppercase tracking-[0.24em]"
                    >
                      {isl.name}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Pusula — halka çizilir, iğne döner ve Grand Line'a (doğuya) oturur */}
              <div className="relative">
                <div className="op-i-fade absolute inset-[6%] rounded-full bg-ocean-deep" />
                <svg viewBox="0 0 72 72" className="relative h-20 w-20 sm:h-28 sm:w-28" fill="none">
                  <circle
                    className="op-i-ring"
                    cx="36" cy="36" r="32"
                    pathLength={1}
                    transform="rotate(-90 36 36)"
                    stroke="rgb(var(--gold))" strokeWidth="2.5"
                  />
                  <circle
                    className="op-i-dashring"
                    cx="36" cy="36" r="25"
                    stroke="rgb(var(--sea-light) / 0.4)" strokeWidth="1" strokeDasharray="2 5"
                  />
                  {/* Yön çentikleri — K/D/G/B */}
                  <g className="op-i-fade [animation-delay:500ms]" stroke="rgb(var(--gold) / 0.7)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M36 1.5 V6" />
                    <path d="M70.5 36 H66" />
                    <path d="M36 70.5 V66" />
                    <path d="M1.5 36 H6" />
                  </g>
                  <g className="op-i-needle">
                    <path d="M36 9 L42 36 L36 63 L30 36 Z" fill="rgb(var(--gold))" />
                    <path d="M9 36 L36 31 L63 36 L36 41 Z" fill="rgb(var(--sea-light) / 0.9)" />
                    <circle cx="36" cy="36" r="5.5" fill="rgb(var(--ocean-deep))" stroke="rgb(var(--gold))" strokeWidth="2.5" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Lockup — harfler maskeden yükselir, HUB yandan kayar */}
            <div className="mt-9 flex items-baseline gap-3 sm:mt-11">
              <span className="flex overflow-hidden pb-[0.08em] text-3xl font-extrabold tracking-[0.08em] text-pirate-text sm:text-5xl">
                {NAME.map((ch, i) => (
                  <span
                    key={i}
                    className="op-i-rise inline-block"
                    style={{ animationDelay: `${620 + i * 35}ms` }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
              <span className="op-i-slide font-mono text-xs font-bold tracking-[0.4em] text-gold sm:text-sm">
                HUB
              </span>
            </div>

            {/* İnce altın çizgi — lockup'ın altından ortadan açılır */}
            <div className="op-i-line mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold/70 to-transparent sm:w-32" />
          </motion.div>
        </div>
        <WaveEdge className="fill-ocean-deep" leaving={leaving} delay={0} />
      </motion.div>
    </div>
  )
}

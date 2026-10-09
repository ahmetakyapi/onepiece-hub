'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, type ElementType } from 'react'
import { EASE_REVEAL } from '@/lib/motion'

/* Maskeli kelime açılışı — her kelime kendi `overflow: hidden` kutusunun
   altından hafif bir eğimle yükselir. Ödüllü sitelerin başlık imzası.

   Erişilebilirlik: görsel kelimeler `aria-hidden`, tam metin `sr-only`
   kopyada. Ekran okuyucu bölünmüş kelimeleri tek tek okumaz.

   `parts` ile tek başlıkta farklı stil taşıyan parçalar verilebilir
   (ör. altın degrade + düz metin). Degrade sınıfı kelime başına uygulanır. */

type Part = { text: string; className?: string }

type Props = {
  text?: string
  parts?: Part[]
  as?: ElementType
  className?: string
  /** Kelimeler arası gecikme (sn) */
  stagger?: number
  delay?: number
  /** `true` → mount'ta oynar; `false` → bekler; verilmezse görünür olunca. */
  play?: boolean
  /** Satır sonu: `parts` içinde bu indeksten sonra `<br>` (mobil/desktop sınıfıyla) */
  breakAfter?: { index: number; className?: string }[]
}

export default function SplitText({
  text,
  parts,
  as: Tag = 'span',
  className,
  stagger = 0.06,
  delay = 0,
  play,
  breakAfter = [],
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduced = useReducedMotion()
  const active = play ?? inView

  const segments: Part[] = parts ?? [{ text: text ?? '' }]
  const full = segments.map((p) => p.text).join(' ')

  let wordIndex = 0

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {segments.map((part, pi) => {
          const words = part.text.split(' ').filter(Boolean)
          const br = breakAfter.find((b) => b.index === pi)
          return (
            <span key={pi}>
              {words.map((word, wi) => {
                const i = wordIndex++
                return (
                  <span key={wi}>
                    <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                      <motion.span
                        className={`inline-block will-change-transform ${part.className ?? ''}`}
                        initial={reduced ? false : { y: '115%', rotate: 5 }}
                        animate={active || reduced ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 5 }}
                        transition={{ duration: 0.95, ease: EASE_REVEAL, delay: delay + i * stagger }}
                        style={{ transformOrigin: '0% 100%' }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {wi < words.length - 1 ? ' ' : null}
                  </span>
                )
              })}
              {br ? <br className={br.className} /> : pi < segments.length - 1 ? ' ' : null}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}

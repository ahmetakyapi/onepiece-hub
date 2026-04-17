'use client'

import { memo, useMemo } from 'react'

const GLYPHS = [
  '卍', '風', '海', '王', '龍', '空', '月', '火',
  '水', '光', '影', '聖', '神', '古', '真', '旅',
  '⊿', '◯', '☗', '✧', '卆', '凸', '♆', '⚓',
]

type Column = {
  id: number
  left: string
  delay: number
  duration: number
  chars: string[]
  fontSize: number
  opacity: number
}

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildColumns(count: number, seed: number): Column[] {
  const rand = seeded(seed)
  return Array.from({ length: count }).map((_, i) => {
    const charCount = 6 + Math.floor(rand() * 5)
    const chars = Array.from({ length: charCount }).map(
      () => GLYPHS[Math.floor(rand() * GLYPHS.length)],
    )
    return {
      id: i,
      left: `${(i / count) * 100 + rand() * (80 / count)}%`,
      delay: rand() * -24,
      duration: 24 + rand() * 22,
      chars,
      fontSize: 14 + Math.floor(rand() * 12),
      opacity: 0.18 + rand() * 0.35,
    }
  })
}

function PoneglyphOverlay() {
  const columns = useMemo(() => buildColumns(14, 42), [])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dark scrim so glyphs read against the hero image */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/20 via-ocean-deep/10 to-ocean-deep/30" />

      {/* Falling glyph columns */}
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 flex flex-col gap-2 font-mono tabular-nums"
          style={{
            left: col.left,
            fontSize: `${col.fontSize}px`,
            color: 'rgba(244,163,0,0.85)',
            opacity: col.opacity,
            animation: `poneglyph-fall ${col.duration}s linear ${col.delay}s infinite`,
            textShadow: '0 0 8px rgba(244,163,0,0.35), 0 0 2px rgba(30,144,255,0.25)',
            willChange: 'transform',
          }}
        >
          {col.chars.map((c, idx) => (
            <span
              key={idx}
              style={{
                opacity: 1 - (idx / col.chars.length) * 0.8,
                letterSpacing: '0.08em',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      ))}

      {/* Overall fade top/bottom so glyphs enter/exit smoothly */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ocean-deep to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ocean-deep to-transparent" />

      <style jsx>{`
        @keyframes poneglyph-fall {
          0% { transform: translateY(-30vh); }
          100% { transform: translateY(130vh); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*='poneglyph-fall'] { animation-play-state: paused !important; }
        }
      `}</style>
    </div>
  )
}

export default memo(PoneglyphOverlay)

'use client'

/**
 * Reusable wave separator — ocean-themed section divider.
 * Variants: 'subtle' (default), 'bold', 'gold' control opacity and tint.
 */

type Props = {
  variant?: 'subtle' | 'bold' | 'gold'
  flip?: boolean
  className?: string
}

const CONFIGS = {
  subtle: {
    fill1: 'rgba(30,144,255,0.06)',
    fill2: 'rgba(30,144,255,0.03)',
  },
  bold: {
    fill1: 'rgba(30,144,255,0.10)',
    fill2: 'rgba(30,144,255,0.05)',
  },
  gold: {
    fill1: 'rgba(244,163,0,0.08)',
    fill2: 'rgba(244,163,0,0.04)',
  },
} as const

export default function WaveSeparator({ variant = 'subtle', flip = false, className = '' }: Props) {
  const { fill1, fill2 } = CONFIGS[variant]

  return (
    <div
      className={`pointer-events-none relative w-full overflow-hidden ${className}`}
      style={{ height: 80, transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 80 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,90 480,30 720,60 C960,90 1200,30 1440,60 L1440,120 L0,120 Z"
          fill={fill1}
        />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 50 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C360,50 720,100 1080,70 C1260,55 1380,85 1440,80 L1440,120 L0,120 Z"
          fill={fill2}
        />
      </svg>
    </div>
  )
}

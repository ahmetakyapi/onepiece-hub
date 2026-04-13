'use client'

/**
 * Multi-layered wave transition — pure CSS animations.
 * No Framer Motion overhead, GPU-accelerated via will-change: transform.
 */
export default function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: 140 }}>
      {/* Layer 1 — deep, slowest */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%] animate-ocean-wave-1 will-change-transform"
        style={{ height: 140 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C180,140 360,60 540,100 C720,140 900,60 1080,100 C1260,140 1380,80 1440,100 C1620,140 1800,60 1980,100 C2160,140 2340,60 2520,100 C2700,140 2820,80 2880,100 L2880,200 L0,200 Z"
          fill="rgba(30,144,255,0.08)"
        />
      </svg>

      {/* Layer 2 — mid */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%] animate-ocean-wave-2 will-change-transform"
        style={{ height: 100 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C240,80 480,150 720,120 C960,90 1200,150 1440,120 C1680,90 1920,150 2160,120 C2400,90 2640,150 2880,120 L2880,200 L0,200 Z"
          fill="rgba(30,144,255,0.05)"
        />
      </svg>

      {/* Layer 3 — front, gold tint */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%] animate-ocean-wave-3 will-change-transform"
        style={{ height: 60 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C360,130 720,170 1080,150 C1260,140 1380,160 1440,150 C1800,130 2160,170 2520,150 C2700,140 2820,160 2880,150 L2880,200 L0,200 Z"
          fill="rgba(244,163,0,0.04)"
        />
      </svg>

      {/* Layer 4 — foam, fastest */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%] animate-ocean-wave-4 will-change-transform"
        style={{ height: 35 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,170 C200,155 400,185 600,170 C800,155 1000,185 1200,170 C1400,155 1500,175 1440,170 C1640,155 1840,185 2040,170 C2240,155 2440,185 2640,170 C2840,155 2940,175 2880,170 L2880,200 L0,200 Z"
          fill="rgba(244,163,0,0.02)"
        />
      </svg>
    </div>
  )
}

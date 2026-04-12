'use client'

import { motion } from 'framer-motion'

/**
 * Multi-layered animated wave SVGs creating ocean depth illusion.
 * 4 layers with different speeds, directions, and colors.
 */
export default function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: 160 }}>
      {/* Layer 1 — deep, slowest */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ height: 160 }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C180,140 360,60 540,100 C720,140 900,60 1080,100 C1260,140 1380,80 1440,100 C1620,140 1800,60 1980,100 C2160,140 2340,60 2520,100 C2700,140 2820,80 2880,100 L2880,200 L0,200 Z"
          fill="rgba(30,144,255,0.12)"
        />
      </motion.svg>

      {/* Layer 2 — mid */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ height: 120 }}
        animate={{ x: ['-50%', '0%'] }}
        transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C240,80 480,150 720,120 C960,90 1200,150 1440,120 C1680,90 1920,150 2160,120 C2400,90 2640,150 2880,120 L2880,200 L0,200 Z"
          fill="rgba(30,144,255,0.08)"
        />
      </motion.svg>

      {/* Layer 3 — front, gold tint */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ height: 80 }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C360,130 720,170 1080,150 C1260,140 1380,160 1440,150 C1800,130 2160,170 2520,150 C2700,140 2820,160 2880,150 L2880,200 L0,200 Z"
          fill="rgba(244,163,0,0.06)"
        />
      </motion.svg>

      {/* Layer 4 — foam, fastest, subtle */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-[200%]"
        style={{ height: 50 }}
        animate={{ x: ['-50%', '0%'] }}
        transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,170 C200,155 400,185 600,170 C800,155 1000,185 1200,170 C1400,155 1500,175 1440,170 C1640,155 1840,185 2040,170 C2240,155 2440,185 2640,170 C2840,155 2940,175 2880,170 L2880,200 L0,200 Z"
          fill="rgba(244,163,0,0.03)"
        />
      </motion.svg>
    </div>
  )
}

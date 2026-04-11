'use client'

import { motion } from 'framer-motion'

export default function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: 200 }}>
      {/* Back wave — slower, darker */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 180 }}
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C180,140 360,60 540,100 C720,140 900,60 1080,100 C1260,140 1380,80 1440,100 L1440,200 L0,200 Z"
          fill="rgba(30,144,255,0.12)"
        />
      </motion.svg>

      {/* Middle wave */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 140 }}
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C240,80 480,150 720,120 C960,90 1200,150 1440,120 L1440,200 L0,200 Z"
          fill="rgba(30,144,255,0.08)"
        />
      </motion.svg>

      {/* Front wave — faster, gold tint */}
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 100 }}
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C360,130 720,170 1080,150 C1260,140 1380,160 1440,150 L1440,200 L0,200 Z"
          fill="rgba(244,163,0,0.06)"
        />
      </motion.svg>
    </div>
  )
}

'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Compass, Film, Users, Clock } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS = [
  { label: 'Arc', value: 36, suffix: '', icon: Compass, color: '#f4a300' },
  { label: 'Bölüm', value: 463, suffix: '', icon: Film, color: '#1e90ff' },
  { label: 'Karakter', value: 65, suffix: '', icon: Users, color: '#f4a300' },
  { label: 'Saat İçerik', value: 189, suffix: '+', icon: Clock, color: '#1e90ff' },
] as const

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 2200
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 4)
      setCurrent(Math.min(Math.round(value * eased), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span className="stat-number">{current.toLocaleString()}{suffix}</span>
}

function RingProgress({ color, inView, delay }: { color: string; inView: boolean; delay: number }) {
  const r = 38
  const circumference = 2 * Math.PI * r

  return (
    <svg viewBox="0 0 92 92" className="absolute inset-0 h-full w-full">
      {/* Track */}
      <circle
        cx="46" cy="46" r={r}
        fill="none"
        stroke="rgba(30,144,255,0.06)"
        strokeWidth="3"
      />
      {/* Full ring */}
      <motion.circle
        cx="46" cy="46" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={inView ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 1.8, ease: EASE, delay }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        opacity={0.5}
      />
    </svg>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative mx-auto max-w-4xl"
    >
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-32 -top-20 h-48 w-48 rounded-full bg-gold/[0.04] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-32 h-48 w-48 rounded-full bg-sea/[0.04] blur-[80px]" />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.12 }}
            className="group flex flex-col items-center gap-2 text-center sm:gap-2.5 md:gap-3"
          >
            {/* Ring + Icon */}
            <div className="relative flex h-14 w-14 items-center justify-center sm:h-[72px] sm:w-[72px] md:h-[92px] md:w-[92px]">
              <RingProgress
                color={stat.color}
                inView={inView}
                delay={0.2 + i * 0.15}
              />
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-pirate-border/30 bg-ocean-surface/60 transition-all duration-500 group-hover:border-gold/20 group-hover:shadow-[0_0_24px_rgba(244,163,0,0.08)] sm:h-12 sm:w-12">
                <stat.icon className="h-4 w-4 transition-transform duration-500 group-hover:scale-110 sm:h-5 sm:w-5" style={{ color: stat.color }} />
              </div>
            </div>

            {/* Number */}
            <span className="text-2xl font-extrabold text-pirate-text sm:text-4xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
            </span>

            {/* Label */}
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-pirate-muted sm:text-[11px]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

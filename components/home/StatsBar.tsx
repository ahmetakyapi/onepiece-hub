'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Compass, Film, Users, Clock } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS = [
  { label: 'Arc', value: 32, suffix: '', icon: Compass, color: '#f4a300', max: 40 },
  { label: 'Bölüm', value: 341, suffix: '', icon: Film, color: '#1e90ff', max: 400 },
  { label: 'Karakter', value: 61, suffix: '', icon: Users, color: '#f4a300', max: 80 },
  { label: 'Saat İçerik', value: 136, suffix: '+', icon: Clock, color: '#1e90ff', max: 200 },
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

function RingProgress({ percent, color, inView, delay }: { percent: number; color: string; inView: boolean; delay: number }) {
  const r = 38
  const circumference = 2 * Math.PI * r

  return (
    <svg width="92" height="92" viewBox="0 0 92 92" className="absolute inset-0">
      {/* Track */}
      <circle
        cx="46" cy="46" r={r}
        fill="none"
        stroke="rgba(30,144,255,0.06)"
        strokeWidth="3"
      />
      {/* Progress */}
      <motion.circle
        cx="46" cy="46" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={inView ? { strokeDashoffset: circumference * (1 - percent) } : {}}
        transition={{ duration: 1.8, ease: EASE, delay }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        opacity={0.5}
      />
      {/* Glow dot at end */}
      {inView && (
        <motion.circle
          cx="46" cy="46" r="2"
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.3] }}
          transition={{ duration: 1.5, delay: delay + 1 }}
          style={{
            transform: `rotate(${percent * 360 - 90}deg) translateX(${r}px)`,
            transformOrigin: '46px 46px',
          }}
        />
      )}
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
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.12 }}
            className="group flex flex-col items-center gap-3 text-center"
          >
            {/* Ring + Icon */}
            <div className="relative flex h-[92px] w-[92px] items-center justify-center">
              <RingProgress
                percent={stat.value / stat.max}
                color={stat.color}
                inView={inView}
                delay={0.2 + i * 0.15}
              />
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-pirate-border/30 bg-ocean-surface/60 transition-all duration-500 group-hover:border-gold/20 group-hover:shadow-[0_0_24px_rgba(244,163,0,0.08)]">
                <stat.icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" style={{ color: stat.color }} />
              </div>
            </div>

            {/* Number */}
            <span className="text-3xl font-extrabold text-pirate-text sm:text-4xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
            </span>

            {/* Label */}
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-pirate-muted">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

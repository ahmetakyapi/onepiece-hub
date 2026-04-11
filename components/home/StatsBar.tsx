'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Compass, Film, Users, Clock } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const STATS = [
  { label: 'Arc', value: 32, suffix: '', icon: Compass, color: 'text-gold' },
  { label: 'Bölüm', value: 341, suffix: '', icon: Film, color: 'text-sea' },
  { label: 'Karakter', value: 61, suffix: '', icon: Users, color: 'text-gold' },
  { label: 'Saat İçerik', value: 136, suffix: '+', icon: Clock, color: 'text-sea' },
] as const

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3) // easeOutCubic
      setCurrent(Math.min(Math.round(value * eased), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span>{current}{suffix}</span>
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl"
    >
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-sea/5 blur-3xl" />

      {/* Main container */}
      <div className="surface rounded-2xl border border-pirate-border p-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.1 }}
              className="group flex flex-col items-center gap-3 text-center"
            >
              {/* Icon with glow ring */}
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-gold/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-surface border border-pirate-border/50 transition-all group-hover:border-gold/30 group-hover:shadow-gold-glow">
                  <stat.icon className={`h-5 w-5 ${stat.color} transition-transform group-hover:scale-110`} />
                </div>
              </div>

              {/* Number */}
              <span className="text-3xl font-extrabold text-pirate-text sm:text-4xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
              </span>

              {/* Label */}
              <span className="text-xs font-semibold uppercase tracking-wider text-pirate-muted">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

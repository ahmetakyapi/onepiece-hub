'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Compass, Film, Users, Clock } from 'lucide-react'

const STATS = [
  { label: 'Arc', value: 32, icon: Compass },
  { label: 'Bölüm', value: 341, icon: Film },
  { label: 'Karakter', value: 36, icon: Users },
  { label: 'Saat İçerik', value: 136, icon: Clock },
] as const

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const steps = 40
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span>{current}</span>
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="surface mx-auto max-w-4xl rounded-2xl border border-pirate-border p-6 shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
            <stat.icon className="h-5 w-5 text-gold" />
            <span className="text-2xl font-extrabold text-gold sm:text-3xl">
              <AnimatedNumber value={stat.value} inView={inView} />
            </span>
            <span className="text-xs font-medium text-pirate-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

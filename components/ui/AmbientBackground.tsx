'use client'

import { cn } from '@/lib/utils'

type AmbientTheme = 'ocean' | 'battle' | 'mystery' | 'adventure' | 'danger' | 'celebration'

interface AmbientBackgroundProps {
  theme: AmbientTheme
  className?: string
  intensity?: 'subtle' | 'normal' | 'strong'
}

const AMBIENT_CONFIGS: Record<AmbientTheme, { orbs: Array<{ color: string; size: string; position: string; animation: string }> }> = {
  ocean: {
    orbs: [
      { color: 'rgb(var(--sea) / 0.08)', size: 'w-[500px] h-[400px]', position: 'top-[10%] -left-[10%]', animation: 'animate-float-slow' },
      { color: 'rgb(var(--sea) / 0.05)', size: 'w-[400px] h-[500px]', position: 'bottom-[10%] -right-[5%]', animation: 'animate-float-delayed' },
      { color: 'rgb(var(--sea-light) / 0.04)', size: 'w-[300px] h-[300px]', position: 'top-[50%] left-[30%]', animation: 'animate-float' },
    ],
  },
  battle: {
    orbs: [
      { color: 'rgb(var(--luffy) / 0.08)', size: 'w-[500px] h-[400px]', position: 'top-[5%] -right-[10%]', animation: 'animate-float' },
      { color: 'rgb(var(--gold) / 0.06)', size: 'w-[400px] h-[400px]', position: 'bottom-[15%] -left-[5%]', animation: 'animate-float-delayed' },
      { color: 'rgb(var(--luffy) / 0.04)', size: 'w-[300px] h-[300px]', position: 'top-[40%] left-[50%]', animation: 'animate-float-slow' },
    ],
  },
  mystery: {
    orbs: [
      { color: 'rgb(var(--fruit-deep) / 0.08)', size: 'w-[500px] h-[500px]', position: 'top-[10%] -left-[10%]', animation: 'animate-float-slow' },
      { color: 'rgb(var(--sea) / 0.05)', size: 'w-[400px] h-[300px]', position: 'bottom-[20%] -right-[5%]', animation: 'animate-float' },
      { color: 'rgb(var(--fruit-deep) / 0.04)', size: 'w-[350px] h-[350px]', position: 'top-[60%] left-[20%]', animation: 'animate-float-delayed' },
    ],
  },
  adventure: {
    orbs: [
      { color: 'rgb(var(--gold) / 0.08)', size: 'w-[500px] h-[400px]', position: 'top-[5%] -left-[5%]', animation: 'animate-float' },
      { color: 'rgb(var(--sea) / 0.06)', size: 'w-[400px] h-[500px]', position: 'bottom-[10%] -right-[10%]', animation: 'animate-float-slow' },
      { color: 'rgb(var(--gold) / 0.04)', size: 'w-[300px] h-[300px]', position: 'top-[45%] left-[40%]', animation: 'animate-float-delayed' },
    ],
  },
  danger: {
    orbs: [
      { color: 'rgb(var(--luffy) / 0.10)', size: 'w-[600px] h-[400px]', position: 'top-[5%] left-[20%]', animation: 'animate-float' },
      { color: 'rgb(var(--luffy) / 0.05)', size: 'w-[400px] h-[400px]', position: 'bottom-[10%] -right-[5%]', animation: 'animate-float-delayed' },
    ],
  },
  celebration: {
    orbs: [
      { color: 'rgb(var(--gold) / 0.10)', size: 'w-[500px] h-[400px]', position: 'top-[10%] -left-[5%]', animation: 'animate-float' },
      { color: 'rgb(var(--gold-bright) / 0.06)', size: 'w-[400px] h-[500px]', position: 'bottom-[5%] -right-[10%]', animation: 'animate-float-slow' },
      { color: 'rgb(var(--gold) / 0.04)', size: 'w-[300px] h-[300px]', position: 'top-[50%] left-[50%]', animation: 'animate-float-delayed' },
    ],
  },
}

export default function AmbientBackground({ theme, className, intensity = 'normal' }: AmbientBackgroundProps) {
  const config = AMBIENT_CONFIGS[theme]
  const opacityMultiplier = intensity === 'subtle' ? 0.5 : intensity === 'strong' ? 1.5 : 1

  return (
    <div className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)} aria-hidden="true">
      {config.orbs.map((orb, i) => (
        <div
          key={i}
          className={cn('absolute rounded-full blur-[80px]', orb.size, orb.position, orb.animation)}
          style={{
            background: orb.color,
            opacity: opacityMultiplier,
          }}
        />
      ))}
    </div>
  )
}

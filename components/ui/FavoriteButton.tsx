'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  targetType: string
  targetSlug: string
  className?: string
}

/* Heart particle directions for burst effect */
const PARTICLES = [
  { px: '-12px', py: '-18px' },
  { px: '14px', py: '-16px' },
  { px: '-18px', py: '-4px' },
  { px: '18px', py: '-6px' },
  { px: '-8px', py: '-22px' },
  { px: '10px', py: '-20px' },
]

export default function FavoriteButton({ targetType, targetSlug, className = '' }: Props) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showBurst, setShowBurst] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch('/api/favorites')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.favorites) {
          const exists = data.data.favorites.some(
            (f: { targetType: string; targetSlug: string }) =>
              f.targetType === targetType && f.targetSlug === targetSlug,
          )
          setFavorited(exists)
        }
      })
  }, [user, targetType, targetSlug])

  const triggerBurst = useCallback(() => {
    setShowBurst(true)
    setTimeout(() => setShowBurst(false), 600)
  }, [])

  if (!user) return null

  const toggle = async () => {
    if (loading) return
    setLoading(true)

    const wasFavorited = favorited
    // Optimistic update
    setFavorited((prev) => !prev)

    // Trigger burst animation when favoriting
    if (!wasFavorited) triggerBurst()

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetSlug }),
      })
      const data = await res.json()
      if (res.ok) {
        setFavorited(data.data.favorited)
      } else {
        // Revert on error
        setFavorited((prev) => !prev)
      }
    } catch {
      setFavorited((prev) => !prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${
        favorited
          ? 'border-luffy/30 bg-luffy/10 text-luffy'
          : 'border-pirate-border/30 bg-ocean-surface/30 text-pirate-muted/50 hover:border-luffy/20 hover:text-luffy/70'
      } ${className}`}
      title={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
      aria-pressed={favorited}
      aria-label={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-300 ${favorited ? 'fill-luffy' : ''}`}
        style={favorited ? { animation: 'heart-burst 0.5s ease-out' } : undefined}
      />

      {/* Particle burst */}
      <AnimatePresence>
        {showBurst && (
          <>
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 0, x: parseInt(p.px), y: parseInt(p.py) }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.02 }}
                className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-luffy"
              />
            ))}
            {/* Ring burst */}
            <motion.span
              initial={{ opacity: 0.6, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 rounded-xl border-2 border-luffy/40"
            />
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

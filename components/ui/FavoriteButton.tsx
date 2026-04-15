'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  targetType: string
  targetSlug: string
  className?: string
}

export default function FavoriteButton({ targetType, targetSlug, className = '' }: Props) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

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

  if (!user) return null

  const toggle = async () => {
    if (loading) return
    setLoading(true)

    // Optimistic update
    setFavorited((prev) => !prev)

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
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${
        favorited
          ? 'border-luffy/30 bg-luffy/10 text-luffy'
          : 'border-pirate-border/30 bg-ocean-surface/30 text-pirate-muted/50 hover:border-luffy/20 hover:text-luffy/70'
      } ${className}`}
      title={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-300 ${favorited ? 'fill-luffy' : ''}`}
      />
    </motion.button>
  )
}

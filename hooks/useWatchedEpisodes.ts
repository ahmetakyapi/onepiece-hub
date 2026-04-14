'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'onepiece-watched'

function getLocal(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function persistLocal(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useWatchedEpisodes() {
  const { user } = useAuth()
  const [watched, setWatched] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  // Load watched episodes — from DB if logged in, localStorage if not
  // Login sonrası localStorage verilerini DB'ye senkronize et
  useEffect(() => {
    if (user) {
      const localEpisodes = getLocal()

      fetch('/api/progress')
        .then((r) => (r.ok ? r.json() : null))
        .then(async (data) => {
          const dbSlugs: string[] = data?.data?.progress
            ? data.data.progress.map((p: { episodeSlug: string }) => p.episodeSlug)
            : []

          // localStorage'da olup DB'de olmayan bölümleri sync et
          if (localEpisodes.size > 0) {
            const onlyLocal = [...localEpisodes].filter((s) => !dbSlugs.includes(s))
            if (onlyLocal.length > 0) {
              try {
                await fetch('/api/progress/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ episodes: onlyLocal }),
                })
              } catch { /* sync başarısız olsa da devam et */ }
            }
            // Sync tamamlandı, localStorage'ı temizle
            localStorage.removeItem(STORAGE_KEY)
          }

          // Birleşik set: DB + localStorage
          const merged = new Set([...dbSlugs, ...localEpisodes])
          setWatched(merged)
        })
        .catch(() => {
          // API hatası — localStorage'a fallback
          setWatched(getLocal())
        })
        .finally(() => setLoaded(true))
    } else {
      setWatched(getLocal())
      setLoaded(true)
    }
  }, [user])

  const toggle = useCallback((episodeSlug: string, arcSlug: string) => {
    setWatched((prev) => {
      const next = new Set(prev)
      const adding = !next.has(episodeSlug)

      if (adding) {
        next.add(episodeSlug)
      } else {
        next.delete(episodeSlug)
      }

      if (user) {
        // Sync to DB
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arcSlug, episodeSlug }),
        })
      } else {
        persistLocal(next)
      }

      return next
    })
  }, [user])

  // Mark as watched without toggling — for auto-marking when episode is opened
  const markWatched = useCallback((episodeSlug: string, arcSlug: string) => {
    setWatched((prev) => {
      if (prev.has(episodeSlug)) return prev // already watched, no-op

      const next = new Set(prev)
      next.add(episodeSlug)

      if (user) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arcSlug, episodeSlug }),
        })
      } else {
        persistLocal(next)
      }

      return next
    })
  }, [user])

  const isWatched = useCallback(
    (episodeSlug: string) => watched.has(episodeSlug),
    [watched],
  )

  const watchedCount = useCallback(
    (episodeSlugs: string[]) => episodeSlugs.filter((s) => watched.has(s)).length,
    [watched],
  )

  return { watched, toggle, markWatched, isWatched, watchedCount, loaded }
}

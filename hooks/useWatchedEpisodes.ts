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
  useEffect(() => {
    if (user) {
      fetch('/api/progress')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.data?.progress) {
            const slugs = data.data.progress.map((p: { episodeSlug: string }) => p.episodeSlug)
            setWatched(new Set(slugs))
          }
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

  const isWatched = useCallback(
    (episodeSlug: string) => watched.has(episodeSlug),
    [watched],
  )

  const watchedCount = useCallback(
    (episodeSlugs: string[]) => episodeSlugs.filter((s) => watched.has(s)).length,
    [watched],
  )

  return { watched, toggle, isWatched, watchedCount, loaded }
}

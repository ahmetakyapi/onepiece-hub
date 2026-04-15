import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { watchProgress } from '@/lib/schema'
import { ok, err, serverErr } from '@/lib/api'
import { verifyToken } from '@/lib/token'
import { eq } from 'drizzle-orm'
import { ARCS } from '@/lib/constants/arcs'

type SyncItem = { episodeSlug: string; arcSlug: string }

function resolveArcSlug(episodeSlug: string): string | null {
  for (const arc of ARCS) {
    if (arc.episodes.some((ep) => ep.slug === episodeSlug)) return arc.slug
  }
  return null
}

// POST /api/progress/sync — localStorage verilerini DB'ye aktar (login sonrası)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapılmamış', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const { episodes } = (await req.json()) as { episodes: string[] }
    if (!Array.isArray(episodes) || episodes.length === 0) {
      return ok({ synced: 0 })
    }

    // Aşırı büyük istekleri engelle
    if (episodes.length > 500) {
      return err('En fazla 500 bölüm senkronize edilebilir', 400)
    }

    // Mevcut DB kayıtlarını al
    const existing = await db
      .select({ episodeSlug: watchProgress.episodeSlug })
      .from(watchProgress)
      .where(eq(watchProgress.userId, user.id))

    const existingSet = new Set(existing.map((e) => e.episodeSlug))

    // Sadece DB'de olmayan bölümleri ekle
    const toInsert: SyncItem[] = []
    for (const slug of episodes) {
      if (existingSet.has(slug)) continue
      const arcSlug = resolveArcSlug(slug)
      if (!arcSlug) continue
      toInsert.push({ episodeSlug: slug, arcSlug })
    }

    if (toInsert.length > 0) {
      await db.insert(watchProgress).values(
        toInsert.map((item) => ({
          userId: user.id,
          arcSlug: item.arcSlug,
          episodeSlug: item.episodeSlug,
        })),
      )
    }

    return ok({ synced: toInsert.length })
  } catch (e) {
    return serverErr(e)
  }
}

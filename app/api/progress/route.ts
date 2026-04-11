import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { watchProgress } from '@/lib/schema'
import { ok, err, serverErr } from '@/lib/api'
import { verifyToken } from '@/lib/token'
import { eq, and } from 'drizzle-orm'

// GET /api/progress — get all watched episodes for current user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapılmamış', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const progress = await db
      .select({
        arcSlug: watchProgress.arcSlug,
        episodeSlug: watchProgress.episodeSlug,
        watchedAt: watchProgress.watchedAt,
      })
      .from(watchProgress)
      .where(eq(watchProgress.userId, user.id))

    return ok({ progress })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/progress — toggle watched status
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapılmamış', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const { arcSlug, episodeSlug } = await req.json()
    if (!arcSlug || !episodeSlug) {
      return err('arcSlug ve episodeSlug gerekli', 400)
    }

    // Check if already watched
    const existing = await db
      .select({ id: watchProgress.id })
      .from(watchProgress)
      .where(
        and(
          eq(watchProgress.userId, user.id),
          eq(watchProgress.episodeSlug, episodeSlug),
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Remove — toggle off
      await db
        .delete(watchProgress)
        .where(eq(watchProgress.id, existing[0].id))

      return ok({ watched: false })
    }

    // Add — toggle on
    await db.insert(watchProgress).values({
      userId: user.id,
      arcSlug,
      episodeSlug,
    })

    return ok({ watched: true })
  } catch (e) {
    return serverErr(e)
  }
}

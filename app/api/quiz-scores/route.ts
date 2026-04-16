import { NextRequest } from 'next/server'
import { ok, err, serverErr, parseJSON } from '@/lib/api'
import { db } from '@/lib/db'
import { quizScores } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { eq, and } from 'drizzle-orm'

// GET /api/quiz-scores — kullanıcının tüm quiz skorlarını getir
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const scores = await db
      .select()
      .from(quizScores)
      .where(eq(quizScores.userId, user.id))

    return ok({ scores })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/quiz-scores — quiz skoru kaydet veya güncelle
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const body = await parseJSON<{ arcSlug: string; score: number; totalQ: number }>(req)
    if (!body) return err('Geçersiz JSON', 400)
    const { arcSlug, score, totalQ } = body

    if (!arcSlug || score == null || !totalQ) {
      return err('arcSlug, score ve totalQ gerekli', 400)
    }

    if (typeof score !== 'number' || typeof totalQ !== 'number' || score < 0 || score > totalQ) {
      return err('Geçersiz skor değerleri', 400)
    }

    // Mevcut skor var mı kontrol et
    const existing = await db
      .select()
      .from(quizScores)
      .where(
        and(
          eq(quizScores.userId, user.id),
          eq(quizScores.arcSlug, arcSlug),
        ),
      )

    if (existing.length > 0) {
      // Sadece daha yüksek skoru güncelle
      if (score > existing[0].score) {
        await db
          .update(quizScores)
          .set({ score, totalQ, completedAt: new Date() })
          .where(
            and(
              eq(quizScores.userId, user.id),
              eq(quizScores.arcSlug, arcSlug),
            ),
          )
      }
      return ok({ updated: true, score: Math.max(score, existing[0].score) })
    }

    await db.insert(quizScores).values({
      userId: user.id,
      arcSlug,
      score,
      totalQ,
    })

    return ok({ created: true, score }, 201)
  } catch (e) {
    return serverErr(e)
  }
}

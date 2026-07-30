import { NextRequest } from 'next/server'
import { ok, err, serverErr, parseJSON } from '@/lib/api'
import { db } from '@/lib/db'
import { quizScores } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { getQuizQuestionCount } from '@/lib/validation'
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

    /* Quiz gerçekten var mı — ve kaç sorusu var? İstemcinin bildirdiği
       totalQ'ya güvenmek "999999/999999" gibi uydurma skorlara izin
       veriyordu. Doğru soru sayısı veriden okunur. */
    const expectedTotal = getQuizQuestionCount(arcSlug)
    if (expectedTotal === null) {
      return err('Bu arc için quiz yok', 400)
    }

    if (typeof score !== 'number' || typeof totalQ !== 'number') {
      return err('Geçersiz skor değerleri', 400)
    }

    if (!Number.isInteger(score) || score < 0 || score > expectedTotal) {
      return err('Geçersiz skor değerleri', 400)
    }

    if (totalQ !== expectedTotal) {
      return err('Soru sayısı quiz ile uyuşmuyor', 400)
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

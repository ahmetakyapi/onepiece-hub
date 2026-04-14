import { NextRequest } from 'next/server'
import { ok, err, serverErr } from '@/lib/api'
import { db } from '@/lib/db'
import { quizScores } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { eq } from 'drizzle-orm'

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

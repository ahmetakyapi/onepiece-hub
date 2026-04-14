import { NextRequest } from 'next/server'
import { ok, err, serverErr } from '@/lib/api'
import { db } from '@/lib/db'
import { comments } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { eq, and, desc } from 'drizzle-orm'

// GET /api/comments?targetType=arc&targetSlug=xxx
export async function GET(req: NextRequest) {
  try {
    const targetType = req.nextUrl.searchParams.get('targetType')
    const targetSlug = req.nextUrl.searchParams.get('targetSlug')

    if (!targetType || !targetSlug) {
      return err('targetType ve targetSlug gerekli', 400)
    }

    const result = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.targetType, targetType),
          eq(comments.targetSlug, targetSlug),
        ),
      )
      .orderBy(desc(comments.createdAt))
      .limit(50)

    return ok({ comments: result })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const body = await req.json()
    const { targetType, targetSlug, content } = body

    if (!targetType || !targetSlug || !content) {
      return err('Tüm alanlar gerekli', 400)
    }

    if (content.length > 500) {
      return err('Yorum en fazla 500 karakter olabilir', 400)
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        userId: user.id,
        username: user.username,
        targetType,
        targetSlug,
        content: content.trim(),
      })
      .returning()

    return ok({ comment: newComment }, 201)
  } catch (e) {
    return serverErr(e)
  }
}

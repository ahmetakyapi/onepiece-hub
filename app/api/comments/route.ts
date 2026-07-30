import { NextRequest } from 'next/server'
import { ok, err, serverErr, parseJSON } from '@/lib/api'
import { stripHTML } from '@/lib/sanitize'
import { db } from '@/lib/db'
import { comments } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { isValidTarget } from '@/lib/validation'
import { eq, and, desc } from 'drizzle-orm'

const COMMENT_MIN_LENGTH = 2
const COMMENT_MAX_LENGTH = 500

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

    const body = await parseJSON<{ targetType: string; targetSlug: string; content: string }>(req)
    if (!body) return err('Geçersiz JSON', 400)
    const { targetType, targetSlug, content } = body

    if (!targetType || !targetSlug || typeof content !== 'string') {
      return err('Tüm alanlar gerekli', 400)
    }

    /* Hedef gerçek bir içeriğe işaret etmeli — yalnızca tip değil, slug da
       doğrulanır. Aksi halde uydurma slug'larla DB şişirilebiliyordu. */
    if (!isValidTarget(targetType, targetSlug)) {
      return err('Geçersiz yorum hedefi', 400)
    }

    /* HTML'i temizledikten SONRA ölç: "   " ya da "<b></b>" gibi girdiler
       eski kontrolü geçip DB'ye boş yorum olarak yazılıyordu. */
    const cleaned = stripHTML(content).trim()

    if (cleaned.length < COMMENT_MIN_LENGTH) {
      return err(`Yorum en az ${COMMENT_MIN_LENGTH} karakter olmalı`, 400)
    }

    if (cleaned.length > COMMENT_MAX_LENGTH) {
      return err(`Yorum en fazla ${COMMENT_MAX_LENGTH} karakter olabilir`, 400)
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        userId: user.id,
        username: user.username,
        targetType,
        targetSlug,
        content: cleaned,
      })
      .returning()

    return ok({ comment: newComment }, 201)
  } catch (e) {
    return serverErr(e)
  }
}

// DELETE /api/comments?id=xxx — kendi yorumunu sil
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const commentId = req.nextUrl.searchParams.get('id')
    if (!commentId) return err('Yorum ID gerekli', 400)

    // Sadece kendi yorumunu silebilir
    const existing = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, user.id),
        ),
      )

    if (existing.length === 0) {
      return err('Yorum bulunamadı veya yetkiniz yok', 404)
    }

    await db
      .delete(comments)
      .where(eq(comments.id, commentId))

    return ok({ deleted: true })
  } catch (e) {
    return serverErr(e)
  }
}

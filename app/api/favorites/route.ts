import { NextRequest } from 'next/server'
import { ok, err, serverErr, parseJSON } from '@/lib/api'
import { db } from '@/lib/db'
import { favorites } from '@/lib/schema'
import { verifyToken } from '@/lib/token'
import { FAVORITE_TARGET_TYPES, isValidTarget, type FavoriteTargetType } from '@/lib/validation'
import { eq, and } from 'drizzle-orm'

// GET /api/favorites — kullanıcının tüm favorilerini getir
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, user.id))

    return ok({ favorites: result })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/favorites — favori ekle veya kaldır (toggle)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapmalısınız', 401)

    const user = await verifyToken(token)
    if (!user) return err('Geçersiz oturum', 401)

    const body = await parseJSON<{ targetType: string; targetSlug: string }>(req)
    if (!body) return err('Geçersiz JSON', 400)
    const { targetType, targetSlug } = body

    if (!targetType || !targetSlug) {
      return err('targetType ve targetSlug gerekli', 400)
    }

    /* Hem tip hem slug doğrulanır — slug kontrolü olmadan uydurma
       hedeflerle sınırsız favori satırı yazılabiliyordu. */
    if (!FAVORITE_TARGET_TYPES.includes(targetType as FavoriteTargetType)) {
      return err('Geçersiz targetType', 400)
    }

    if (!isValidTarget(targetType, targetSlug)) {
      return err('Böyle bir içerik yok', 400)
    }

    // Mevcut favori var mı kontrol et
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, user.id),
          eq(favorites.targetType, targetType),
          eq(favorites.targetSlug, targetSlug),
        ),
      )

    if (existing.length > 0) {
      // Favoriden kaldır
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, user.id),
            eq(favorites.targetType, targetType),
            eq(favorites.targetSlug, targetSlug),
          ),
        )
      return ok({ favorited: false })
    }

    // Favorilere ekle
    await db.insert(favorites).values({
      userId: user.id,
      targetType,
      targetSlug,
    })

    return ok({ favorited: true }, 201)
  } catch (e) {
    return serverErr(e)
  }
}

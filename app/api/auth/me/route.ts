import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { ok, serverErr } from '@/lib/api'
import { verifyToken } from '@/lib/token'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'

export const dynamic = 'force-dynamic'

/* Oturum yoksa 200 + `user: null`. Bu uç bir "kim var?" sorusu, korumalı
   kaynak değil: misafir için 401 dönmek her sayfa açılışında tarayıcı
   konsoluna kırmızı bir hata basıyordu. Korumalı uçlar (progress,
   favorites, quiz-scores…) 401'i korur. */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return ok({ user: null })

    const payload = await verifyToken(token)
    if (!payload) return ok({ user: null })

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1)

    if (!user) return ok({ user: null })

    return ok({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      },
    })
  } catch (e) {
    return serverErr(e)
  }
}

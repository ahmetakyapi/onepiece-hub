import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { ok, err, serverErr } from '@/lib/api'
import { verifyToken } from '@/lib/token'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value
    if (!token) return err('Giriş yapılmamış', 401)

    const payload = await verifyToken(token)
    if (!payload) return err('Geçersiz oturum', 401)

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

    if (!user) return err('Kullanıcı bulunamadı', 404)

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

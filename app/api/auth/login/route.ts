import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { err, serverErr, parseJSON } from '@/lib/api'
import { eq, sql } from 'drizzle-orm'
import { verifyPassword, isLegacyHash, hashPassword } from '@/lib/password'
import { createToken } from '@/lib/token'
import { usernameKey } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await parseJSON<{ username: string; password: string }>(req)
    if (!body) {
      return err('Geçersiz JSON', 400)
    }
    const { username, password } = body

    if (!username || !password) {
      return err('Kullanıcı adı ve şifre gerekli', 400)
    }

    /* Kayıt büyük/küçük harf duyarsız benzersizlik kullanıyor — giriş de
       aynı şekilde eşleşmeli, yoksa "Ahmet" ile kaydolan "ahmet" ile giremez. */
    const [user] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = ${usernameKey(username)}`)
      .limit(1)

    /* Kullanıcı yok ve şifre yanlış durumları aynı mesajı döner — aksi halde
       hangi kullanıcı adlarının kayıtlı olduğu tek tek sınanabiliyordu. */
    const valid = user ? await verifyPassword(password, user.password) : false
    if (!user || !valid) {
      return err('Kullanıcı adı veya şifre hatalı', 401)
    }

    // Eski SHA-256 hash'i bcrypt'e otomatik migrate et
    if (isLegacyHash(user.password)) {
      const bcryptHash = await hashPassword(password)
      await db.update(users).set({ password: bcryptHash }).where(eq(users.id, user.id))
    }

    const token = await createToken({ id: user.id, username: user.username })

    const res = NextResponse.json({
      data: {
        user: { id: user.id, username: user.username, name: user.name },
      },
    })

    res.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return res
  } catch (e) {
    return serverErr(e)
  }
}

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { ok, err, serverErr } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/password'

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json()

    if (!username || !password) {
      return err('Kullanıcı adı ve şifre gerekli', 400)
    }

    if (username.length < 3 || username.length > 20) {
      return err('Kullanıcı adı 3-20 karakter olmalı', 400)
    }

    if (password.length < 6) {
      return err('Şifre en az 6 karakter olmalı', 400)
    }

    // Check if username exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (existing.length > 0) {
      return err('Bu kullanıcı adı zaten alınmış', 409)
    }

    const hashed = await hashPassword(password)

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashed,
        name: name || username,
      })
      .returning({ id: users.id, username: users.username, name: users.name })

    return ok({ user }, 201)
  } catch (e) {
    return serverErr(e)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { err, serverErr, parseJSON } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/password'
import { createToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  try {
    const body = await parseJSON<{ username: string; password: string; name?: string }>(req)
    if (!body) {
      return err('Geçersiz JSON', 400)
    }
    const { username, password, name } = body

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

    // Auto-login: set session cookie after registration
    const token = await createToken({ id: user.id, username: user.username })

    const res = NextResponse.json({ data: { user } }, { status: 201 })

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

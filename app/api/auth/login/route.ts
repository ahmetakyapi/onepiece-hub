import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { err, serverErr } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '@/lib/password'
import { createToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return err('Kullanıcı adı ve şifre gerekli', 400)
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      return err('Kullanıcı bulunamadı', 401)
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return err('Şifre hatalı', 401)
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

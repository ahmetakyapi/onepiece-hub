import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api'
import { verifyToken } from '@/lib/token'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  if (!token) return err('Giriş yapılmamış', 401)

  const payload = await verifyToken(token)
  if (!payload) return err('Geçersiz oturum', 401)

  return ok({ user: payload })
}

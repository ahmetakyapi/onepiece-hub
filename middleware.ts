import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PAGES = ['/profile']

const RATE_LIMIT_PATHS = ['/api/auth/login', '/api/auth/register']
const RATE_LIMIT_WINDOW = 60_000 // 1 dakika
const RATE_LIMIT_MAX = 10 // dakikada max istek

// Basit in-memory rate limiter (Edge runtime uyumlu)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string, path: string): boolean {
  const key = `${ip}:${path}`
  const now = Date.now()
  const entry = requestCounts.get(key)

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rate limiting — auth endpoint'leri için
  if (RATE_LIMIT_PATHS.some((p) => pathname.startsWith(p))) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip, pathname)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
        { status: 429 },
      )
    }
  }

  // Korumalı sayfa kontrolü — session cookie yoksa login'e yönlendir
  if (PROTECTED_PAGES.some((p) => pathname.startsWith(p))) {
    const session = req.cookies.get('session')?.value
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/api/auth/:path*'],
}

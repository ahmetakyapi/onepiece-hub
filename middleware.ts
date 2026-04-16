import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

const PROTECTED_PAGES = ['/profile']

const RATE_LIMIT_PATHS = ['/api/auth/login', '/api/auth/register']
const RATE_LIMIT_WINDOW = 60 // seconds
const RATE_LIMIT_MAX = 10 // requests per minute

// Upstash Redis — fallback to in-memory if no env vars (dev mode)
let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

// Fallback in-memory store for development
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

async function checkRateLimit(ip: string, path: string): Promise<boolean> {
  const key = `ratelimit:${ip}:${path}`

  try {
    if (redis) {
      // Upstash Redis rate limiting
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.expire(key, RATE_LIMIT_WINDOW)
      }
      return count > RATE_LIMIT_MAX
    }
  } catch (e) {
    console.error('Redis error, falling back to in-memory:', e)
  }

  // Fallback: in-memory rate limiting
  const now = Date.now()
  const entry = inMemoryStore.get(key)

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW * 1000 })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rate limiting — auth endpoint'leri için
  if (RATE_LIMIT_PATHS.some((p) => pathname.startsWith(p))) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const isLimited = await checkRateLimit(ip, pathname)
    if (isLimited) {
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

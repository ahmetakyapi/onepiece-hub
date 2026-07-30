import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis/cloudflare'

const PROTECTED_PAGES = ['/profile']

const RATE_LIMIT_WINDOW = 60 // saniye

/**
 * Yol öneki → dakikadaki azami istek.
 *
 * Auth en sıkı (brute-force yüzeyi). Yorumlar spam'e açık olduğu için düşük.
 * İzleme/favori kayıtları normal kullanımda hızlı tetiklenebildiği için daha
 * geniş — amaç kullanıcıyı engellemek değil, otomatik kötüye kullanımı kesmek.
 *
 * En uzun önek kazanır, bkz. `resolveRateLimit`.
 */
const RATE_LIMITS: { prefix: string; max: number }[] = [
  { prefix: '/api/auth/login', max: 10 },
  { prefix: '/api/auth/register', max: 5 },
  { prefix: '/api/comments', max: 20 },
  { prefix: '/api/quiz-scores', max: 30 },
  { prefix: '/api/favorites', max: 60 },
  { prefix: '/api/progress/sync', max: 10 },
  { prefix: '/api/progress', max: 120 },
]

/** Yola uyan en spesifik (en uzun önekli) limiti bul */
function resolveRateLimit(pathname: string): { prefix: string; max: number } | null {
  let match: { prefix: string; max: number } | null = null
  for (const rule of RATE_LIMITS) {
    if (pathname.startsWith(rule.prefix)) {
      if (!match || rule.prefix.length > match.prefix.length) match = rule
    }
  }
  return match
}

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

async function checkRateLimit(ip: string, path: string, max: number): Promise<boolean> {
  const key = `ratelimit:${ip}:${path}`

  try {
    if (redis) {
      // Upstash Redis rate limiting
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.expire(key, RATE_LIMIT_WINDOW)
      }
      return count > max
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
  return entry.count > max
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /* Rate limiting — yalnızca durum değiştiren istekler.
     GET'ler okuma amaçlı ve zaten kullanıcıya kapsamlı; onları limitlemek
     normal gezinmeyi bozar. */
  const rule = req.method !== 'GET' ? resolveRateLimit(pathname) : null
  if (rule) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const isLimited = await checkRateLimit(ip, rule.prefix, rule.max)
    if (isLimited) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
        {
          status: 429,
          headers: { 'Retry-After': String(RATE_LIMIT_WINDOW) },
        },
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
  /* RATE_LIMITS'e yeni bir /api yolu eklediğinde buraya da eklemeyi unutma —
     matcher dışındaki yollarda middleware hiç çalışmaz. */
  matcher: [
    '/profile/:path*',
    '/api/auth/:path*',
    '/api/comments/:path*',
    '/api/favorites/:path*',
    '/api/progress/:path*',
    '/api/quiz-scores/:path*',
  ],
}

/**
 * Environment variables validation
 * Runs on server startup — ensures all required vars are set
 */

const requiredEnv = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const

const missing = Object.entries(requiredEnv)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  throw new Error(
    `Eksik ortam değişkenleri:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\n.env.local dosyasını kontrol et.`
  )
}

export const env = {
  AUTH_SECRET: process.env.AUTH_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'One Piece Hub',
}

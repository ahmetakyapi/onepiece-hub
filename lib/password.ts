import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Eski SHA-256 formatıyla geriye dönük uyumluluk
  if (stored.includes(':')) {
    const { createHash } = await import('crypto')
    const [salt, hash] = stored.split(':')
    const attempt = createHash('sha256').update(password + salt).digest('hex')
    if (attempt === hash) return true
    return false
  }
  return bcrypt.compare(password, stored)
}

/** SHA-256 formatındaysa true döner — auto-migration için */
export function isLegacyHash(stored: string): boolean {
  return stored.includes(':')
}

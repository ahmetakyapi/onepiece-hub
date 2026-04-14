import { SignJWT, jwtVerify } from 'jose'

function getSecret() {
  const raw = process.env.AUTH_SECRET
  if (!raw) throw new Error('AUTH_SECRET ortam değişkeni tanımlanmamış — JWT imzalanamaz.')
  return new TextEncoder().encode(raw)
}

type TokenPayload = {
  id: string
  username: string
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { id: payload.id as string, username: payload.username as string }
  } catch {
    return null
  }
}

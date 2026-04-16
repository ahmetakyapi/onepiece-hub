import { NextResponse } from 'next/server'

/** Başarılı API yanıtı */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

/** Hata API yanıtı */
export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/** Sunucu hatası */
export function serverErr(e: unknown) {
  console.error(e)
  return err('Sunucu hatası', 500)
}

/** Request body JSON parse helper */
export async function parseJSON<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

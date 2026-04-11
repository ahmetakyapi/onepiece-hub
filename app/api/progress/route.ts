import { NextRequest } from 'next/server'
import { ok, err, serverErr } from '@/lib/api'

// GET /api/progress?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return err('userId gerekli', 400)

    // TODO: DB'den izleme geçmişini çek
    return ok({ progress: [] })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/progress
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, arcSlug, episodeSlug, completed } = body

    if (!userId || !episodeSlug) {
      return err('userId ve episodeSlug gerekli', 400)
    }

    // TODO: DB'ye izleme kaydı ekle/güncelle
    return ok({ success: true })
  } catch (e) {
    return serverErr(e)
  }
}

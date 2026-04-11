import { NextRequest } from 'next/server'
import { ok, err, serverErr } from '@/lib/api'

// GET /api/comments?targetType=arc&targetSlug=xxx
export async function GET(req: NextRequest) {
  try {
    const targetType = req.nextUrl.searchParams.get('targetType')
    const targetSlug = req.nextUrl.searchParams.get('targetSlug')

    if (!targetType || !targetSlug) {
      return err('targetType ve targetSlug gerekli', 400)
    }

    // TODO: DB'den yorumları çek
    return ok({ comments: [] })
  } catch (e) {
    return serverErr(e)
  }
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, targetType, targetSlug, content } = body

    if (!userId || !targetType || !targetSlug || !content) {
      return err('Tüm alanlar gerekli', 400)
    }

    // TODO: DB'ye yorum ekle
    return ok({ success: true })
  } catch (e) {
    return serverErr(e)
  }
}

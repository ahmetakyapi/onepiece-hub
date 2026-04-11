import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ data: { success: true } })
  res.cookies.set('session', '', { path: '/', maxAge: 0 })
  return res
}

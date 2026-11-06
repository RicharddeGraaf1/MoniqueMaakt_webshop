import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Health-check voor Coolify: app draait en database is bereikbaar
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ status: 'database onbereikbaar' }, { status: 503 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, price, image, stock, categoryId } = body

    // Check if slug already exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug bestaat al' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        image: image || null,
        stock: parseInt(stock),
        categoryId,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van het product' },
      { status: 500 }
    )
  }
}


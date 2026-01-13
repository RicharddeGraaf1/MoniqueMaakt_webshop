import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, price, image, stock, categoryId } = body

    // Check if slug already exists (excluding current product)
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        id: { not: params.id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug bestaat al' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
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
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het bijwerken van het product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwijderen van het product' },
      { status: 500 }
    )
  }
}


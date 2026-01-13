import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/ProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await requireAdmin()

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product bewerken</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}


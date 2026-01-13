import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/ProductForm'

export default async function NewProductPage() {
  await requireAdmin()

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nieuw product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}

